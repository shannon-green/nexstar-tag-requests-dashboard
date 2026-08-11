import hmac
import json
import os
import uuid
from datetime import datetime, timedelta, timezone
from functools import wraps

import requests
from flask import Flask, jsonify, redirect, render_template, request, session, url_for

app = Flask(__name__, template_folder="../templates", static_folder="../static")

REQUESTS_KEY = "tag_requests:list"
VALID_STATUSES = {"New Request", "In Progress", "Pending Install", "Installed", "Canceled"}
VALID_MARKETS = {
    "Abilene", "Albany", "Albuquerque", "Alexandria", "Altoona", "Amarillo",
    "Augusta", "Austin", "Bakersfield", "Baton Rouge", "Billings", "Binghamton",
    "Birmingham", "Bismarck", "Bluefield", "Brownsville", "Buffalo", "Burlington",
    "Champaign", "Charleston, SC", "Charleston, WV", "Charlotte", "Chicago",
    "Clarksburg", "Cleveland", "Colorado Springs", "Columbus, GA", "Columbus, OH",
    "Dallas", "Dayton", "Denver", "Des Moines", "Dothan", "El Paso", "Elmira",
    "Erie", "Evansville", "Fayetteville", "Fort Wayne", "Fresno", "Grand Junction",
    "Grand Rapids", "Green Bay", "Greensboro", "Greenville, NC", "Harrisburg",
    "Hattiesburg", "Honolulu", "Houston", "Huntsville", "Indianapolis",
    "Jackson, MS", "Joplin", "Kansas City", "Knoxville", "LaCrosse",
    "Lafayette, LA", "Lansing", "Las Vegas", "Lexington", "Little Rock",
    "Los Angeles", "Lubbock", "Memphis", "Midland", "Mobile", "Monroe",
    "Myrtle Beach", "Nashville", "New Haven", "New Orleans", "New York",
    "Norfolk", "Oklahoma City", "Panama City", "Peoria", "Philadelphia",
    "Phoenix", "Portland", "Providence", "Quad Cities", "Raleigh", "Richmond",
    "Roanoke", "Rochester", "Rockford", "Sacramento", "Salt Lake City",
    "San Angelo", "San Diego", "San Francisco", "Savannah", "Shreveport",
    "Sioux City", "Sioux Falls", "Spartanburg", "Springfield, MA",
    "Springfield, MO", "St Louis", "Syracuse", "Tampa", "Terre Haute", "Topeka",
    "Tri Cities", "Tyler", "Utica", "Waco", "Washington DC", "Watertown",
    "Wheeling", "Wichita", "Wichita Falls", "Wilkes Barre", "Youngstown",
}

MARKET_TO_RD = {
    "Spartanburg": "Cramer Robinson",
    "Norfolk": "Cramer Robinson",
    "Raleigh": "Cramer Robinson",
    "Charleston, SC": "Cramer Robinson",
    "Greensboro": "Cramer Robinson",
    "Augusta": "Cramer Robinson",
    "Myrtle Beach": "Cramer Robinson",
    "Richmond": "Cramer Robinson",
    "Savannah": "Cramer Robinson",
    "Charlotte": "Cramer Robinson",
    "Greenville, NC": "Cramer Robinson",
    "Roanoke": "Cramer Robinson",
    "St Louis": "Josh Oswald",
    "Kansas City": "Josh Oswald",
    "Oklahoma City": "Josh Oswald",
    "Springfield, MO": "Josh Oswald",
    "Wichita": "Josh Oswald",
    "Terre Haute": "Josh Oswald",
    "Topeka": "Josh Oswald",
    "Joplin": "Josh Oswald",
    "Evansville": "Josh Oswald",
    "Little Rock": "Rocco Bernardoni",
    "Memphis": "Rocco Bernardoni",
    "Fayetteville": "Rocco Bernardoni",
    "Lafayette, LA": "Rocco Bernardoni",
    "Jackson, MS": "Rocco Bernardoni",
    "Shreveport": "Rocco Bernardoni",
    "Baton Rouge": "Rocco Bernardoni",
    "Monroe": "Rocco Bernardoni",
    "New Orleans": "Rocco Bernardoni",
    "Alexandria": "Rocco Bernardoni",
    "Hattiesburg": "Rocco Bernardoni",
    "Cleveland": "Tim VanderZwaag",
    "Columbus, OH": "Tim VanderZwaag",
    "Harrisburg": "Tim VanderZwaag",
    "Youngstown": "Tim VanderZwaag",
    "Wilkes Barre": "Tim VanderZwaag",
    "Clarksburg": "Tim VanderZwaag",
    "Altoona": "Tim VanderZwaag",
    "Charleston, WV": "Tim VanderZwaag",
    "Dayton": "Tim VanderZwaag",
    "Wheeling": "Tim VanderZwaag",
    "Erie": "Tim VanderZwaag",
    "Lexington": "Tim VanderZwaag",
    "Bluefield": "Tim VanderZwaag",
    "Nashville": "Erin Hoffman",
    "Knoxville": "Erin Hoffman",
    "Tri Cities": "Erin Hoffman",
    "Mobile": "Erin Hoffman",
    "Huntsville": "Erin Hoffman",
    "Birmingham": "Erin Hoffman",
    "Dothan": "Erin Hoffman",
    "Columbus, GA": "Erin Hoffman",
    "Panama City": "Erin Hoffman",
    "Tampa": "Kurt Laufer",
    "Chicago": "Kurt Laufer",
    "Indianapolis": "Kurt Laufer",
    "New York": "Kurt Laufer",
    "New Haven": "Kurt Laufer",
    "Grand Rapids": "Kurt Laufer",
    "Lansing": "Kurt Laufer",
    "Philadelphia": "Kurt Laufer",
    "Fort Wayne": "Kurt Laufer",
    "Washington DC": "Kurt Laufer",
    "Providence": "Meghan Glenn",
    "Buffalo": "Meghan Glenn",
    "Albany": "Meghan Glenn",
    "Springfield, MA": "Meghan Glenn",
    "Syracuse": "Meghan Glenn",
    "Rochester": "Meghan Glenn",
    "Elmira": "Meghan Glenn",
    "Burlington": "Meghan Glenn",
    "Binghamton": "Meghan Glenn",
    "Watertown": "Meghan Glenn",
    "Utica": "Meghan Glenn",
}

ASSIGNEES = ["Genna", "Morgan", "David", "Bill"]


# ---------- Auth (merged from former auth.py to avoid Vercel sibling-module import issues) ----------

app.config["SECRET_KEY"] = (
    os.environ.get("FLASK_SECRET_KEY")
    or "ft-design-system-dev-only-do-not-use-in-prod"
)
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = bool(os.environ.get("VERCEL_ENV"))
app.permanent_session_lifetime = timedelta(days=30)

_APP_PASSWORD = os.environ.get("APP_PASSWORD") or "change-me-in-prod"
_BULK_PASSWORD = os.environ.get("BULK_UPLOAD_PASSWORD") or "ProdOps"


@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        submitted = request.form.get("password") or ""
        if hmac.compare_digest(submitted, _APP_PASSWORD):
            session.permanent = True
            session["authed"] = True
            target = (
                request.args.get("next")
                or request.form.get("next")
                or url_for("dashboard")
            )
            if not target.startswith("/") or target.startswith("//"):
                target = url_for("dashboard")
            return redirect(target)
        error = "Incorrect password. Try again."
    if session.get("authed"):
        return redirect(url_for("dashboard"))
    return render_template("login.html", error=error, next=request.args.get("next", ""))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


def require_auth(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        if not session.get("authed"):
            if request.path.startswith("/api/"):
                return jsonify({"ok": False, "error": "Not authenticated"}), 401
            return redirect(url_for("login", next=request.path))
        return view(*args, **kwargs)

    return wrapper


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


ASSIGNEE_COUNTER_KEY = "tag_requests:assignee_counter"


def get_next_assignee():
    """Round-robins through ASSIGNEES using an atomic INCR counter in KV,
    so simultaneous submissions still hand out distinct, sequential turns.
    Falls back to blank (leaving the field for manual assignment) if KV
    isn't reachable, rather than blocking the submission."""
    try:
        count = kv_command("INCR", ASSIGNEE_COUNTER_KEY)
        return ASSIGNEES[(int(count) - 1) % len(ASSIGNEES)]
    except Exception:
        return ""


# ---------- Email notifications (Resend API) ----------

def send_installed_email(item):
    """Notify the original submitter that their tag has been installed.
    Silently no-ops if Resend isn't configured, or logs and continues if
    the send fails — an email problem should never block a status update."""
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        return
    from_email = os.environ.get("RESEND_FROM_EMAIL", "fullthrottle.ai <onboarding@resend.dev>")
    try:
        requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": from_email,
                "to": [item["contactEmail"]],
                "subject": f"Tag installed: {item['clientName']}",
                "html": (
                    f"<p>Hi {item['contactName']},</p>"
                    f"<p>Good news — the tag for <strong>{item['clientName']}</strong> "
                    f"({item['siteUrl']}) has been installed.</p>"
                    f"<p>— fullthrottle.ai team</p>"
                ),
            },
            timeout=10,
        )
    except Exception:
        pass


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
    required = ["clientName", "siteUrl", "address", "clientContactName", "clientContactEmail", "market", "contactName", "contactEmail"]
    missing = [f for f in required if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({
            "ok": False,
            "error": f"Missing required field(s): {', '.join(missing)}",
        }), 400

    market = str(data.get("market", "")).strip()
    if market not in VALID_MARKETS:
        return jsonify({"ok": False, "error": "Please select a valid Nexstar market"}), 400

    now = datetime.now(timezone.utc).isoformat()
    new_item = {
        "id": uuid.uuid4().hex,
        "clientName": str(data.get("clientName", "")).strip(),
        "siteUrl": str(data.get("siteUrl", "")).strip(),
        "address": str(data.get("address", "")).strip(),
        "clientContactName": str(data.get("clientContactName", "")).strip(),
        "clientContactEmail": str(data.get("clientContactEmail", "")).strip(),
        "market": market,
        "rd": MARKET_TO_RD.get(market, ""),
        "contactName": str(data.get("contactName", "")).strip(),
        "contactEmail": str(data.get("contactEmail", "")).strip(),
        "assignee": get_next_assignee(),
        "status": "New Request",
        "created_at": now,
        "updated_at": now,
        "installed_at": None,
        "script": "",
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
                send_installed_email(item)
            else:
                item["installed_at"] = None
            found = item
            break

    if not found:
        return jsonify({"ok": False, "error": "Request not found"}), 404

    save_requests(items)
    return jsonify({"ok": True, "request": found})


@app.route("/api/requests/<request_id>/assignee", methods=["POST"])
@require_auth
def update_assignee(request_id):
    data = request.get_json(silent=True) or {}
    assignee = str(data.get("assignee", "")).strip()

    try:
        items = load_requests()
    except RuntimeError:
        return jsonify({"ok": False, "error": "Storage not configured"}), 500

    found = None
    for item in items:
        if item.get("id") == request_id:
            item["assignee"] = assignee
            item["updated_at"] = datetime.now(timezone.utc).isoformat()
            found = item
            break

    if not found:
        return jsonify({"ok": False, "error": "Request not found"}), 404

    save_requests(items)
    return jsonify({"ok": True, "request": found})


@app.route("/api/requests/<request_id>/script", methods=["POST"])
@require_auth
def update_script(request_id):
    data = request.get_json(silent=True) or {}
    script = str(data.get("script", ""))

    try:
        items = load_requests()
    except RuntimeError:
        return jsonify({"ok": False, "error": "Storage not configured"}), 500

    found = None
    for item in items:
        if item.get("id") == request_id:
            item["script"] = script
            item["updated_at"] = datetime.now(timezone.utc).isoformat()
            found = item
            break

    if not found:
        return jsonify({"ok": False, "error": "Request not found"}), 404

    save_requests(items)
    return jsonify({"ok": True, "request": found})


@app.route("/api/requests/bulk", methods=["POST"])
@require_auth
def bulk_create_requests():
    """Bulk-add clients from an uploaded CSV. Gated by a second password
    (separate from the dashboard login) checked here server-side — the
    modal's password step is just UI, this is the real enforcement."""
    data = request.get_json(silent=True) or {}
    submitted_password = str(data.get("password", ""))
    if not hmac.compare_digest(submitted_password, _BULK_PASSWORD):
        return jsonify({"ok": False, "error": "Incorrect password"}), 401

    rows = data.get("rows")
    if not isinstance(rows, list) or not rows:
        return jsonify({"ok": False, "error": "No rows provided"}), 400

    try:
        items = load_requests()
    except RuntimeError:
        return jsonify({"ok": False, "error": "Storage not configured"}), 500

    added = []
    errors = []
    now = datetime.now(timezone.utc).isoformat()

    for idx, row in enumerate(rows, start=1):
        if not isinstance(row, dict):
            errors.append({"row": idx, "error": "Invalid row format"})
            continue

        client_name = str(row.get("clientName", "")).strip()
        site_url = str(row.get("siteUrl", "")).strip()
        address = str(row.get("address", "")).strip()
        client_contact_name = str(row.get("clientContactName", "")).strip()
        client_contact_email = str(row.get("clientContactEmail", "")).strip()
        market = str(row.get("market", "")).strip()
        contact_name = str(row.get("contactName", "")).strip()
        contact_email = str(row.get("contactEmail", "")).strip()

        missing = [
            label for label, val in [
                ("Client Name", client_name),
                ("Site URL", site_url),
                ("Client Address", address),
                ("Client Contact Name", client_contact_name),
                ("Client Contact Email", client_contact_email),
                ("Nexstar Market", market),
                ("Contact Name", contact_name),
                ("Contact Email", contact_email),
            ]
            if not val
        ]
        if missing:
            errors.append({"row": idx, "error": f"Missing: {', '.join(missing)}"})
            continue

        if market not in VALID_MARKETS:
            errors.append({"row": idx, "error": f"Unrecognized market: {market}"})
            continue

        new_item = {
            "id": uuid.uuid4().hex,
            "clientName": client_name,
            "siteUrl": site_url,
            "address": address,
            "clientContactName": client_contact_name,
            "clientContactEmail": client_contact_email,
            "market": market,
            "rd": MARKET_TO_RD.get(market, ""),
            "contactName": contact_name,
            "contactEmail": contact_email,
            "assignee": get_next_assignee(),
            "status": "New Request",
            "created_at": now,
            "updated_at": now,
            "installed_at": None,
            "script": "",
        }
        items.append(new_item)
        added.append(new_item)

    if added:
        save_requests(items)

    return jsonify({"ok": True, "added": len(added), "errors": errors})


@app.route("/api/requests/<request_id>", methods=["DELETE"])
@require_auth
def delete_request(request_id):
    try:
        items = load_requests()
    except RuntimeError:
        return jsonify({"ok": False, "error": "Storage not configured"}), 500

    remaining = [item for item in items if item.get("id") != request_id]
    if len(remaining) == len(items):
        return jsonify({"ok": False, "error": "Request not found"}), 404

    save_requests(remaining)
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=True)
