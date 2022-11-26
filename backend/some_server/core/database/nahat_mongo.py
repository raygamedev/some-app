from typing import Union

from pymongo.mongo_client import MongoClient, ConnectionFailure
from pymongo.collection import Collection, ReturnDocument, ObjectId
from pymongo.server_api import ServerApi
from pymongo.errors import OperationFailure, DuplicateKeyError
from uuid import UUID, uuid4

from nahat_server.core.config import MONGO_URL, MONGO_PORT
from nahat_server.core.schemas.schema import UserModel, UserCardModel, CardMarkModel
from nahat_server.core.logger import logger


USERS_COLLECTION = "nahat_users"
BARCODES_COLLECTION = 'nahat_barcodes'
CURRENT_BARCODE_ID = ObjectId('634846616d9e6b14ca875c7b')


class NahatMongoClient:
    def __init__(self, url=MONGO_URL, port=MONGO_PORT):
        self.url = url
        self.port = port
        self.client = MongoClient(host=self.url,
                                  port=self.port,
                                  server_api=ServerApi('1'),
                                  uuidRepresentation='standard')

        self.nahat_db = self.client["nahat"]
        self.validate_server_connection()
        self.users_collection: Collection = self.create_collection(USERS_COLLECTION)
        self.barcodes_collection: Collection = self.create_collection(BARCODES_COLLECTION)

    def validate_server_connection(self):
        try:
            self.client.server_info()
            logger.info("Connected to mongoDB")
        except ConnectionFailure as e:
            logger.error(e)
            logger.error("Unable to connect to Mongo server")
            raise AssertionError("Unable to connect to Mongo server")

    def debug_mongo_client(self):
        logger.info(self.nahat_db.list_collection_names())

    def create_collection(self, collection_name) -> Collection:
        try:
            logger.info(f"Getting collection: {collection_name}")
            return self.nahat_db.get_collection(collection_name)
        except OperationFailure as e:
            logger.warning(e)
            logger.info(f"Collection doesn't exist {collection_name}, creating...")
            return self.nahat_db.create_collection(collection_name)

    def get_users_collection_data(self):
        return self.users_collection.find()

    def insert_new_user(self, user: UserModel):
        self.users_collection.insert_one(user.dict(by_alias=True))

    def add_user_card(self, card: UserCardModel, user_guid: str):
        self.users_collection.update_one({"_id": UUID(user_guid)}, {"$unset": {"card": None}})
        res = self.users_collection.find_one_and_update(
            {"_id": UUID(user_guid)},
            {'$set': {'card': card.dict()}},
            return_document=ReturnDocument.AFTER)

        return res

    def add_user_barcode(self, user_guid: str, mark_data: CardMarkModel):
        logger.info(f"Adding user barcode to mongoDB {mark_data}, user: {user_guid}")
        res = self.users_collection.find_one_and_update(
            {"_id": UUID(user_guid)},
            {"$push": {"card.marks": mark_data.dict()}},
            return_document=ReturnDocument.AFTER,
            upsert=True)
        return res.get("card")

    def get_user(self, user_guid: str):
        return self.users_collection.find_one({"_id": UUID(user_guid)})

    def replace_current_barcode(self):
        barcode = str(uuid4())
        try:
            self.barcodes_collection.insert_one({"_id": CURRENT_BARCODE_ID,
                                                 "current_barcode": barcode})
        except DuplicateKeyError as e:
            logger.info(f'Key already exists {CURRENT_BARCODE_ID}')
            self.barcodes_collection.find_one_and_update({"_id": CURRENT_BARCODE_ID},
                                                         {'$set': {"current_barcode": barcode}})

        return barcode

    def get_current_barcode(self):
        logger.info(f"Getting current barcode")
        return self.barcodes_collection.find_one({"_id": CURRENT_BARCODE_ID}).get('current_barcode')

    def get_card_code(self, user_guid: str):
        logger.info(f"Getting card code for user {user_guid}")
        return self.users_collection.find_one({"_id": UUID(user_guid)}).get("card").get("code")


nahat_mongo_client = NahatMongoClient()
