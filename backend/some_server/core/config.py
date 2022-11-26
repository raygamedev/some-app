import os

from nahat_server.core.utils import get_local_ip

SERVER_PROTOCOL = "http"
SERVER_HOST = get_local_ip() if os.environ.get("IS_DEV", False) else '0.0.0.0'
SERVER_PORT = 8080
SERVER_URL = f"{SERVER_PROTOCOL}://{SERVER_HOST}:{SERVER_PORT}"

MONGO_URL = "mongodb+srv://ray:DwWXyGAEmcQcZLpw@nahat-database.geyfm.mongodb.net/" \
            "?retryWrites=true&w=majority"
MONGO_PORT = 27017
