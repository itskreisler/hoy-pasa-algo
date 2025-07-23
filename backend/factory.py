from flask import Flask, Response
from flask.helpers import send_from_directory
from flask_cors import CORS
from config import config
from routes.users import users_bp
from routes.events import events_bp
from routes.auth import auth_bp
from routes.upload import upload_bp
from flasgger import Swagger  # type: ignore
import os
from typing import Optional, Dict, Any
import mimetypes


def root_dir():
    return os.path.abspath(os.path.dirname(__file__))


def create_app(config_name: Optional[str] = None) -> Flask:
    """Factory function para crear la aplicación Flask"""
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "default")

    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("text/css", ".css")

    # Configurar la carpeta estática
    static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "static"))
    app = Flask(__name__, static_folder=static_folder)

    # Configurar CORS
    CORS(app, origins=["http://localhost:4321", "http://127.0.0.1:4321"])

    # Cargar configuración
    app.config.from_object(config[config_name])

    # Configurar Swagger
    app.config["SWAGGER"] = {
        "title": "API de Eventos",
        "uiversion": 3,
        "openapi": "3.0.3",
        "specs_route": "/api/docs/",
    }
    Swagger(app)

    # Registrar blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(upload_bp)

    # Configurar rutas estáticas
    # dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "static"))

    @app.route("/")
    def index():
        if app.static_folder is None:
            return "Static folder not configured", 500
        return send_from_directory(app.static_folder, "index.html")

    @app.route("/<path:path>")
    def serve_static(path: str) -> Response:
        if app.static_folder is None:
            return Response("Static folder not configured", status=500)

        # Normalizar la ruta para evitar problemas con separadores
        normalized_path: str = path.replace("\\", "/")

        # Debug: imprimir la ruta solicitada
        print(f"Requested path: {normalized_path}")
        print(f"Static folder: {app.static_folder}")

        # Primero intentar servir el archivo directamente
        try:
            print(f"Trying to serve file: {normalized_path}")
            return send_from_directory(app.static_folder, normalized_path)
        except Exception as e:
            print(f"Direct file serve failed: {e}")

            # Si falla, intentar servir index.html del directorio
            index_path: str = f"{normalized_path}/index.html"
            try:
                print(f"Trying to serve index: {index_path}")
                return send_from_directory(app.static_folder, index_path)
            except Exception as e:
                print(f"Index file serve failed: {e}")
                return Response("File not found", status=404)

    @app.route("/docs")
    def api_info() -> Dict[str, Any]:
        return {
            "message": "API Backend funcionando",
            "endpoints": {
                "users": "/api/v1/users",
                "events": "/api/v1/events",
                "auth": "/api/v1/auth",
                "docs": "/api/docs/",
            },
        }

    return app
