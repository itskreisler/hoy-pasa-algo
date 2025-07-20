# Guía de Consumo de la API de Eventos

Esta guía proporciona instrucciones detalladas y ejemplos sobre cómo interactuar con cada uno de los endpoints de la API.

## 1. Autenticación

La autenticación se basa en tokens. Para acceder a los endpoints protegidos, primero debes registrar un usuario, luego iniciar sesión para obtener un token y, finalmente, incluir ese token en las cabeceras de tus solicitudes.

### 1.1. Registrar un Nuevo Usuario

Para crear una cuenta, envía una petición `POST` a `/api/v1/auth/register`.

**Endpoint:** `POST /api/v1/auth/register`

**Cuerpo de la Petición (JSON):**

```json
{
  "email": "tu_email@example.com",
  "password": "tu_contraseña_segura",
  "username": "tu_nombre_de_usuario",
  "full_name": "Tu Nombre Completo"
}
```

**Ejemplo con `curl`:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "testuser@example.com",
  "password": "password123",
  "username": "testuser",
  "full_name": "Test User"
}'
```

**Respuesta Exitosa (201):**

La API te devolverá los datos del usuario recién creado y un token de autenticación. **Guarda este token**, lo necesitarás para las siguientes peticiones.

```json
{
  "type": "success",
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "...",
      "username": "testuser",
      "email": "testuser@example.com",
      "full_name": "Test User",
      "rol": "user"
    },
    "token": "TU_TOKEN_DE_AUTENTICACION"
  }
}
```

### 1.2. Iniciar Sesión

Para iniciar sesión, envía tus credenciales al endpoint de login.

**Endpoint:** `POST /api/v1/auth/login`

**Cuerpo de la Petición (JSON):**

```json
{
  "email": "tu_email@example.com",
  "password": "tu_contraseña"
}
```

**Ejemplo con `curl`:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "testuser@example.com",
  "password": "password123"
}'
```

**Respuesta Exitosa (200):**

Al igual que en el registro, obtendrás un nuevo token.

```json
{
  "type": "success",
  "message": "Login exitoso",
  "data": {
    "user": { ... },
    "token": "TU_NUEVO_TOKEN_DE_AUTENTICACION"
  }
}
```

### 1.3. Acceder a Rutas Protegidas

Para acceder a un endpoint que requiere autenticación, debes incluir el token en la cabecera `Authorization` con el prefijo `Bearer`.

**Ejemplo: Obtener tu propio perfil (`/api/v1/auth/me`)**

**Ejemplo con `curl`:**

```bash
# Reemplaza TU_TOKEN con el token que obtuviste al registrarte o iniciar sesión
curl -X GET http://localhost:5000/api/v1/auth/me \
-H "Authorization: Bearer TU_TOKEN"
```

**Ejemplo con JavaScript (`fetch`):**

```javascript
const token = 'TU_TOKEN'; // El token que guardaste

fetch('http://localhost:5000/api/v1/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

Si el token es válido, recibirás los datos de tu perfil. Si no, obtendrás un error `401 Unauthorized`.

---

## 2. Eventos

Los endpoints de eventos te permiten gestionar todo lo relacionado con los eventos de la plataforma.

### 2.1. Crear un Evento

Para crear un nuevo evento, necesitas estar autenticado.

**Endpoint:** `POST /api/v1/events/`

**Cabecera Requerida:** `Authorization: Bearer TU_TOKEN`

**Cuerpo de la Petición (JSON):**

```json
{
  "title": "Lanzamiento de mi Nuevo Libro",
  "description": "Ven a la presentación de mi último libro de ciencia ficción.",
  "date": "2025-10-15",
  "visibility": "public"
}
```

*   `visibility` puede ser `public`, `private` (solo visible para ti y la gente que invitas, aunque la lógica de invitación no está implementada), o `only_me` (solo visible para ti).

**Ejemplo con JavaScript (`fetch`):**

```javascript
const token = 'TU_TOKEN';

const eventData = {
  title: 'Concierto de Rock',
  description: 'Las mejores bandas locales en una noche épica.',
  date: '2025-11-20',
  visibility: 'public'
};

fetch('http://localhost:5000/api/v1/events/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(eventData)
})
.then(response => response.json())
.then(data => console.log(data));
```

### 2.2. Obtener Eventos

Puedes obtener una lista de eventos. La visibilidad de los eventos devueltos depende de si estás autenticado o no.

*   **Si no estás autenticado**, solo verás los eventos `public`.
*   **Si estás autenticado**, verás los eventos `public` de todos y tus propios eventos `private` y `only_me`.

**Endpoint:** `GET /api/v1/events/`

**Ejemplo con `curl` (sin autenticar):**

```bash
curl http://localhost:5000/api/v1/events/
```

**Ejemplo con `curl` (autenticado):**

```bash
curl http://localhost:5000/api/v1/events/ \
-H "Authorization: Bearer TU_TOKEN"
```

### 2.3. Actualizar un Evento

Solo puedes actualizar los eventos que tú has creado.

**Endpoint:** `PUT /api/v1/events/{event_id}`

**Cabecera Requerida:** `Authorization: Bearer TU_TOKEN`

**Cuerpo de la Petición (JSON):**

Puedes enviar solo los campos que quieres cambiar.

```json
{
  "title": "Título del Evento Actualizado",
  "city": "Nueva Ciudad"
}
```

### 2.4. Eliminar un Evento (Soft Delete)

Esto no borra el evento de la base de datos, sino que lo marca como "eliminado" para que ya no sea visible en las listas públicas. Solo el propietario puede hacerlo.

**Endpoint:** `DELETE /api/v1/events/{event_id}`

**Cabecera Requerida:** `Authorization: Bearer TU_TOKEN`

---

## 3. Usuarios

Estos endpoints te permiten gestionar los datos de los usuarios.

### 3.1. Obtener tu Propio Perfil

Ya hemos visto esto en la sección de autenticación, pero aquí está de nuevo.

**Endpoint:** `GET /api/v1/auth/me`

**Cabecera Requerida:** `Authorization: Bearer TU_TOKEN`

### 3.2. Actualizar tu Perfil

Puedes actualizar la información de tu perfil, como tu nombre completo. No puedes cambiar tu email o rol a través de este endpoint.

**Endpoint:** `PUT /api/v1/users/{user_id}`

**Cabecera Requerida:** `Authorization: Bearer TU_TOKEN`

**Cuerpo de la Petición (JSON):**

```json
{
  "full_name": "Mi Nuevo Nombre Completo"
}
```

---

## 4. Favoritos

Puedes marcar eventos como favoritos para guardarlos en una lista personal.

### 4.1. Añadir un Evento a Favoritos

**Endpoint:** `POST /api/v1/events/favorites`

**Cabecera Requerida:** `Authorization: Bearer TU_TOKEN`

**Cuerpo de la Petición (JSON):**

```json
{
  "event_id": "ID_DEL_EVENTO_A_GUARDAR"
}
```

### 4.2. Obtener tus Favoritos

Devuelve una lista de todos los eventos que has marcado como favoritos.

**Endpoint:** `GET /api/v1/events/favorites`

**Cabecera Requerida:** `Authorization: Bearer TU_TOKEN`

### 4.3. Eliminar un Favorito

**Endpoint:** `DELETE /api/v1/events/favorites/{event_id}`

**Cabecera Requerida:** `Authorization: Bearer TU_TOKEN`
