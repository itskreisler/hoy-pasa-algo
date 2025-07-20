from flask import Blueprint, jsonify, request, Response
from typing import Any, List
from db.ORMcsv import orm
from models.evento import Evento, Category, Favorite
from libs.helpers import validate, auth_required, auth_optional

# Blueprint para events
events_bp = Blueprint("events", __name__, url_prefix="/api/v1/events")

# Registrar modelos en el ORM
orm.register_model("event", Evento, "eventos.csv")
orm.register_model("category", Category, "categories.csv")
orm.register_model("favorite", Favorite, "favorites.csv")

# Obtener instancias del ORM
evento_model = orm.get_model("event")
category_model = orm.get_model("category")
favorite_model = orm.get_model("favorite")


# ====== FUNCIONES HELPER PARA SOFT DELETE ======


def filter_active_events(
    events: list[dict[str, Any]], include_archived: bool = False
) -> list[dict[str, Any]]:
    """
    Filtrar eventos según su status (soft delete).
    PRIORIDAD:
    1. deleted -> NUNCA se muestra
    2. archived -> Solo si include_archived=True
    3. activo (sin status) -> Siempre se muestra
    """
    filtered_events = []
    for event in events:
        status = event.get("status")

        # PRIORIDAD 1: Nunca mostrar eventos eliminados
        if status == "deleted":
            continue

        # PRIORIDAD 2: Solo mostrar archivados si se solicita explícitamente
        if status == "archived" and not include_archived:
            continue

        # PRIORIDAD 3: Mostrar eventos activos (sin status o con otro valor)
        filtered_events.append(event)

    return filtered_events


def get_event_with_status_check(
    event_id: str, allow_deleted: bool = False, allow_archived: bool = True
) -> dict[str, Any] | None:
    """
    Obtener evento verificando su status.
    - allow_deleted: Si True, permite obtener eventos eliminados
    - allow_archived: Si True, permite obtener eventos archivados
    """
    event = evento_model.find_by_id(event_id)
    if not event:
        return None

    status = event.get("status")

    if status == "deleted" and not allow_deleted:
        return None

    if status == "archived" and not allow_archived:
        return None

    return event


@events_bp.route("/", methods=["GET"])
@auth_optional
def get_events(user: dict[str, Any] | None) -> tuple[Response, int] | Response:
    """
    Obtiene una lista de eventos.
    ---
    tags:
      - Eventos
    parameters:
      - name: page
        in: query
        type: integer
        description: Número de página para la paginación.
      - name: per_page
        in: query
        type: integer
        description: Número de eventos por página.
      - name: include_archived
        in: query
        type: boolean
        description: Incluir eventos archivados en los resultados.
    responses:
      200:
        description: Una lista de eventos.
        content:
          application/json:
            schema:
              type: object
              properties:
                success:
                  type: boolean
                data:
                  type: array
                  items:
                    $ref: '#/components/schemas/Evento'
    """
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        include_archived = request.args.get("include_archived", "false").lower() == "true"

        all_events = evento_model.find_all()
        active_events = filter_active_events(all_events, include_archived=include_archived)

        visible_events = []
        user_id = user.get("id") if user else None

        for event in active_events:
            if event.get("visibility") == "public":
                visible_events.append(event)
            elif user_id and str(event.get("user_id")) == str(user_id):
                if event.get("visibility") in ["private", "only_me"]:
                    visible_events.append(event)

        total = len(visible_events)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        paginated_events = visible_events[start_idx:end_idx]

        return jsonify(
            {
                "success": True,
                "data": paginated_events,
                "pagination": {
                    "page": page,
                    "per_page": per_page,
                    "total": total,
                    "pages": (total + per_page - 1) // per_page,
                },
            }
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/<string:event_id>", methods=["GET"])
def get_event(event_id: str) -> tuple[Response, int] | Response:
    """
    Obtener un evento por ID con soft delete.
    Solo muestra eventos activos o archivados (NO eliminados).
    """
    try:
        event = get_event_with_status_check(
            event_id,
            allow_deleted=False,
            allow_archived=True,
        )

        if not event:
            return jsonify({"success": False, "error": "Evento no encontrado o no disponible"}), 404

        response_data = event.copy()
        if event.get("status"):
            response_data["_status_info"] = {
                "status": event["status"],
                "message": "Este evento está archivado" if event["status"] == "archived" else None,
            }

        return jsonify({"success": True, "data": response_data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/", methods=["POST"])
@auth_required
@validate(Evento)
def create_event(validated: Evento, user: dict[str, Any]) -> tuple[Response, int] | Response:
    """
    Crea un nuevo evento.
    ---
    tags:
      - Eventos
    security:
      - BearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Evento'
    responses:
      201:
        description: Evento creado exitosamente.
      400:
        description: Datos inválidos.
      401:
        description: Token de autorización no válido.
    components:
      schemas:
        Evento:
          type: object
          properties:
            id:
              type: string
              description: ID único del evento (generado automáticamente).
            user_id:
              type: string
              description: ID del usuario que creó el evento.
            title:
              type: string
              description: Título del evento.
            description:
              type: string
              description: Descripción del evento.
            date:
              type: string
              format: date
              description: Fecha del evento (YYYY-MM-DD).
            time:
              type: string
              description: Hora del evento.
            country:
              type: string
              description: País del evento.
            city:
              type: string
              description: Ciudad del evento.
            category_id:
              type: string
              description: ID de la categoría del evento.
            visibility:
              type: string
              enum: ['public', 'private', 'only_me']
              description: Visibilidad del evento.
    """
    try:
        event_data = validated.model_dump()
        event_data["user_id"] = str(user["id"])
        new_event = evento_model.create(event_data)
        return jsonify(
            {"success": True, "data": new_event, "message": "Evento creado exitosamente"}
        ), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/<string:event_id>", methods=["PUT"])
@auth_required
def update_event(event_id: str, user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Actualizar un evento - Solo el propietario del evento"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No se proporcionaron datos"}), 400

        existing_event = evento_model.find_by_id(event_id)
        if not existing_event:
            return jsonify({"success": False, "error": "Evento no encontrado"}), 404

        if str(existing_event.get("user_id")) != str(user["id"]):
            return jsonify(
                {"success": False, "error": "No tienes permisos para actualizar este evento"}
            ), 403

        updated_event = evento_model.update_by_id(event_id, data)
        return jsonify(
            {"success": True, "data": updated_event, "message": "Evento actualizado exitosamente"}
        )
    except ValueError as e:
        return jsonify({"success": False, "error": f"Error de validación: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/<string:event_id>", methods=["DELETE"])
@auth_required
def delete_event(event_id: str, user: dict[str, Any]) -> tuple[Response, int] | Response:
    """
    SOFT DELETE: Marcar evento como eliminado en lugar de borrar físicamente.
    Solo el propietario puede eliminar su evento.
    """
    try:
        existing_event = get_event_with_status_check(
            event_id,
            allow_deleted=False,
            allow_archived=True,
        )
        if not existing_event:
            return jsonify({"success": False, "error": "Evento no encontrado o ya eliminado"}), 404

        if str(existing_event.get("user_id")) != str(user["id"]):
            return jsonify(
                {"success": False, "error": "No tienes permisos para eliminar este evento"}
            ), 403

        updated_event = evento_model.update_by_id(event_id, {"status": "deleted"})
        if updated_event:
            return jsonify(
                {
                    "success": True,
                    "message": "Evento eliminado exitosamente (soft delete)",
                    "info": "El evento ya no será visible pero se mantiene para referencias",
                }
            )
        else:
            return jsonify({"success": False, "error": "Error al eliminar el evento"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/my-events", methods=["GET"])
@auth_required
def get_my_events(user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Obtener eventos del usuario autenticado"""
    try:
        user_events = evento_model.find_by_field("user_id", str(user["id"]))
        return jsonify({"success": True, "data": user_events, "total": len(user_events)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/search", methods=["GET"])
def search_events() -> tuple[Response, int] | Response:
    """Buscar eventos por título, descripción o ubicación"""
    try:
        query = request.args.get("q", "").lower().strip()
        if not query:
            return jsonify({"success": False, "error": "Parámetro de búsqueda requerido: q"}), 400

        all_events = evento_model.find_all()
        filtered_events: list[dict[str, Any]] = []

        for event in all_events:
            title = str(event.get("title") or "").lower()
            description = str(event.get("description") or "").lower()
            city = str(event.get("city") or "").lower()
            country = str(event.get("country") or "").lower()

            if query in title or query in description or query in city or query in country:
                filtered_events.append(event)

        return jsonify(
            {
                "success": True,
                "data": filtered_events,
                "total": len(filtered_events),
                "query": query,
            }
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/category/<string:category_id>", methods=["GET"])
def get_events_by_category(category_id: str) -> tuple[Response, int] | Response:
    """Obtener eventos por categoría"""
    try:
        events = evento_model.find_by_field("category_id", str(category_id))
        return jsonify(
            {"success": True, "data": events, "total": len(events), "category_id": category_id}
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/city/<city>", methods=["GET"])
def get_events_by_city(city: str) -> tuple[Response, int] | Response:
    """Obtener eventos por ciudad"""
    try:
        events = evento_model.find_by_field("city", city)
        return jsonify({"success": True, "data": events, "total": len(events), "city": city})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/country/<country>", methods=["GET"])
def get_events_by_country(country: str) -> tuple[Response, int] | Response:
    """Obtener eventos por país"""
    try:
        events = evento_model.find_by_field("country", country)
        return jsonify({"success": True, "data": events, "total": len(events), "country": country})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# Rutas para categorías
@events_bp.route("/categories", methods=["GET"])
def get_categories() -> tuple[Response, int] | Response:
    """Obtener todas las categorías"""
    try:
        categories = category_model.find_all()
        return jsonify({"success": True, "data": categories, "total": len(categories)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/categories", methods=["POST"])
def create_category() -> tuple[Response, int] | Response:
    """Crear una nueva categoría"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No se proporcionaron datos"}), 400
        new_category = category_model.create(data)
        return jsonify(
            {"success": True, "data": new_category, "message": "Categoría creada exitosamente"}
        ), 201
    except ValueError as e:
        return jsonify({"success": False, "error": f"Error de validación: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/categories/<string:category_id>", methods=["GET"])
def get_category(category_id: str) -> tuple[Response, int] | Response:
    """Obtener una categoría por ID"""
    try:
        category = category_model.find_by_id(category_id)
        if not category:
            return jsonify({"success": False, "error": "Categoría no encontrada"}), 404
        return jsonify({"success": True, "data": category})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ====== ENDPOINTS DE FAVORITOS ======


@events_bp.route("/favorites", methods=["POST"])
@auth_required
def add_favorite(user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Agregar un evento a favoritos"""
    try:
        data = request.get_json()
        if not data or not data.get("event_id"):
            return jsonify({"success": False, "error": "event_id es requerido"}), 400

        event_id = data["event_id"]
        event = evento_model.find_by_id(event_id)
        if not event:
            return jsonify({"success": False, "error": "Evento no encontrado"}), 404

        user_favorites = favorite_model.find_by_field("user_id", str(user["id"]))
        existing_favorite = next(
            (fav for fav in user_favorites if fav["event_id"] == event_id), None
        )
        if existing_favorite:
            return jsonify({"success": False, "error": "El evento ya está en favoritos"}), 400

        favorite_data = {"user_id": str(user["id"]), "event_id": event_id}
        new_favorite = favorite_model.create(favorite_data)
        return jsonify(
            {"success": True, "data": new_favorite, "message": "Evento agregado a favoritos"}
        ), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/favorites", methods=["GET"])
@auth_required
def get_user_favorites(user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Obtener favoritos del usuario actual"""
    try:
        user_favorites = favorite_model.find_by_field("user_id", str(user["id"]))
        favorite_events = []
        for fav in user_favorites:
            event = evento_model.find_by_id(fav["event_id"])
            if event:
                favorite_events.append({"favorite_id": fav["id"], "event": event})
        return jsonify({"success": True, "data": favorite_events, "total": len(favorite_events)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/favorites/<string:event_id>", methods=["DELETE"])
@auth_required
def remove_favorite(event_id: str, user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Quitar un evento de favoritos"""
    try:
        user_favorites = favorite_model.find_by_field("user_id", str(user["id"]))
        favorite = next((fav for fav in user_favorites if fav["event_id"] == event_id), None)
        if not favorite:
            return jsonify({"success": False, "error": "El evento no está en favoritos"}), 404
        favorite_model.delete_by_id(favorite["id"])
        return jsonify({"success": True, "message": "Evento removido de favoritos"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ====== ENDPOINTS ESPECÍFICOS PARA SOFT DELETE ======


@events_bp.route("/<string:event_id>/archive", methods=["PUT"])
@auth_required
def archive_event(event_id: str, user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Archivar un evento (soft delete reversible)"""
    try:
        existing_event = get_event_with_status_check(
            event_id,
            allow_deleted=False,
            allow_archived=False,
        )
        if not existing_event:
            return jsonify(
                {"success": False, "error": "Evento no encontrado o ya archivado/eliminado"}
            ), 404

        if str(existing_event.get("user_id")) != str(user["id"]):
            return jsonify(
                {"success": False, "error": "No tienes permisos para archivar este evento"}
            ), 403

        updated_event = evento_model.update_by_id(event_id, {"status": "archived"})
        return jsonify(
            {
                "success": True,
                "message": "Evento archivado exitosamente",
                "data": updated_event,
                "info": "El evento archivado estará disponible con filtro include_archived=true",
            }
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/<string:event_id>/restore", methods=["PUT"])
@auth_required
def restore_event(event_id: str, user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Restaurar un evento archivado (volver a activo)"""
    try:
        existing_event = get_event_with_status_check(
            event_id, allow_deleted=False, allow_archived=True
        )
        if not existing_event:
            return jsonify({"success": False, "error": "Evento no encontrado"}), 404

        if existing_event.get("status") != "archived":
            return jsonify(
                {"success": False, "error": "Solo se pueden restaurar eventos archivados"}
            ), 400

        if str(existing_event.get("user_id")) != str(user["id"]):
            return jsonify(
                {"success": False, "error": "No tienes permisos para restaurar este evento"}
            ), 403

        updated_event = evento_model.update_by_id(event_id, {"status": None})
        return jsonify(
            {
                "success": True,
                "message": "Evento restaurado exitosamente",
                "data": updated_event,
                "info": "El evento vuelve a estar activo y visible",
            }
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/<string:event_id>/hard-delete", methods=["DELETE"])
@auth_required
def hard_delete_event(event_id: str, user: dict[str, Any]) -> tuple[Response, int] | Response:
    """
    HARD DELETE: Borrar físicamente el evento (PELIGROSO - solo para admins o casos especiales).
    También borra en CASCADA todos los favoritos relacionados.
    """
    try:
        existing_event = evento_model.find_by_id(event_id)
        if not existing_event:
            return jsonify({"success": False, "error": "Evento no encontrado"}), 404

        if str(existing_event.get("user_id")) != str(user["id"]):
            return jsonify(
                {
                    "success": False,
                    "error": "No tienes permisos para eliminar permanentemente este evento",
                }
            ), 403

        user_favorites = favorite_model.find_by_field("event_id", event_id)
        favorites_count = len(user_favorites)
        for fav in user_favorites:
            favorite_model.delete_by_id(fav["id"])

        success = evento_model.delete_by_id(event_id)
        if success:
            return jsonify(
                {
                    "success": True,
                    "message": "Evento eliminado permanentemente",
                    "info": {
                        "warning": "Esta acción no se puede deshacer",
                        "favorites_deleted": favorites_count,
                    },
                }
            )
        else:
            return jsonify(
                {"success": False, "error": "Error al eliminar el evento físicamente"}
            ), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/deleted", methods=["GET"])
@auth_required
def get_deleted_events(user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Obtener eventos eliminados (soft delete) del usuario actual - Solo propietario"""
    try:
        user_events = evento_model.find_by_field("user_id", str(user["id"]))
        deleted_events = [e for e in user_events if e.get("status") == "deleted"]
        return jsonify(
            {
                "success": True,
                "data": deleted_events,
                "total": len(deleted_events),
                "info": "Estos eventos están eliminados (soft delete) y no son visibles públicamente",
            }
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@events_bp.route("/archived", methods=["GET"])
@auth_required
def get_archived_events(user: dict[str, Any]) -> tuple[Response, int] | Response:
    """Obtener eventos archivados del usuario actual"""
    try:
        user_events = evento_model.find_by_field("user_id", str(user["id"]))
        archived_events = [e for e in user_events if e.get("status") == "archived"]
        return jsonify(
            {
                "success": True,
                "data": archived_events,
                "total": len(archived_events),
                "info": "Eventos archivados - pueden ser restaurados",
            }
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
