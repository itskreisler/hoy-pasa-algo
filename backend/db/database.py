"""
Inicializador de la base de datos CSV
Registra todos los modelos en el ORM
"""

from models.usuario import Usuario
from models.evento import Evento
from db.ORMcsv import orm


# Función para obtener instancias de los modelos
def get_user_model():
    if "usuario" not in orm.models:
        orm.register_model("usuario", Usuario, "usuarios.csv")
    return orm.get_model("usuario")


def get_event_model():
    if "evento" not in orm.models:
        orm.register_model("evento", Evento, "eventos.csv")
    return orm.get_model("evento")
