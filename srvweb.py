import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer


class PingHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/ping":
            headers_dict = dict(self.headers)

            response = json.dumps(headers_dict).encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(response)))
            self.end_headers()

            self.wfile.write(response)
        else:
            self.send_response(404)
            self.end_headers()

def main():
    port = os.getenv("PING_LISTEN_PORT")

    server = HTTPServer(("0.0.0.0", port), PingHandler)

    print(f"Listening on port {port}")

    server.serve_forever()


if __name__ == "__main__":
    main()