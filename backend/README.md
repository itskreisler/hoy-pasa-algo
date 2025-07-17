# Backend API

API REST desarrollada con Flask para gestionar usuarios y eventos.

## Estructura del Proyecto

```
backend/
├── app.py              # Punto de entrada de la aplicación
├── factory.py          # Factory para crear la aplicación Flask
├── config.py           # Configuraciones de la aplicación
├── routes/             # Endpoints organizados por módulos
│   ├── __init__.py
│   ├── users.py        # API de usuarios
│   └── events.py       # API de eventos
├── pyproject.toml      # Dependencias y configuración
└── README.md
```

## Endpoints Disponibles

### API de Usuarios (`/api/v1/users`)

- `GET /api/v1/users` - Obtener todos los usuarios
- `GET /api/v1/users/<id>` - Obtener un usuario específico
- `POST /api/v1/users` - Crear un nuevo usuario
- `PUT /api/v1/users/<id>` - Actualizar un usuario
- `DELETE /api/v1/users/<id>` - Eliminar un usuario

**Ejemplo de usuario:**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "age": 25
}
```

### API de Eventos (`/api/v1/events`)

- `GET /api/v1/events` - Obtener todos los eventos
- `GET /api/v1/events/<id>` - Obtener un evento específico
- `POST /api/v1/events` - Crear un nuevo evento
- `PUT /api/v1/events/<id>` - Actualizar un evento
- `DELETE /api/v1/events/<id>` - Eliminar un evento
- `GET /api/v1/events/search?q=<query>` - Buscar eventos

**Ejemplo de evento:**
```json
{
  "id": 1,
  "title": "Conferencia de Python",
  "description": "Una conferencia sobre desarrollo en Python",
  "date": "2025-08-15",
  "location": "Madrid",
  "organizer_id": 1
}
```

## Instalación y Ejecución

1. Instalar dependencias:
```bash
uv sync
```

2. Ejecutar la aplicación:
```bash
python app.py
uv run -- flask run -p 3000
flask --app app run --debug
```

3. La API estará disponible en `http://localhost:5000`

## CORS

La API está configurada para permitir peticiones desde:
- `http://localhost:4321` (frontend de desarrollo)
- `http://127.0.0.1:4321`

## Cómo Agregar Nuevos Endpoints

1. Crear un nuevo archivo en la carpeta `routes/` (ej: `products.py`)
2. Definir un Blueprint:
```python
from flask import Blueprint

products_bp = Blueprint('products', __name__, url_prefix='/api/v1/products')

@products_bp.route('/', methods=['GET'])
def get_products():
    return {"products": []}
```

3. Registrar el Blueprint en `factory.py`:
```python
from routes.products import products_bp
app.register_blueprint(products_bp)
```

## Configuración

La aplicación usa diferentes configuraciones según el entorno:
- `development`: Para desarrollo local
- `production`: Para producción

Configurar el entorno con la variable `FLASK_ENV`.