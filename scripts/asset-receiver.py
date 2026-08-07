"""Local receiver that accepts asset bytes POSTed from the authenticated design app tab.

DesignSync's get_file truncates any response above 256 KiB of base64 (~192 KB of real
file), which silently corrupts the larger brand assets. This server is the workaround:
the browser — already signed in to claude.ai — fetches each asset and POSTs the raw
bytes here, so nothing large has to travel through the model context.

Bound to 127.0.0.1 only. Writes are confined to public/ and filenames are flattened,
so a hostile name can't escape the directory.
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote
import os

PORT = 8787
PUBLIC = Path(__file__).resolve().parent.parent / "public"
# Only these destinations are accepted, so a stray POST cannot create arbitrary files.
ALLOWED_DIRS = {"icons", "photography", "textures", "logo", "partners", "fonts"}


class Receiver(BaseHTTPRequestHandler):
    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self) -> None:
        query = parse_qs(urlparse(self.path).query)
        name = unquote((query.get("name") or [""])[0])
        # Flatten to <dir>/<file>: strips any traversal before it can be resolved.
        parts = [p for p in name.split("/") if p not in ("", ".", "..")]
        if len(parts) != 2 or parts[0] not in ALLOWED_DIRS:
            self.send_response(400)
            self._cors()
            self.end_headers()
            self.wfile.write(b"bad name")
            return

        body = self.rfile.read(int(self.headers.get("Content-Length") or 0))
        if not body:
            self.send_response(400)
            self._cors()
            self.end_headers()
            self.wfile.write(b"empty body")
            return

        dest = PUBLIC / parts[0] / parts[1]
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(body)
        print(f"{len(body):>10,}  {parts[0]}/{parts[1]}", flush=True)

        self.send_response(200)
        self._cors()
        self.end_headers()
        self.wfile.write(b"ok")

    def log_message(self, *args: object) -> None:
        pass  # the per-file line printed above is the only output worth having


if __name__ == "__main__":
    os.chdir(PUBLIC.parent)
    print(f"receiver on http://127.0.0.1:{PORT} -> {PUBLIC}", flush=True)
    HTTPServer(("127.0.0.1", PORT), Receiver).serve_forever()
