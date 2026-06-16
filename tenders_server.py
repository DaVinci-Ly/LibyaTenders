#!/usr/bin/env python3
"""
متتبع العطاءات الحكومية الليبية
Libya Government Tenders Tracker - Local Server
"""

import http.server
import json
import urllib.request
import urllib.parse
import urllib.error
import os
import threading
import webbrowser
from datetime import datetime

# ── إعدادات ──────────────────────────────────────────────────────────────
PORT = 7845
BASE_URL = "https://www.attaat.pm.gov.ly"
API_BASE = "https://www.attaat.pm.gov.ly/back_api"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type": "application/json",
    "Origin": "https://www.attaat.pm.gov.ly",
    "Referer": "https://www.attaat.pm.gov.ly/",
    "Connection": "keep-alive",
}


def fetch_api(url, body=None, timeout=20):
    """جلب بيانات JSON من الـ API مع دعم gzip"""
    import gzip as gzip_mod
    data = json.dumps(body).encode("utf-8") if body is not None else b"{}"
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
            if resp.headers.get("Content-Encoding", "") == "gzip":
                raw = gzip_mod.decompress(raw)
            return json.loads(raw.decode("utf-8", errors="replace"))
    except Exception as e:
        raise Exception(f"فشل الاتصال بالـ API: {e}")


def format_tender(item):
    """تحويل بيانات الـ API إلى الصيغة المطلوبة للواجهة"""
    state = item.get("biddingState") or {}
    entity = item.get("governmentalEntity") or {}
    baladya = item.get("baladya") or {}
    b_type = item.get("biddingType") or {}

    state_name = state.get("name", "")
    is_open = state_name in ("", "مفتوح", "جديد", "نشط") or not state_name

    return {
        "id": item.get("id", ""),
        "biddingNumber": item.get("biddingNumber", ""),
        "title": item.get("title", ""),
        "description": item.get("description", ""),
        "entity": entity.get("name", ""),
        "category": b_type.get("name", ""),
        "status": state_name if state_name else "مفتوح",
        "publishDate": (item.get("publishDate") or item.get("fromDate") or "")[:10],
        "deadline": (item.get("toDate") or "")[:10],
        "location": baladya.get("name", ""),
        "documentPrice": item.get("documentPrice"),
        "url": f"{BASE_URL}/atta/{item.get('id', '')}",
    }


def scrape_tenders():
    """جلب العطاءات من الـ API الرسمي للمنصة"""
    url = f"{API_BASE}/api/PublicAttaat"
    all_tenders = []
    PAGE_SIZE = 50
    BASE_PARAMS = {"pageSize": PAGE_SIZE, "sortBy": "id", "sortOrder": "asc"}

    try:
        # جلب الصفحة الأولى (pageNumber يبدأ من 0)
        first = fetch_api(url, {**BASE_PARAMS, "pageNumber": 0})
        total = first.get("count", 0)
        raw_list = first.get("list", [])
        all_tenders.extend(raw_list)

        # جلب باقي الصفحات
        page = 1
        while len(all_tenders) < total and len(raw_list) > 0:
            page_data = fetch_api(url, {**BASE_PARAMS, "pageNumber": page})
            raw_list = page_data.get("list", [])
            all_tenders.extend(raw_list)
            page += 1
            if page > 20:
                break

        tenders = [format_tender(t) for t in all_tenders]
        return {
            "tenders": tenders,
            "total": len(tenders),
            "fetchedAt": datetime.now().isoformat(),
        }

    except Exception as e:
        return {
            "tenders": [],
            "error": str(e),
            "fetchedAt": datetime.now().isoformat(),
        }


# ── HTTP Server ───────────────────────────────────────────────────────────
class Handler(http.server.BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        pass  # suppress default logs

    def send_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/" or path == "/index.html":
            self.serve_file("index.html", "text/html; charset=utf-8")

        elif path.startswith("/assets/"):
            rel_path = path.lstrip("/")
            content_type = "application/octet-stream"
            if path.endswith(".svg"):
                content_type = "image/svg+xml"
            elif path.endswith(".png"):
                content_type = "image/png"
            elif path.endswith(".jpg") or path.endswith(".jpeg"):
                content_type = "image/jpeg"
            elif path.endswith(".css"):
                content_type = "text/css"
            elif path.endswith(".js"):
                content_type = "application/javascript"
            self.serve_file(rel_path, content_type)

        elif path == "/api/tenders":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_cors()
            self.end_headers()
            print(f"  [جلب] بدء جلب العطاءات من {BASE_URL}...")
            try:
                data = scrape_tenders()
                print(f"  [جلب] تم: {data.get('total', 0)} عطاء")
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                err = json.dumps({"error": str(e)}, ensure_ascii=False)
                self.wfile.write(err.encode("utf-8"))

        else:
            self.send_response(404)
            self.end_headers()

    def serve_file(self, filename, content_type):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        filepath = os.path.join(script_dir, filename)
        try:
            with open(filepath, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_cors()
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"File not found")


def main():
    print("=" * 55)
    print("  متتبع العطاءات الحكومية الليبية")
    print("  Libya Government Tenders Tracker")
    print("=" * 55)

    server = http.server.HTTPServer(("127.0.0.1", PORT), Handler)

    url = f"http://127.0.0.1:{PORT}"
    print(f"\n  ✅ الخادم يعمل على: {url}")
    print(f"  🌐 سيفتح المتصفح تلقائيًا...")
    print(f"  ⏹  اضغط Ctrl+C للإيقاف\n")

    def open_browser():
        try:
            import subprocess
            subprocess.Popen(['open', '-a', 'Google Chrome', url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            try:
                chrome = webbrowser.get('chrome')
                chrome.open(url)
            except Exception:
                webbrowser.open(url)

    threading.Timer(1.2, open_browser).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  🛑 تم إيقاف الخادم.")
        server.shutdown()


if __name__ == "__main__":
    main()
