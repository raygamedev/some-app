import uvicorn
import os
from fastapi import FastAPI
from nahat_server.core.logger import logger
from nahat_server.core.server_api import app
from nahat_server.core.config import SERVER_HOST, SERVER_PORT

main: FastAPI = app


def run_server():
    logger.info("Running Nahat Webserver")
    uvicorn.run('nahat_server.main:main', host=SERVER_HOST, port=int(os.environ.get("PORT", 8080)))


if __name__ == "__main__":
    run_server()
