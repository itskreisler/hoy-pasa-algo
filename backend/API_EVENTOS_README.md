# API de Eventos - Resumen de Implementación

## ✅ Cambios Realizados

### 1. **Modelo Correcto**
- Se usa el archivo `models/evento.py` (no `eventos.py`)
- El modelo `Evento` incluye el campo `user_id` para asociar eventos con usuarios

### 2. **Autenticación Implementada**
- **Crear eventos**: Requiere autenticación (`@auth_required` + `@validate`)
- **Actualizar eventos**: Solo el propietario puede actualizar (`@auth_required`)
- **Eliminar eventos**: Solo el propietario puede eliminar (`@auth_required`)
- **Ver eventos**: Público (no requiere autenticación)

### 3. **Rutas Disponibles**

#### **Públicas** (no requieren autenticación):
```bash
GET /api/v1/events/                    # Obtener todos los eventos
GET /api/v1/events/{id}                # Obtener evento específico
GET /api/v1/events/search?q=query      # Buscar eventos
GET /api/v1/events/category/{id}       # Eventos por categoría
GET /api/v1/events/city/{city}         # Eventos por ciudad
GET /api/v1/events/country/{country}   # Eventos por país
GET /api/v1/events/categories          # Obtener categorías
GET /api/v1/events/categories/{id}     # Obtener categoría específica
```

#### **Requieren Autenticación** (Header: `Authorization: Bearer TOKEN`):
```bash
POST   /api/v1/events/                 # Crear evento
PUT    /api/v1/events/{id}             # Actualizar evento (solo propietario)
DELETE /api/v1/events/{id}             # Eliminar evento (solo propietario)
GET    /api/v1/events/my-events        # Mis eventos
POST   /api/v1/events/categories       # Crear categoría
```

### 4. **Validaciones de Seguridad**
- Solo usuarios autenticados pueden crear eventos
- Solo el propietario puede actualizar/eliminar sus eventos
- El `user_id` se asigna automáticamente del token JWT

### 5. **Uso del ORM CSV**
- Todos los datos se almacenan en archivos CSV
- Validación automática con Pydantic
- Manejo de errores mejorado

## 🧪 Ejemplos de Uso con CURL

### 1. Primero obtener token de autenticación:
```bash
# Registrar usuario
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123456",
    "full_name": "Usuario Test"
  }'

# Hacer login para obtener token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 2. Crear un evento (con token):
```bash
curl -X POST http://localhost:5000/api/v1/events/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Conferencia Tech",
    "description": "Una conferencia de tecnología",
    "date": "2025-08-15",
    "time": "09:00",
    "country": "España",
    "city": "Madrid",
    "category_id": "1",
    "subcategory_id": 1,
    "hashtags": ["tech", "conferencia"],
    "calendar": "2025-08-15T09:00:00",
    "image_url": "https://example.com/image.jpg",
    "link": "https://example.com/evento",
    "visibility": "public"
  }'
```

### 3. Obtener todos los eventos (público):
```bash
curl http://localhost:5000/api/v1/events/
```

### 4. Obtener mis eventos (requiere token):
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:5000/api/v1/events/my-events
```

### 5. Buscar eventos:
```bash
curl "http://localhost:5000/api/v1/events/search?q=Madrid"
```

### 6. Actualizar evento (solo propietario):
```bash
curl -X PUT http://localhost:5000/api/v1/events/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Conferencia Tech Actualizada",
    "description": "Descripción actualizada"
  }'
```

### 7. Eliminar evento (solo propietario):
```bash
curl -X DELETE http://localhost:5000/api/v1/events/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🚀 Para Iniciar el Servidor
```bash
python app.py
```

El servidor estará disponible en `http://localhost:5000`
