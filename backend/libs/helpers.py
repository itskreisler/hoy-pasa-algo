from flask import request, jsonify, Response
from functools import wraps
from pydantic import BaseModel, ValidationError
from typing import Callable, Any, Literal, Union
import base64
import json


def auth_required(f: Callable[..., Any]) -> Callable[..., Union[Response, Any]]:
    @wraps(f)
    def wrapper(*args: Any, **kwargs: Any) -> Union[Response, Any]:
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return jsonify({"error": "Falta token"})

        token = auth.replace("Bearer ", "")
        try:
            decoded = base64.b64decode(token.encode()).decode()
            data = json.loads(decoded)
        except Exception:
            return jsonify({"error": "Token inválido"})

        # Puedes validar cosas como:
        # if data.get("rol") != "admin":
        # return jsonify({"error": "No autorizado"})

        return f(*args, user=data, **kwargs)

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
