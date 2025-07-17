from flask import Blueprint, jsonify, request
from dataclasses import dataclass
from typing import List, Dict, Any

# Blueprint para events
events_bp = Blueprint("events", __name__, url_prefix="/api/v1/events")


@dataclass
class Event:
    id: int
    title: str
    description: str
    date: str
    location: str
    organizer_id: int


# Base de datos simulada
events_db: List[Event] = [
    Event(
        1,
        "Conferencia de Python",
        "Una conferencia sobre desarrollo en Python",
        "2025-08-15",
        "Madrid",
        1,
    ),
    Event(
        2,
        "Workshop de Flask",
        "Taller práctico de desarrollo web con Flask",
        "2025-08-20",
        "Barcelona",
        2,
    ),
    Event(
        3,
        "Meetup de Desarrolladores",
        "Encuentro mensual de la comunidad",
        "2025-08-25",
        "Valencia",
        1,
    ),
]


@events_bp.route("/", methods=["GET"])
def get_events():
    """Obtener todos los eventos"""
    events_data: List[Dict[str, Any]] = [
        {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "location": event.location,
            "organizer_id": event.organizer_id,
        }
        for event in events_db
    ]
    return jsonify({"success": True, "data": events_data, "total": len(events_data)})


@events_bp.route("/<int:event_id>", methods=["GET"])
def get_event(event_id: int):
    """Obtener un evento por ID"""
    event = next((e for e in events_db if e.id == event_id), None)

    if not event:
        return jsonify({"success": False, "error": "Evento no encontrado"}), 404

    return jsonify(
        {
            "success": True,
            "data": {
                "id": event.id,
                "title": event.title,
                "description": event.description,
                "date": event.date,
                "location": event.location,
                "organizer_id": event.organizer_id,
            },
        }
    )


@events_bp.route("/", methods=["POST"])
def create_event():
    """Crear un nuevo evento"""
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "No se proporcionaron datos"}), 400

    # Validar campos requeridos
    required_fields = ["title", "description", "date", "location", "organizer_id"]
    for field in required_fields:
        if field not in data:
            return jsonify({"success": False, "error": f"Campo requerido: {field}"}), 400

    # Generar nuevo ID
    new_id = max([e.id for e in events_db], default=0) + 1

    # Crear nuevo evento
    new_event = Event(
        id=new_id,
        title=data["title"],
        description=data["description"],
        date=data["date"],
        location=data["location"],
        organizer_id=data["organizer_id"],
    )

    events_db.append(new_event)

    return jsonify(
        {
            "success": True,
            "data": {
                "id": new_event.id,
                "title": new_event.title,
                "description": new_event.description,
                "date": new_event.date,
                "location": new_event.location,
                "organizer_id": new_event.organizer_id,
            },
            "message": "Evento creado exitosamente",
        }
    ), 201


@events_bp.route("/<int:event_id>", methods=["PUT"])
def update_event(event_id: int):
    """Actualizar un evento"""
    event = next((e for e in events_db if e.id == event_id), None)

    if not event:
        return jsonify({"success": False, "error": "Evento no encontrado"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "No se proporcionaron datos"}), 400

    # Actualizar campos
    if "title" in data:
        event.title = data["title"]
    if "description" in data:
        event.description = data["description"]
    if "date" in data:
        event.date = data["date"]
    if "location" in data:
        event.location = data["location"]
    if "organizer_id" in data:
        event.organizer_id = data["organizer_id"]

    return jsonify(
        {
            "success": True,
            "data": {
                "id": event.id,
                "title": event.title,
                "description": event.description,
                "date": event.date,
                "location": event.location,
                "organizer_id": event.organizer_id,
            },
            "message": "Evento actualizado exitosamente",
        }
    )


@events_bp.route("/<int:event_id>", methods=["DELETE"])
def delete_event(event_id: int):
    """Eliminar un evento"""
    global events_db

    event = next((e for e in events_db if e.id == event_id), None)

    if not event:
        return jsonify({"success": False, "error": "Evento no encontrado"}), 404

    events_db = [e for e in events_db if e.id != event_id]

    return jsonify({"success": True, "message": "Evento eliminado exitosamente"})


@events_bp.route("/search", methods=["GET"])
def search_events():
    """Buscar eventos por título o ubicación"""
    query = request.args.get("q", "").lower()

    if not query:
        return jsonify({"success": False, "error": "Parámetro de búsqueda requerido: q"}), 400

    filtered_events = [
        event
        for event in events_db
        if query in event.title.lower() or query in event.location.lower()
    ]

    events_data: List[Dict[str, Any]] = [
        {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "location": event.location,
            "organizer_id": event.organizer_id,
        }
        for event in filtered_events
    ]

    return jsonify(
        {"success": True, "data": events_data, "total": len(events_data), "query": query}
    )
