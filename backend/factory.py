from flask import Flask, send_from_directory, Response
from flask_cors import CORS
from config import config
from routes.users import users_bp
from routes.events import events_bp
import os
from typing import Optional, Dict, Any


def create_app(config_name: Optional[str] = None) -> Flask:
    """Factory function para crear la aplicación Flask"""
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "default")

    app = Flask(__name__)

    # Configurar CORS
    CORS(app, origins=["http://localhost:4321", "http://127.0.0.1:4321"])

    # Cargar configuración
    app.config.from_object(config[config_name])

    # Registrar blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(events_bp)

    # Configurar rutas estáticas si existe el directorio dist
    dist_sin_resolver = os.path.join(os.path.dirname(__file__), "../dist")
    dist = os.path.abspath(dist_sin_resolver)

    @app.route("/")
    def index() -> Response:
        return send_from_directory(dist, "index.html")

    @app.route("/<path:path>")
    def static_proxy(path: str) -> Response:
        return send_from_directory(dist, path)

    print(f"Directorio de distribución configurado: {dist}")
    files = os.listdir(dist)
    print(f"Archivos en '{dist}': {files}")

    @app.route("/docs")
    def api_info() -> Dict[str, Any]:
        return {
            "message": "API Backend funcionando",
            "endpoints": {"users": "/api/v1/users", "events": "/api/v1/events"},
        }

    return app
