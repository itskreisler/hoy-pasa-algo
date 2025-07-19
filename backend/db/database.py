"""
Inicializador de la base de datos CSV
Registra todos los modelos en el ORM
"""

from db.ORMcsv import orm


# Función para obtener instancias de los modelos
def get_user_model():
    return orm.get_model("usuario")


def get_event_model():
    return orm.get_model("event")
