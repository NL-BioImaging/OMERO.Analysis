"""Small authenticated-session deployment smoke for an existing OMERO.web."""

from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.request


def get(url, cookie):
    request = urllib.request.Request(url, headers={"Cookie": cookie} if cookie else {})
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.status, response.read().decode("utf-8", "replace")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("base_url")
    parser.add_argument(
        "--cookie",
        default=os.environ.get("OMERO_ANALYSIS_SMOKE_COOKIE", ""),
        help="Authenticated OMERO.web Cookie header (or use OMERO_ANALYSIS_SMOKE_COOKIE)",
    )
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    checks = {
        "analysis": "/omero_analysis/",
        "webclient": "/webclient/",
    }
    report = {}
    for name, path in checks.items():
        try:
            status, body = get(base + path, args.cookie)
            report[name] = {"status": status, "bytes": len(body.encode("utf-8"))}
            if status != 200:
                raise SystemExit(f"{name} returned HTTP {status}")
            if name == "analysis" and "OMERO.Analysis" not in body:
                raise SystemExit("Analysis shell marker was not found")
        except urllib.error.URLError as exc:
            raise SystemExit(f"{name} failed: {exc}") from exc
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
