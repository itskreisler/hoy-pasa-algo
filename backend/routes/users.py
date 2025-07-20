from libs.helpers import validate, auth_required
from models.usuario import Usuario
from db.ORMcsv import orm
from db.database import get_user_model
from flask import Blueprint, jsonify, request, Response
from typing import Any
from pydantic import ValidationError

# Blueprint para users
users_bp = Blueprint("users", __name__, url_prefix="/api/v1/users")

if "usuario" not in orm.models:
    orm.register_model("usuario", Usuario, "usuarios.csv")

user_model = get_user_model()


@users_bp.route("/", methods=["GET"])
@auth_required
def get_users(user: dict[str, Any]) -> tuple[Response, int] | Response:
    if user.get("rol") != "admin":
        return jsonify({"type": "error", "message": "Acceso denegado"}), 403
    users = user_model.find_all()
    for u in users:
        u.pop("password", None)
    return jsonify({"type": "success", "data": users, "total": len(users)})


@users_bp.route("/<string:user_id>", methods=["GET"])
@auth_required
def get_user(user_id: str, user: dict[str, Any]) -> tuple[Response, int] | Response:
    if str(user.get("id")) != user_id and user.get("rol") != "admin":
        return jsonify({"type": "error", "message": "Acceso denegado"}), 403
    found_user = user_model.find_by_id(user_id)
    if not found_user:
        return jsonify({"type": "error", "message": "Usuario no encontrado"}), 404
    found_user.pop("password", None)
    return jsonify({"type": "success", "data": found_user})


@users_bp.route("/<string:user_id>", methods=["PUT"])
@auth_required
def update_user(user_id: str, user: dict[str, Any]) -> tuple[Response, int] | Response:
    if str(user.get("id")) != user_id and user.get("rol") != "admin":
        return jsonify({"type": "error", "message": "Acceso denegado"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"type": "error", "message": "No se proporcionaron datos"}), 400

    # Excluir campos sensibles manualmente
    data.pop("email", None)
    data.pop("password", None)
    data.pop("rol", None)

    existing_user = user_model.find_by_id(user_id)
    if not existing_user:
        return jsonify({"type": "error", "message": "Usuario no encontrado"}), 404

    updated_user = user_model.update_by_id(user_id, data)
    if not updated_user:
        return jsonify({"type": "error", "message": "Error al actualizar el usuario"}), 500

    updated_user.pop("password", None)
    return jsonify({"type": "success", "data": updated_user})


@users_bp.route("/<string:user_id>/update-bio", methods=["PATCH"])
@auth_required
def update_user_bio(user_id: str, user: dict[str, Any]) -> tuple[Response, int] | Response:
    if str(user.get("id")) != user_id:
        return jsonify({"type": "error", "message": "Solo puedes actualizar tu propia biografía"}), 403

    data = request.get_json()
    if not data or "bio" not in data:
        return jsonify({"type": "error", "message": "El campo 'bio' es requerido"}), 400

    # Incluir solo el campo 'bio'
    update_data = {"bio": data["bio"]}

    updated_user = user_model.update_by_id(user_id, update_data)
    if not updated_user:
        return jsonify({"type": "error", "message": "Error al actualizar la biografía"}), 500

    updated_user.pop("password", None)
    return jsonify({"type": "success", "data": updated_user})


@users_bp.route("/<string:user_id>", methods=["DELETE"])
@auth_required
def delete_user(user_id: str, user: dict[str, Any]) -> tuple[Response, int] | Response:
    if user.get("rol") != "admin":
        return jsonify({"type": "error", "message": "Acceso denegado"}), 403
    if str(user.get("id")) == user_id:
        return jsonify({"type": "error", "message": "Un administrador no se puede eliminar a sí mismo"}), 400
    existing_user = user_model.find_by_id(user_id)
    if not existing_user:
        return jsonify({"type": "error", "message": "Usuario no encontrado"}), 404
    success = user_model.delete_by_id(user_id)
    if not success:
        return jsonify({"type": "error", "message": "Error al eliminar el usuario"}), 500
    return jsonify({"type": "success", "message": "Usuario eliminado exitosamente"})
