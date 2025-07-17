from flask import Blueprint, jsonify, request
from dataclasses import dataclass
from typing import List, Dict, Any

# Blueprint para users
users_bp = Blueprint("users", __name__, url_prefix="/api/v1/users")


@dataclass
class User:
    id: int
    name: str
    email: str
    age: int


# Base de datos simulada
users_db: List[User] = [
    User(1, "Kreislersadasdasd", "juan@example.com", 25),
    User(2, "María García", "maria@example.com", 30),
    User(3, "Carlos López", "carlos@example.com", 28),
]


@users_bp.route("/", methods=["GET"])
def get_users():
    """Obtener todos los usuarios"""
    users_data: List[Dict[str, Any]] = [
        {"id": user.id, "name": user.name, "email": user.email, "age": user.age}
        for user in users_db
    ]
    return jsonify({"success": True, "data": users_data, "total": len(users_data)})


@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id: int):
    """Obtener un usuario por ID"""
    user = next((u for u in users_db if u.id == user_id), None)

    if not user:
        return jsonify({"success": False, "error": "Usuario no encontrado"}), 404

    return jsonify(
        {
            "success": True,
            "data": {"id": user.id, "name": user.name, "email": user.email, "age": user.age},
        }
    )


@users_bp.route("/", methods=["POST"])
def create_user():
    """Crear un nuevo usuario"""
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "No se proporcionaron datos"}), 400

    # Validar campos requeridos
    required_fields = ["name", "email", "age"]
    for field in required_fields:
        if field not in data:
            return jsonify({"success": False, "error": f"Campo requerido: {field}"}), 400

    # Generar nuevo ID
    new_id = max([u.id for u in users_db], default=0) + 1

    # Crear nuevo usuario
    new_user = User(id=new_id, name=data["name"], email=data["email"], age=data["age"])

    users_db.append(new_user)

    return jsonify(
        {
            "success": True,
            "data": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "age": new_user.age,
            },
            "message": "Usuario creado exitosamente",
        }
    ), 201


@users_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id: int):
    """Actualizar un usuario"""
    user = next((u for u in users_db if u.id == user_id), None)

    if not user:
        return jsonify({"success": False, "error": "Usuario no encontrado"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "No se proporcionaron datos"}), 400

    # Actualizar campos
    if "name" in data:
        user.name = data["name"]
    if "email" in data:
        user.email = data["email"]
    if "age" in data:
        user.age = data["age"]

    return jsonify(
        {
            "success": True,
            "data": {"id": user.id, "name": user.name, "email": user.email, "age": user.age},
            "message": "Usuario actualizado exitosamente",
        }
    )


@users_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id: int):
    """Eliminar un usuario"""
    global users_db

    user = next((u for u in users_db if u.id == user_id), None)

    if not user:
        return jsonify({"success": False, "error": "Usuario no encontrado"}), 404

    users_db = [u for u in users_db if u.id != user_id]

    return jsonify({"success": True, "message": "Usuario eliminado exitosamente"})
