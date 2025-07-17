import os
from typing import Type, Dict


class Config:
    """Configuración base de la aplicación"""

    # SECRET_KEY = os.environ.get("SECRET_KEY") or "tu-clave-secreta-aqui"
    DEBUG = os.environ.get("DEBUG", "True").lower() == "true"

    # Configuración de base de datos (para el futuro)
    # DATABASE_URL = os.environ.get("DATABASE_URL") or "sqlite:///app.db"

    # Configuración de la aplicación
    JSONIFY_PRETTYPRINT_REGULAR = True


class DevelopmentConfig(Config):
    """Configuración para desarrollo"""

    DEBUG = True


class ProductionConfig(Config):
    """Configuración para producción"""

    DEBUG = False


# Mapeo de configuraciones
config: Dict[str, Type[Config]] = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
