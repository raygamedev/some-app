from fastapi import FastAPI, APIRouter, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from nahat_server.core.endpoints import user
from nahat_server.core.endpoints import card
from nahat_server.core.endpoints import log
from nahat_server.core import nahat_client_ws

app = FastAPI()

app.include_router(user.router)
app.include_router(card.router)
app.include_router(log.router)
app.include_router(nahat_client_ws.router)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/health_check')
async def health_check():
    return {"server_online": True}


@app.get("/")
async def root():
    return {"message": "some_app"}
