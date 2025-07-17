from flask import Blueprint, jsonify, request
from dataclasses import dataclass


# Blueprint para users
users_bp = Blueprint("users", __name__, url_prefix="/api/v1/users")


@users_bp.route("/", methods=["GET"])
def get_users():
    return jsonify({})


@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id: int):
    return jsonify({})


@users_bp.route("/", methods=["POST"])
def create_user():
    return jsonify({})


@users_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id: int):
    return jsonify({})


@users_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id: int):
    return jsonify({})
