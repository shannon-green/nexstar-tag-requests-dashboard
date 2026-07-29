import json
import os
import uuid
from datetime import datetime, timezone

import requests
from flask import Flask, jsonify, render_template, request, session

from auth import install_auth, require_auth

app = Flask(__name__)
install_auth(app)

REQUESTS_KEY = "tag_requests:list"
VALID_STATUSES = {"New Request", "In Progress", "Installed", "Canceled"}


# ---------- KV storage (Vercel KV / Upstash REST API) ----------

def _kv_config():
    """Supports both Vercel KV integration env vars and raw Upstash vars."""
    url = os.environ.get("KV_REST_API_URL") or os.environ.get("UPSTASH_REDIS_REST_URL")
    token = os.environ.get("KV_REST_API_TOKEN") or os.environ.get("UPSTASH_REDIS_REST_TOKEN")
    return url, token


def kv_command(*command):
    url, token = _kv_config()
    if not url or not token:
        raise RuntimeError("KV not configured")
    resp = requests.post(
        url,
        headers={"Authorization": f"Bearer {token}"},
        json=list(command),
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json().get("result")


def load_requests():
    raw = kv_command("GET", REQUESTS_KEY)
    if not raw:
        return []
    try:
        return json.loads(raw)
    except (TypeError, ValueError):
        return []


def save_requests(items):
    kv_command("SET", REQUESTS_KEY, json.dumps(items))


# ---------- Pages ----------

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/dashboard")
@require_auth
def dashboard():
    return render_template("dashboard.html")


# ---------- API ----------

@app.route("/api/requests", methods=["GET", "POST"])
def requests_collection():
    if request.method == "GET":
        # Internal dashboard only
        if not session.get("authed"):
            return jsonify({"ok": False, "error": "Not authenticated"}), 401
        try:
            items = load_requests()
        except RuntimeError:
            return jsonify({"ok": False, "error": "Storage not configured"}), 500
        return jsonify({"ok": True, "requests": items})

    # POST — public partner submission, no auth required
    data = request.get_json(silent=True) or {}
    required = ["clientName", "siteUrl", "contactName", "contactEmail"]
    missing = [f for f in required if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({
            "ok": False,
            "error": f"Missing required field(s): {', '.join(missing)}",
        }), 400

    now = datetime.now(timezone.utc).isoformat()
    new_item = {
        "id": uuid.uuid4().hex,
        "clientName": str(data.get("clientName", "")).strip(),
        "siteUrl": str(data.get("siteUrl", "")).strip(),
        "contactName": str(data.get("contactName", "")).strip(),
        "contactEmail": str(data.get("contactEmail", "")).strip(),
        "status": "New Request",
        "created_at": now,
        "updated_at": now,
        "installed_at": None,
    }

    try:
        items = load_requests()
        items.append(new_item)
        save_requests(items)
    except RuntimeError:
        return jsonify({"ok": False, "error": "Storage not configured"}), 500

    return jsonify({"ok": True, "request": new_item}), 201


@app.route("/api/requests/<request_id>/status", methods=["POST"])
@require_auth
def update_status(request_id):
    data = request.get_json(silent=True) or {}
    new_status = data.get("status")
    if new_status not in VALID_STATUSES:
        return jsonify({"ok": False, "error": "Invalid status"}), 400

    try:
        items = load_requests()
    except RuntimeError:
        return jsonify({"ok": False, "error": "Storage not configured"}), 500

    found = None
    for item in items:
        if item.get("id") == request_id:
            item["status"] = new_status
            item["updated_at"] = datetime.now(timezone.utc).isoformat()
            if new_status == "Installed":
                item["installed_at"] = item["updated_at"]
            found = item
            break

    if not found:
        return jsonify({"ok": False, "error": "Request not found"}), 404

    save_requests(items)
    return jsonify({"ok": True, "request": found})


if __name__ == "__main__":
    app.run(debug=True)
