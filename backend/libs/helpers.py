from flask import request, jsonify, Response
from functools import wraps
from pydantic import BaseModel, ValidationError
from typing import Callable, Any, Literal, Union
import base64
import json
import hashlib


def hash_password(password: str) -> str:
    """Hashea la contraseña usando SHA256"""
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

        # Usar la función decode_token
        error, user_data = decode_token(token)
        if error or not user_data:
            return jsonify({"type": "error", "message": "Token inválido"}), 401

        # Pasar los datos del usuario a la función
        return f(*args, user=user_data, **kwargs)

    return wrapper


def validate(modelo: type[BaseModel], source: Literal["json", "query", "form"] = "json"):
    """Decorador para validar los datos de solicitudes entrantes contra un modelo pydantic."""

    def decorador(func: Callable[..., Any]) -> Callable[..., Union[Response, Any]]:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Union[Response, Any]:
            try:
                print("request.get_json", request.get_json())
                print("request.args.to_dict", request.args.to_dict())
                print("request.form.to_dict", request.form.to_dict())
                if source == "json":
                    data = request.get_json()
                elif source == "query":
                    data = request.args.to_dict()
                elif source == "form":
                    data = request.form.to_dict()
                else:
                    return jsonify({"type": "error", "message": "Invalid source type"})

                validated = modelo(**data)

            except ValidationError as ve:
                # Los errores de Pydantic siempre se pueden obtener, no necesitamos tryExcept aquí
                errors_list = ve.errors()

                # Convertir los errores a un formato serializable
                serializable_errors: list[dict[str, Any]] = []
                for error in errors_list:
                    error_dict: dict[str, Any] = {
                        "loc": error.get("loc", []),
                        "msg": str(error.get("msg", "")),
                        "type": str(error.get("type", "")),
                    }
                    serializable_errors.append(error_dict)

                return jsonify({"type": "warning", "message": serializable_errors})

            except Exception as e:
                return jsonify({"type": "error", "message": str(e)})

            return func(*args, validated=validated, **kwargs)

        return wrapper

    return decorador


def tryExcept(func: Callable[..., Any], *args: Any, **kwargs: Any) -> tuple[Exception | None, Any]:
    """Función para manejar excepciones y devolver una tupla (rror, data)"""
    try:
        data = func(*args, **kwargs)
        return (None, data)
    except Exception as e:
        return (e, None)
