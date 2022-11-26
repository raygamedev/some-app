# Example package with a console entry point
__version__ = "0.1.0"

from nahat_server.main import run_server

if __name__ == '__main__':
    print("Starting Some Server")
    run_server()
