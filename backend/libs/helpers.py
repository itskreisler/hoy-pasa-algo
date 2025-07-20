from flask import request, jsonify, Response
from functools import wraps
from pydantic import BaseModel, ValidationError
from typing import Callable, Any, Union, Sequence
import base64
import json
import hashlib
import secrets
from enum import Enum
import requests


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
    token_data = json.dumps(user_data)
    return base64.b64encode(token_data.encode()).decode()


def decode_token(token: str) -> tuple[Exception | None, dict[str, Any] | None]:
    """Decodifica un token y devuelve los datos del usuario"""
    try:
        decoded_data = base64.b64decode(token.encode())
        user_data = json.loads(decoded_data.decode())
        return (None, user_data)
    except Exception as e:
        return (e, None)


def auth_required(f: Callable[..., Any]) -> Callable[..., Union[Response, Any]]:
    @wraps(f)
    def wrapper(*args: Any, **kwargs: Any) -> Union[Response, Any]:
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return jsonify({"type": "error", "message": "Token de autorización requerido"}), 401

        token = auth.replace("Bearer ", "")

        error, user_data = decode_token(token)
        if error or not user_data:
            return jsonify({"type": "error", "message": "Token inválido"}), 401

        kwargs["user"] = user_data
        return f(*args, **kwargs)

    return wrapper


def auth_optional(f: Callable[..., Any]) -> Callable[..., Union[Response, Any]]:
    @wraps(f)
    def wrapper(*args: Any, **kwargs: Any) -> Union[Response, Any]:
        auth = request.headers.get("Authorization")
        user_data = None
        if auth and auth.startswith("Bearer "):
            token = auth.replace("Bearer ", "")
            error, user_data = decode_token(token)

        kwargs["user"] = user_data
        return f(*args, **kwargs)

    return wrapper


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
                data = request.get_json() or {}
                validated = modelo.model_validate(data)
            except ValidationError as ve:
                # Asegurarse de que el error sea siempre serializable
                error_messages = [
                    {"loc": err.get("loc", []), "msg": err.get("msg", "")} for err in ve.errors()
                ]
                return jsonify({
                    "type": "validation_error",
                    "message": "Error de validación",
                    "errors": error_messages
                }), 400

            kwargs['validated'] = validated
            return func(*args, **kwargs)

        return wrapper
    return decorador


def tryExcept(func: Callable[..., Any], *args: Any, **kwargs: Any) -> tuple[Exception | None, Any]:
    """Función para manejar excepciones y devolver una tupla (rror, data)"""
    try:
        data = func(*args, **kwargs)
        return (None, data)
    except Exception as e:
        return (e, None)
