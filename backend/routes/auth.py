from libs.helpers import validate, auth_required, hash_password, verify_password, create_token
from models.usuario import Usuario
from db.database import get_user_model
from flask import Blueprint, jsonify, request
from typing import Optional, Any

# Blueprint para autenticación
auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


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
def register(validated: Usuario):
    """Registra un nuevo usuario"""
    try:
        # Verificar si el usuario ya existe
        if find_user_by_email(validated.email):
            return jsonify({"type": "error", "message": "Ya existe un usuario con este email"}), 400

        if validated.username and find_user_by_username(validated.username):
            return jsonify(
                {"type": "error", "message": "Ya existe un usuario con este username"}
            ), 400

        # Preparar datos del usuario
        user_data: dict[str, Any] = {
            "username": validated.username,
            "email": validated.email,
            "full_name": validated.full_name,
            "password": hash_password(validated.password),
            "rol": validated.rol or "user",
            "birth_date": validated.birth_date,
            "gener": validated.gener,
        }

        # Crear usuario usando el ORM
        user_model = get_user_model()
        created_user = user_model.create(user_data)

        # Crear token para el usuario recién registrado
        token_data: dict[str, Any] = {
            "id": created_user["id"],
            "username": created_user["username"],
            "email": created_user["email"],
            "rol": created_user["rol"],
        }
        token = create_token(token_data)

        return jsonify(
            {
                "type": "success",
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
        return jsonify({"type": "error", "message": f"Error interno del servidor: {str(e)}"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """Inicia sesión de usuario"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({"type": "error", "message": "No se proporcionaron datos"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"type": "error", "message": "Email y contraseña son requeridos"}), 400

        # Buscar usuario por email
        user = find_user_by_email(email)
        if not user:
            return jsonify({"type": "error", "message": "Credenciales inválidas"}), 401

        # Verificar contraseña
        if not verify_password(password, user["password"]):
            return jsonify({"type": "error", "message": "Credenciales inválidas"}), 401

        # Crear token
        token_data: dict[str, Any] = {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "rol": user["rol"],
        }
        token = create_token(token_data)

        return jsonify(
            {
                "type": "success",
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
        return jsonify({"type": "error", "message": f"Error interno del servidor: {str(e)}"}), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Cierra sesión de usuario (en este caso simple solo devuelve confirmación)"""
    return jsonify({"type": "success", "message": "Logout exitoso"}), 200


@auth_bp.route("/me", methods=["GET"])
@auth_required
def get_current_user(user: dict[str, Any]):
    """Obtiene información del usuario actual basado en el token"""
    try:
        # El decorador @auth_required ya validó el token y nos pasa user_data
        user_email = user.get("email")
        if not user_email:
            return jsonify({"type": "error", "message": "Email no encontrado en el token"}), 400

        # Buscar usuario actual en la base de datos
        current_user = find_user_by_email(user_email)
        if not current_user:
            return jsonify({"type": "error", "message": "Usuario no encontrado"}), 404

        return jsonify(
            {
                "type": "success",
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
        return jsonify({"type": "error", "message": f"Error interno del servidor: {str(e)}"}), 500


@auth_bp.route("/protected", methods=["GET"])
@auth_required
def protected_endpoint(user: dict[str, Any]):
    """Ejemplo de endpoint protegido que requiere autenticación"""
    return jsonify(
        {
            "type": "success",
            "message": (
                f"Hola {user.get('username', 'Usuario')}, tienes acceso a este endpoint protegido!"
            ),
            "data": {"user_id": user.get("id"), "rol": user.get("rol")},
        }
    ), 200


@auth_bp.route("/admin-only", methods=["GET"])
@auth_required
def admin_only_endpoint(user: dict[str, Any]):
    """Ejemplo de endpoint que requiere rol de administrador"""
    print(f"Usuario autenticado: {user.get('username')}, Rol: {user.get('rol')}")
    if user.get("rol") != "admin":
        return jsonify(
            {
                "type": "error",
                "message": "Acceso denegado. Se requiere rol de administrador.",
                "data": user,
            }
        ), 403

    return jsonify(
        {
            "type": "success",
            "message": "Bienvenido al panel de administrador",
            "data": {"admin_info": "Información sensible solo para admins"},
        }
    ), 200
