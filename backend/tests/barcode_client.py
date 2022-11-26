import websocket
import io
import _thread
import time
import qrcode
import json
import rel

WS_URL = "wss://nahat-dev-beta-7f7bisrofa-lm.a.run.app/ws/nahat_client"


def on_message(ws, message):
    barcode_msg = json.loads(message)
    barcode = barcode_msg.get('barcode')
    if barcode is not None:
        print(barcode)
        qr = qrcode.QRCode()
        qr.add_data(barcode)
        f = io.StringIO()
        qr.print_ascii(out=f)
        f.seek(0)
        print(f.read())


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### closed ###")


def on_open(ws):
    ws.send('{"type": "subscribe", "topic": "barcode"}')
    print("Opened connection")


if __name__ == "__main__":
    ws = websocket.WebSocketApp(WS_URL,
                                on_open=on_open,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)

    ws.run_forever(dispatcher=rel,
                   reconnect=5)  # Set dispatcher to automatic reconnection, 5 second reconnect delay if connection
    # closed unexpectedly
    rel.signal(2, rel.abort)  # Keyboard Interrupt
    rel.dispatch()
