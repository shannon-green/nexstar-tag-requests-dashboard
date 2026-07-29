"""
fullthrottle.ai design system — Flask auth gate
"""

from __future__ import annotations

import hmac
import os
from datetime import timedelta
from functools import wraps

from flask import Flask, jsonify, redirect, render_template, request, session, url_for


def install_auth(app: Flask, *, login_template: str = "login.html") -> None:
    """Configure session settings and register /login, /logout routes."""

    app.config["SECRET_KEY"] = (
        os.environ.get("FLASK_SECRET_KEY")
        or "ft-design-system-dev-only-do-not-use-in-prod"
    )
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = bool(os.environ.get("VERCEL_ENV"))
    app.permanent_session_lifetime = timedelta(days=30)

    password = os.environ.get("APP_PASSWORD") or "change-me-in-prod"

    @app.route("/login", methods=["GET", "POST"])
    def login():
        error = None
        if request.method == "POST":
            submitted = request.form.get("password") or ""
            if hmac.compare_digest(submitted, password):
                session.permanent = True
                session["authed"] = True
                target = (
                    request.args.get("next")
                    or request.form.get("next")
                    or url_for("index")
                )
                if not target.startswith("/") or target.startswith("//"):
                    target = url_for("index")
                return redirect(target)
            error = "Incorrect password. Try again."
        if session.get("authed"):
            return redirect(url_for("index"))
        return render_template(
            login_template, error=error, next=request.args.get("next", "")
        )

    @app.route("/logout")
    def logout():
        session.clear()
        return redirect(url_for("login"))


def require_auth(view):
    """Decorate any route that should be gated."""

    @wraps(view)
    def wrapper(*args, **kwargs):
        if not session.get("authed"):
            if request.path.startswith("/api/"):
                return jsonify({"ok": False, "error": "Not authenticated"}), 401
            return redirect(url_for("login", next=request.path))
        return view(*args, **kwargs)

    return wrapper
