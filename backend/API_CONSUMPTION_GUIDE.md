# Guía de Consumo de la API - Hoy Pasa Algo

Esta guía explica cómo interactuar con los endpoints de la API del backend.

##  baseURL
Todos los endpoints están disponibles bajo la siguiente URL base:
`http://localhost:5000/api/v1`

---

## 1. Autenticación (`/auth`)

La autenticación se gestiona con tokens JWT. Necesitas un token para acceder a las rutas protegidas.

### 1.1. Registrar un Nuevo Usuario
Crea una cuenta para obtener tus credenciales.

- **Endpoint:** `POST /auth/register`
- **Body (JSON):**
  ```json
  {
    "email": "tu_email@example.com",
    "password": "tu_contraseña",
    "username": "tu_usuario",
    "full_name": "Tu Nombre Completo"
  }
  ```
- **Respuesta Exitosa (201):**
  ```json
  {
    "message": "Usuario registrado exitosamente",
    "token": "TU_TOKEN_JWT"
  }
  ```

### 1.2. Iniciar Sesión
Inicia sesión para obtener un token de autenticación.

- **Endpoint:** `POST /auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "tu_email@example.com",
    "password": "tu_contraseña"
  }
  ```
- **Respuesta Exitosa (200):**
  ```json
  {
    "message": "Login exitoso",
    "token": "TU_TOKEN_JWT"
  }
  ```

### 1.3. Acceder a Rutas Protegidas
Para acceder a rutas protegidas, incluye el token en la cabecera `Authorization`.

- **Cabecera:** `Authorization: Bearer TU_TOKEN_JWT`
- **Ejemplo (`GET /auth/me`):**
  ```bash
  curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer TU_TOKEN_JWT"
  ```
  Devuelve los datos del usuario autenticado.

---

## 2. Eventos (`/events`)

Gestión completa de los eventos de la plataforma.

### 2.1. Crear un Evento (Autenticado)
- **Endpoint:** `POST /events/`
- **Body (JSON):**
  ```json
  {
    "title": "Título del Evento",
    "description": "Descripción detallada del evento.",
    "date": "YYYY-MM-DD",
    "visibility": "public" // public, private, only_me
  }
  ```

### 2.2. Obtener Eventos
- **Endpoint:** `GET /events/`
- **Query Params (Opcionales):**
  - `q`: Búsqueda por texto en título y descripción.
  - `city`: Filtrar por ciudad.
  - `category`: Filtrar por categoría.
- **Comportamiento:**
  - **Sin autenticar:** Devuelve solo eventos `public`.
  - **Autenticado:** Devuelve eventos `public` de todos, más los eventos `private` y `only_me` del propio usuario.

### 2.3. Actualizar un Evento (Solo Propietario)
- **Endpoint:** `PUT /events/{event_id}`
- **Body (JSON):** Incluye solo los campos a modificar.

### 2.4. Eliminar un Evento (Soft Delete, Solo Propietario)
Marca un evento como "archivado".
- **Endpoint:** `DELETE /events/{event_id}`

---

## 3. Favoritos (`/events/favorites`)

Los usuarios autenticados pueden gestionar su lista de eventos favoritos.

### 3.1. Añadir un Evento a Favoritos
- **Endpoint:** `POST /events/favorites`
- **Body (JSON):**
  ```json
  { "event_id": "ID_DEL_EVENTO" }
  ```

### 3.2. Obtener tus Favoritos
- **Endpoint:** `GET /events/favorites`

### 3.3. Eliminar un Favorito
- **Endpoint:** `DELETE /events/favorites/{event_id}`

---

## 4. Usuarios (`/users`)

Endpoints para gestionar datos de usuarios.

### 4.1. Obtener tu Propio Perfil
- **Endpoint:** `GET /auth/me` (ver sección de autenticación)

### 4.2. Actualizar tu Perfil (Solo Propietario)
- **Endpoint:** `PUT /users/{user_id}`
- **Body (JSON):**
  ```json
  { "full_name": "Tu Nuevo Nombre" }
  ```

### 4.3. Obtener Perfil de Otro Usuario
- **Endpoint:** `GET /users/{user_id}`
- **Respuesta:** Devuelve información pública del usuario.
