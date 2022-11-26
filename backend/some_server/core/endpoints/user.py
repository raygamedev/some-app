from fastapi import APIRouter
from nahat_server.core.logger import logger
from nahat_server.core.database.nahat_mongo import nahat_mongo_client
from nahat_server.core.schemas.schema import UserModel

router = APIRouter(prefix='/user')


@router.get('/register')
async def user_register(user_guid: str):
    logger.info(f"Registering new user {user_guid}")
    nahat_mongo_client.insert_new_user(user=UserModel(_id=user_guid))
    return {"auth": True}


@router.get('/auth')
async def user_auth(user_guid: str):
    logger.info(f"Authenticating user {user_guid}")
    if nahat_mongo_client.get_user(user_guid) is None:
        logger.info("User isn't authenticated")
        return {"auth": False}
    logger.info("User authenticated")
    return {"auth": True}
