import asyncio

from fastapi import WebSocket, APIRouter
from starlette.websockets import WebSocketDisconnect
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError
from nahat_server.core.logger import logger

from nahat_server.core.database.nahat_mongo import nahat_mongo_client
import uuid


class NahatClientWs:
    def __init__(self):
        self.ws = None
        self.ws: WebSocket
        self.user_guid = None
        self.is_connected = False
        self.send_status_task = None
        self.recv_lock = asyncio.Lock()

    async def connect(self, ws: WebSocket):
        try:
            self.ws = ws
            await self.ws.accept()
            self.ws.id = uuid.uuid4()
            self.is_connected = True
            await self.send_barcode(nahat_mongo_client.get_current_barcode())
            logger.debug(f"Client connected: {self.ws.id}")
            await self._keep_alive()
        except ConnectionClosedError as e:
            logger.info(f"Connection closed error: {e}")
            self.is_connected = False

    async def _keep_alive(self):
        while self.is_connected:
            try:
                await asyncio.sleep(5)
                async with self.recv_lock:
                    logger.info("Sending keep alive, recv locked")
                    await self.ws.send_json({'status': 'ok'})
                    data = await self.ws.receive_json()
                    if data.get('status') != 'ok':
                        await self.ws.send_json({'error': 'Invalid message'})
                    logger.info("keep alive: OK, recv lock released")
            except (WebSocketDisconnect, RuntimeError, ConnectionClosedOK) as e:
                logger.error(e)
                await self.disconnect()

    async def send_barcode(self, barcode):
        logger.info(f"Sending barcode to client: {barcode}")
        await self.ws.send_json({'barcode': barcode})

    async def request_redeem(self, card_code: str):
        if not self.is_connected:
            logger.debug("Client not connected")
            return False
        async with self.recv_lock:
            logger.info(f"Requesting redeem for card: {card_code}, locking recv")
            await self.ws.send_json({'redeem': card_code})
            data = await self.ws.receive_json()
            logger.info("released lock")
        if data.get('redeem') == 'ok':
            logger.info(f"Card redeemed, card code: {card_code}")
            return True
        return False

    async def disconnect(self):
        self.is_connected = False
        await self.ws.close()


router = APIRouter(prefix='/ws')

nahat_client_ws = NahatClientWs()


@router.websocket("/nahat_client")
async def websocket_endpoint(websocket: WebSocket):
    await nahat_client_ws.connect(websocket)
