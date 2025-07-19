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


def generate_id(length: int = 32) -> str:
    """Genera un ID único de longitud especificada usando un servicio externo o localmente"""
    return secrets.token_hex(length // 2)
    url = f"https://generate-secret.vercel.app/{length}"
    response = requests.get(url)
    if response.status_code == 200:
        secret = response.text.strip()
        return secret
    # Si no se puede obtener el ID desde el servicio externo, generar uno localmente
    return secrets.token_hex(length // 2)  # Genera un ID hexadecimal de la longitud especificada


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

        # Usar la función decode_token
        error, user_data = decode_token(token)
        if error or not user_data:
            return jsonify({"type": "error", "message": "Token inválido"}), 401

        # Pasar los datos del usuario a la función
        return f(*args, user=user_data, **kwargs)

    return wrapper


class Method(str, Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    PATCH = "PATCH"
    DELETE = "DELETE"


def validate(
    modelo: type[BaseModel],
    include: Sequence[str] | None = None,
    exclude: Sequence[str] | None = None,
):
    """
    Decorador para validar datos entrantes usando Pydantic.
    Puedes usar `include` para validar solo ciertos campos,
    o `exclude` para omitir algunos. Si se usan ambos, `include` tiene prioridad.
    """

    def decorador(func: Callable[..., Any]) -> Callable[..., Union[Response, Any]]:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Union[Response, Any]:
            try:
                metodo = Method(request.method)

                if metodo == Method.GET:
                    data = request.args.to_dict()
                elif metodo in [Method.POST, Method.PUT, Method.PATCH]:
                    data = request.get_json() or request.form.to_dict()
                else:
                    return jsonify({"type": "error", "message": f"Unsupported method: {metodo}"})

                # Aplicar include o exclude según lo recibido
                if include:
                    data = {k: v for k, v in data.items() if k in include}
                elif exclude:
                    data = {k: v for k, v in data.items() if k not in exclude}

                validated = modelo.model_validate(data)

            except ValidationError as ve:
                return jsonify(
                    {
                        "type": "warning",
                        "message": [
                            {
                                "loc": err.get("loc", []),
                                "msg": str(err.get("msg", "")),
                                "type": str(err.get("type", "")),
                            }
                            for err in ve.errors()
                        ],
                    }
                )

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
