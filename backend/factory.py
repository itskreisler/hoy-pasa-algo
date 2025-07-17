from flask import Flask, Response
from flask.helpers import send_from_directory
from flask_cors import CORS
from config import config
from routes.users import users_bp
from routes.events import events_bp
import os
from typing import Optional, Dict, Any


def root_dir():
    return os.path.abspath(os.path.dirname(__file__))


def get_file(filename: str):  # pragma: no cover
    try:
        src = os.path.join(root_dir(), filename)
        print("src", src)
        # Figure out how flask returns static files
        # Tried:
        # - render_template
        # - send_file
        # This should not be so non-obvious
        return open(src).read()
    except IOError as exc:
        return str(exc)


def create_app(config_name: Optional[str] = None) -> Flask:
    """Factory function para crear la aplicación Flask"""
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "default")

    app = Flask(__name__, static_url_path="", static_folder="static")

    # Configurar CORS
    CORS(app, origins=["http://localhost:4321", "http://127.0.0.1:4321"])

    # Cargar configuración
    app.config.from_object(config[config_name])

    # Registrar blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(events_bp)

    # Configurar rutas estáticas
    dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "static"))

    @app.route("/", methods=["GET"])
    def index() -> Response:
        return send_from_directory(dist, "index.html")

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def static_file(path: str):
        mimetypes = {
            ".css": "text/css",
            ".html": "text/html",
            ".js": "application/javascript",
        }
        complete_path = os.path.join(root_dir(), path)
        ext = os.path.splitext(path)[1]
        mimetype = mimetypes.get(ext, "text/html")
        content = get_file(complete_path)
        return Response(content, mimetype=mimetype)

    @app.route("/docs")
    def api_info() -> Dict[str, Any]:
        return {
            "message": "API Backend funcionando",
            "endpoints": {"users": "/api/v1/users", "events": "/api/v1/events"},
        }

    return app
