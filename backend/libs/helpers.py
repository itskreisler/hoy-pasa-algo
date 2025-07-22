from flask import request, jsonify, Response
from functools import wraps
from pydantic import BaseModel, ValidationError
from typing import Callable, Any, Union
import base64
import json
import hashlib
from enum import Enum


def hash_password(password: str) -> str:
    """Hashea la contraseña usando SHA256"""
    if not password or not password.strip():
        raise ValueError("La contraseña no puede estar vacía")
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    """Verifica si la contraseña coincide con el hash"""
    return hash_password(password) == hashed


def create_token(user_data: dict[str, Any]) -> str:
    """Crea un token simple usando base64 (en producción usa JWT)"""
    token_data: str = json.dumps(user_data)
    return base64.b64encode(token_data.encode()).decode()


def decode_token(token: str) -> tuple[Exception | None, dict[str, Any] | None]:
    """Decodifica un token y devuelve los datos del usuario"""
    try:
        decoded_data: bytes = base64.b64decode(token.encode())
        user_data: dict[str, Any] = json.loads(decoded_data.decode())
        return (None, user_data)
    except Exception as e:
        return (e, None)


def auth_required(f: Callable[..., Any]) -> Callable[..., Union[Response, Any]]:
    @wraps(f)
    def wrapper(*args: Any, **kwargs: Any) -> Union[Response, Any]:
        auth: str | None = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return jsonify({"type": "error", "message": "Token de autorización requerido"}), 401

        token: str = auth.replace("Bearer ", "")

        error: Exception | None
        user_data: dict[str, Any] | None
        error, user_data = decode_token(token)
        if error or not user_data:
            return jsonify({"type": "error", "message": "Token inválido"}), 401

        kwargs["user"] = user_data
        return f(*args, **kwargs)

    return wrapper


def auth_optional(f: Callable[..., Any]) -> Callable[..., Union[Response, Any]]:
    @wraps(f)
    def wrapper(*args: Any, **kwargs: Any) -> Union[Response, Any]:
        auth: str | None = request.headers.get("Authorization")
        user_data: dict[str, Any] | None = None
        if auth and auth.startswith("Bearer "):
            token: str = auth.replace("Bearer ", "")
            _, user_data = decode_token(token)  # Ignoramos el error en auth_optional

        kwargs["user"] = user_data
        return f(*args, **kwargs)

    return wrapper


class ResponseType(str, Enum):
    SUCCESS = "success"
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"
    DANGER = "danger"


class Method(str, Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    PATCH = "PATCH"
    DELETE = "DELETE"


def validate(modelo: type[BaseModel]):
    """
    Decorador para validar datos entrantes usando Pydantic.
    """

    def decorador(func: Callable[..., Any]) -> Callable[..., Union[Response, Any]]:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Union[Response, Any]:
            try:
                data: dict[str, Any] = request.get_json() or {}
                validated: BaseModel = modelo.model_validate(data)
            except ValidationError as ve:
                # Asegurarse de que el error sea siempre serializable
                error_messages: list[dict[str, Any]] = [
                    {
                        "loc": list(err.get("loc", [])),
                        "msg": str(err.get("msg", "")),
                        "type": str(err.get("type", "")),
                    }
                    for err in ve.errors()
                ]
                print(ve.errors())
                return jsonify(
                    {
                        "type": "validation_error",
                        "message": "Error de validación",
                        "errors": error_messages,
                    }
                ), 400

            kwargs["validated"] = validated
            return func(*args, **kwargs)

        return wrapper

    return decorador


def tryExcept(func: Callable[..., Any], *args: Any, **kwargs: Any) -> tuple[Exception | None, Any]:
    """Función para manejar excepciones y devolver una tupla (error, data)"""
    try:
        data: Any = func(*args, **kwargs)
        return (None, data)
    except Exception as e:
        return (e, None)
