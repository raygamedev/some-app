import requests
import uuid
from nahat_server.core.config import SERVER_URL
from nahat_server.core.schemas.schema import BarcodeModel
from nahat_server.core.logger import logger


class DummyClient:
    def __init__(self, url: str = SERVER_URL, guid: str = uuid.uuid4(), main_logger=logger):
        self.logger = main_logger
        self.server_url = url
        self.guid = 'ff64bb7e-fb13-4e13-9469-1ee38e51621b'

    def sign_in(self):
        self.logger.info(type(self.guid))
        requests.post(f'{self.server_url}/sign_in', UserGuid(guid=str(self.guid)).json())

    def post_qr_code(self):
        requests.post(f'{self.server_url}/qr_code', BarcodeModel(guid=str(self.guid),
                                                                 barcode="noa didnt suck my bilmabal :(").json())


if __name__ == '__main__':
    dummy_client = DummyClient()
    dummy_client.post_qr_code()