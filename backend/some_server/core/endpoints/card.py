import asyncio

from fastapi import APIRouter, HTTPException
from nahat_server.core.schemas.schema import CardColor, UserCardModel, \
    CardMarkModel, AVAILABLE_CARD_COLORS
from nahat_server.core.logger import logger
from nahat_server.core.database.nahat_mongo import nahat_mongo_client
from nahat_server.core.nahat_client_ws import nahat_client_ws
from nahat_server.core.utils import generate_otp_code, get_random_element

router = APIRouter(prefix='/card')


@router.get('/current')
async def get_current_card(user_guid: str):
    user_obj = nahat_mongo_client.get_user(user_guid)
    user_card = user_obj.get('card')
    return user_card


@router.post('/publish_barcode')
async def update_card(mark_data: CardMarkModel, user_guid: str):
    logger.info(f'Received barcode request - {mark_data}, user: {user_guid}')
    card = nahat_mongo_client.add_user_barcode(user_guid=user_guid, mark_data=mark_data)
    if card is not None:
        barcode = nahat_mongo_client.replace_current_barcode()
        await nahat_client_ws.send_barcode(barcode)
        return {"card": card}
    raise HTTPException(status_code=500, detail="Error updating card")


# Change to PUT more RESTful API
@router.get('/generate_new_card')
async def generate_new_card(user_guid: str):
    # TODO read about pydantic constructor
    card = UserCardModel(code=generate_otp_code(), colors=get_random_element(AVAILABLE_CARD_COLORS))
    logger.info(f'Generating new user for user {user_guid}, card: {card}')
    res = nahat_mongo_client.add_user_card(card, user_guid)
    # TODO listed in agenda
    if res.get("card"):
        return {"card": res.get("card")}
    raise HTTPException(status_code=500, detail="Error generating card")


@router.get('/redeem')
async def redeem_card(user_guid: str):
    logger.info(f"Redeeming card for user: {user_guid}")
    card_code = nahat_mongo_client.get_card_code(user_guid=user_guid)
    is_redeemed = await nahat_client_ws.request_redeem(card_code)
    if is_redeemed:
        return {"redeem": True}
    return {"redeem": False}
    # res = nahat_mongo_client.redeem_card(user_guid)
    # if res:
    #     return {"card": res}
    # raise HTTPException(status_code=500, detail="Error redeeming card")
