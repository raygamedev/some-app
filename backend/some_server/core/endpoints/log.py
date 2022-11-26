from fastapi import APIRouter
from nahat_server.core.schemas.schema import Log
from nahat_server.core.logger import logger

router = APIRouter(prefix='/log')


@router.post('/client')
async def log_client(log_data: Log):
    logger.debug(f'CLIENT - {log_data.log} - user: {log_data.user_guid}')
    return {"logged": True}
