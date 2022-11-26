import socket
import random as r
from typing import List


def get_local_ip() -> str:
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip


def generate_otp_code():
    otp = ''
    for i in range(6):
        otp += str(r.randint(1, 9))
    return otp


def get_random_element(elements: List):
    return r.choice(elements)




