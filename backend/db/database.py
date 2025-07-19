"""
Inicializador de la base de datos CSV
Registra todos los modelos en el ORM
"""

from db.ORMcsv import orm
from models.usuario import Usuario


def init_database():
    """Inicializa la base de datos registrando todos los modelos"""
    # Registrar modelos
    orm.register_model("users", Usuario, "users.csv")

    print("Base de datos CSV inicializada correctamente")


# Función para obtener instancias de los modelos
def get_user_model():
    return orm.get_model("users")


def get_event_model():
    return orm.get_model("events")
