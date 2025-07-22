from libs.helpers import (
    validate,
    auth_required,
    hash_password,
    verify_password,
    create_token,
    ResponseType,
)
from models.usuario import Usuario
from db.ORMcsv import orm
from db.database import get_user_model
from flask import Blueprint, jsonify, request, Response
from typing import Optional, Any

# Blueprint para autenticación
auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")

# Registrar modelos en el ORM
orm.register_model("usuario", Usuario, "usuarios.csv")


def find_user_by_email(email: str) -> Optional[dict[str, Any]]:
    """Busca un usuario por email en la base de datos CSV"""
    user_model = get_user_model()
    return user_model.find_one_by_field("email", email)


def find_user_by_username(username: str) -> Optional[dict[str, Any]]:
    """Busca un usuario por username en la base de datos CSV"""
    user_model = get_user_model()
    return user_model.find_one_by_field("username", username)


@auth_bp.route("/register", methods=["POST"])
@validate(Usuario)
def register(validated: Usuario) -> tuple[Response, int] | Response:
    """
    Registra un nuevo usuario.
    ---
    tags:
      - Autenticación
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Usuario'
    responses:
      201:
        description: Usuario registrado exitosamente.
      400:
        description: Datos inválidos o el usuario ya existe.
    components:
      schemas:
        Usuario:
          type: object
          properties:
            id:
              type: string
              description: ID único del usuario (generado automáticamente).
            username:
              type: string
              description: Nombre de usuario.
            email:
              type: string
              format: email
              description: Correo electrónico del usuario.
            full_name:
              type: string
              description: Nombre completo del usuario.
            password:
              type: string
              format: password
              description: Contraseña (mínimo 8 caracteres).
            rol:
              type: string
              enum: ['admin', 'user']
              description: Rol del usuario.
            birth_date:
              type: string
              format: date
              description: Fecha de nacimiento (YYYY-MM-DD).
            gener:
              type: string
              enum: ['M', 'F']
              description: Género del usuario.
    """
    try:
        if find_user_by_email(validated.email):
            return jsonify({"type": ResponseType.ERROR, "message": "Ya existe un usuario con este email"}), 400

        if validated.username and find_user_by_username(validated.username):
            return jsonify(
                {"type": ResponseType.ERROR, "message": "Ya existe un usuario con este username"}
            ), 400

        if not validated.password or not validated.password.strip():
            return jsonify(
                {"type": ResponseType.ERROR, "message": "La contraseña debe ser un texto válido"}
            ), 400

        try:
            hashed_password: str = hash_password(validated.password)
        except Exception as hash_error:
            return jsonify(
                {"type": ResponseType.ERROR, "message": f"Error al procesar contraseña: {str(hash_error)}"}
            ), 500

        user_data: dict[str, Any] = {
            "username": validated.username,
            "email": validated.email,
            "full_name": validated.full_name,
            "password": hashed_password,
            "rol": validated.rol or "user",
            "birth_date": validated.birth_date,
            "gener": validated.gener,
        }

        user_model = get_user_model()
        created_user = user_model.create(user_data)

        token_data: dict[str, Any] = {
            "id": created_user["id"],
            "username": created_user["username"],
            "email": created_user["email"],
            "rol": created_user["rol"],
        }
        token = create_token(token_data)

        return jsonify(
            {
                "type": ResponseType.SUCCESS,
                "message": "Usuario registrado exitosamente",
                "data": {
                    "user": {
                        "id": created_user["id"],
                        "username": created_user["username"],
                        "email": created_user["email"],
                        "full_name": created_user["full_name"],
                        "rol": created_user["rol"],
                    },
                    "token": token,
                },
            }
        ), 201

    except Exception as e:
        return jsonify({"type": ResponseType.ERROR, "message": f"Error interno del servidor: {str(e)}"}), 500


@auth_bp.route("/login", methods=["POST"])
def login() -> tuple[Response, int] | Response:
    """
    Inicia sesión de usuario y devuelve un token de autenticación.
    ---
    tags:
      - Autenticación
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              email:
                type: string
                description: Email del usuario.
                example: "test@example.com"
              password:
                type: string
                description: Contraseña del usuario.
                example: "strongpassword123"
            required:
              - email
              - password
    responses:
      200:
        description: Login exitoso.
        content:
          application/json:
            schema:
              type: object
              properties:
                type:
                  type: string
                  example: success
                message:
                  type: string
                  example: Login exitoso
                data:
                  type: object
                  properties:
                    token:
                      type: string
                    user:
                      $ref: '#/components/schemas/Usuario'
      400:
        description: Datos inválidos.
      401:
        description: Credenciales inválidas.
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"type": ResponseType.WARNING, "message": "No se proporcionaron datos"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"type": ResponseType.WARNING, "message": "Email y contraseña son requeridos"}), 400

        user = find_user_by_email(email)
        if not user or not verify_password(password, user["password"]):
            return jsonify({"type": ResponseType.ERROR, "message": "Credenciales inválidas"}), 401

        token_data: dict[str, Any] = {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "rol": user["rol"],
        }
        token = create_token(token_data)

        return jsonify(
            {
                "type": ResponseType.SUCCESS,
                "message": "Login exitoso",
                "data": {
                    "user": {
                        "id": user["id"],
                        "username": user["username"],
                        "email": user["email"],
                        "full_name": user["full_name"],
                        "rol": user["rol"],
                    },
                    "token": token,
                },
            }
        ), 200

    except Exception as e:
        return jsonify({"type": ResponseType.ERROR, "message": f"Error interno del servidor: {str(e)}"}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout() -> tuple[Response, int] | Response:
    """Cierra sesión de usuario (en este caso simple solo devuelve confirmación)"""
    return jsonify({"type": ResponseType.INFO, "message": "Logout exitoso"}), 200


@auth_bp.route("/me", methods=["GET"])
@auth_required
def get_current_user(user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Obtiene información del usuario actual basado en el token"""
    try:
        user_email = user.get("email")
        if not user_email:
            return jsonify({"type": ResponseType.ERROR, "message": "Email no encontrado en el token"}), 400

        current_user = find_user_by_email(user_email)
        if not current_user:
            return jsonify({"type": ResponseType.ERROR, "message": "Usuario no encontrado"}), 404

        return jsonify(
            {
                "type": ResponseType.SUCCESS,
                "message": "Usuario obtenido exitosamente",
                "data": {
                    "user": {
                        "id": current_user["id"],
                        "username": current_user["username"],
                        "email": current_user["email"],
                        "full_name": current_user["full_name"],
                        "rol": current_user["rol"],
                        "birth_date": current_user["birth_date"],
                        "gener": current_user["gener"],
                    }
                },
            }
        ), 200

    except Exception as e:
        return jsonify({"type": ResponseType.ERROR, "message": f"Error interno del servidor: {str(e)}"}), 500


@auth_bp.route("/protected", methods=["GET"])
@auth_required
def protected_endpoint(user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Ejemplo de endpoint protegido que requiere autenticación"""
    return jsonify(
        {
            "type": ResponseType.INFO,
            "message": f"Hola {user.get('username', 'Usuario')}, tienes acceso a este endpoint protegido!",
            "data": {"user_id": user.get("id"), "rol": user.get("rol")},
        }
    ), 200


@auth_bp.route("/admin-only", methods=["GET"])
@auth_required
def admin_only_endpoint(user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Ejemplo de endpoint que requiere rol de administrador"""
    if user.get("rol") != "admin":
        return jsonify(
            {
                "type": ResponseType.DANGER,
                "message": "Acceso denegado. Se requiere rol de administrador.",
                "data": user,
            }
        ), 403

    return jsonify(
        {
            "type": ResponseType.SUCCESS,
            "message": "Bienvenido al panel de administrador",
            "data": {"admin_info": "Información sensible solo para admins"},
        }
    ), 200
