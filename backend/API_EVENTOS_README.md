# 🚀 API de Eventos - Guía para Desarrolladores Frontend

> **URL Base**: `http://localhost:5000`  
> **Versión**: v1  
> **Formato**: JSON  
> **Autenticación**: JWT Bearer Token  

## 📋 Tabla de Contenidos
- [🔐 Autenticación](#-autenticación)
- [📊 Estructura de Respuestas](#-estructura-de-respuestas)  
- [👤 Endpoints de Usuario](#-endpoints-de-usuario)
- [🎉 Endpoints de Eventos](#-endpoints-de-eventos)
- [⭐ Sistema de Favoritos](#-sistema-de-favoritos)
- [📂 Gestión de Categorías](#-gestión-de-categorías)
- [🗂️ Soft Delete y Archivado](#️-soft-delete-y-archivado)
- [📱 Ejemplos con JavaScript/Fetch](#-ejemplos-con-javascriptfetch)
- [🔍 Códigos de Estado HTTP](#-códigos-de-estado-http)

---

## 🔐 Autenticación

### JWT Token
La API utiliza JWT (JSON Web Tokens) para autenticación. Una vez obtenido el token en `/auth/login`, debe incluirse en todas las peticiones protegidas:

```http
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### Flujo de Autenticación
1. **Registro**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login` → Devuelve token
3. **Usar token**: Incluir en header `Authorization`
4. **Verificar sesión**: `GET /api/v1/auth/me`

---

## 📊 Estructura de Respuestas

### Respuesta Exitosa
```json
{
  "type": "success", 
  "message": "Mensaje descriptivo",
  "data": { /* datos solicitados */ }
}
```

### Respuesta de Error  
```json
{
  "type": "error",
  "message": "Descripción del error"
}
```

### Respuesta con Paginación
```json
{
  "success": true,
  "data": [ /* array de elementos */ ],
  "pagination": {
    "page": 1,
    "per_page": 10, 
    "total": 50,
    "pages": 5
  }
}
```

---

## 👤 Endpoints de Usuario

### 📝 Registro de Usuario
```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Campos requeridos:**
```json
{
  "email": "usuario@email.com",           // ✅ Requerido - Email válido
  "password": "contraseña123",            // ✅ Requerido - Mín 8 caracteres
  "full_name": "Juan Pérez",              // ❌ Opcional - Solo letras y espacios
  "username": "juanperez123",             // ❌ Opcional - Mín 5 chars, solo a-z, 0-9, _
  "birth_date": "1990-05-15",             // ❌ Opcional - Formato YYYY-MM-DD
  "gener": "M",                           // ❌ Opcional - "M" o "F"
  "rol": "user"                           // ❌ Opcional - "user" o "admin" (def: user)
}
```

**Respuesta exitosa (201):**
```json
{
  "type": "success",
  "message": "Usuario registrado exitosamente", 
  "data": {
    "user": {
      "id": "abc123",
      "username": "juanperez123",
      "email": "usuario@email.com",
      "full_name": "Juan Pérez",
      "rol": "user"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..." // 🔑 Token JWT
  }
}
```

### 🔑 Iniciar Sesión
```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Campos requeridos:**
```json
{
  "email": "usuario@email.com",     // ✅ Requerido
  "password": "contraseña123"       // ✅ Requerido  
}
```

### 👤 Obtener Usuario Actual
```http
GET /api/v1/auth/me
Authorization: Bearer TOKEN
```

### 🚪 Cerrar Sesión
```http
POST /api/v1/auth/logout
```

---

## 🎉 Endpoints de Eventos

### 📋 Estructura del Objeto Evento
```typescript
interface Evento {
  id?: string;                              // Auto-generado
  user_id: string;                          // Auto-asignado del token
  title: string;                            // ✅ Requerido
  description?: string;                     // ❌ Opcional  
  date: string;                             // ✅ Requerido - "YYYY-MM-DD"
  time?: string;                            // ❌ Opcional - "HH:MM"
  country?: string;                         // ❌ Opcional
  city?: string;                            // ❌ Opcional
  category_id?: string;                     // ❌ Opcional - ID de categoría
  subcategory_id?: string;                  // ❌ Opcional
  hashtags?: string[];                      // ❌ Opcional - Array de strings
  calendar?: string;                        // ❌ Opcional - "YYYY-MM-DDTHH:MM:SS"
  image_url?: string;                       // ❌ Opcional - URL de imagen
  link?: string;                            // ❌ Opcional - URL del evento
  visibility: "public" | "private" | "only_me";  // ✅ Requerido
  status?: "active" | "archived" | "deleted";    // ❌ Opcional (def: "active")
}
```

### 🌍 Endpoints Públicos (Sin Autenticación)

#### 📜 Obtener Todos los Eventos
```http
GET /api/v1/events/?page=1&per_page=10&include_archived=false&visibility=public
```

**Parámetros opcionales:**
- `page`: Número de página (def: 1)
- `per_page`: Elementos por página (def: 10, max: 100)
- `include_archived`: Incluir archivados (def: false) 
- `visibility`: Filtrar por visibilidad (`public`, `private`, `only_me`)

#### 🔍 Obtener Evento Específico
```http
GET /api/v1/events/{event_id}
```

#### 🔎 Buscar Eventos
```http
GET /api/v1/events/search?q=madrid+tech
```

#### 🏷️ Eventos por Filtros Geográficos
```http
GET /api/v1/events/city/{city}           # Por ciudad
GET /api/v1/events/country/{country}     # Por país  
GET /api/v1/events/category/{category_id} # Por categoría
```

### 🔐 Endpoints Protegidos (Requieren Autenticación)

#### ➕ Crear Evento
```http
POST /api/v1/events/
Authorization: Bearer TOKEN
Content-Type: application/json
```

**Ejemplo de datos (solo campos requeridos):**
```json
{
  "title": "Conferencia Tech Madrid 2025",
  "date": "2025-08-15", 
  "visibility": "public"
}
```

**Ejemplo completo con campos opcionales:**
```json
{
  "title": "Conferencia Tech Madrid 2025",
  "description": "La mayor conferencia de tecnología de España",
  "date": "2025-08-15", 
  "time": "09:00",
  "country": "España",
  "city": "Madrid",
  "category_id": "1",
  "subcategory_id": "1",
  "hashtags": ["tech", "conferencia", "madrid"],
  "calendar": "2025-08-15T09:00:00",
  "image_url": "https://example.com/evento.jpg",
  "link": "https://tech-madrid.com",
  "visibility": "public"
}
```

#### ✏️ Actualizar Evento (Solo Propietario)
```http
PUT /api/v1/events/{event_id}
Authorization: Bearer TOKEN
Content-Type: application/json
```

#### 🗑️ Eliminar Evento (Solo Propietario) 
```http
DELETE /api/v1/events/{event_id}
Authorization: Bearer TOKEN
```
> **Nota**: Esto es un "soft delete" - el evento se marca como eliminado pero no se borra físicamente.

#### 📋 Mis Eventos
```http
GET /api/v1/events/my-events
Authorization: Bearer TOKEN
```

---

## ⭐ Sistema de Favoritos

### ➕ Agregar a Favoritos
```http
POST /api/v1/events/favorites
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "event_id": "evento123"
}
```

### 📋 Obtener Mis Favoritos
```http
GET /api/v1/events/favorites
Authorization: Bearer TOKEN
```

### ❌ Quitar de Favoritos
```http
DELETE /api/v1/events/favorites/{event_id}
Authorization: Bearer TOKEN
```

---

## 📂 Gestión de Categorías

### 📜 Obtener Todas las Categorías
```http
GET /api/v1/events/categories
```

### 🔍 Obtener Categoría Específica
```http
GET /api/v1/events/categories/{category_id}
```

### ➕ Crear Categoría
```http
POST /api/v1/events/categories
Authorization: Bearer TOKEN  
Content-Type: application/json

{
  "name": "Deportes",
  "parent_id": null  // null para categoría principal
}
```

---

## 🗂️ Soft Delete y Archivado

La API implementa un sistema de "soft delete" donde los eventos no se eliminan físicamente:

### 📊 Estados de Evento
- **`active`**: Visible normalmente ✅
- **`archived`**: Oculto pero recuperable 📦  
- **`deleted`**: Oculto, solo visible para el propietario 🗑️

### 🏛️ Archivar Evento
```http
PUT /api/v1/events/{event_id}/archive
Authorization: Bearer TOKEN
```

### 📤 Restaurar Evento Archivado
```http
PUT /api/v1/events/{event_id}/restore
Authorization: Bearer TOKEN
```

### 📋 Ver Eventos Archivados
```http
GET /api/v1/events/archived
Authorization: Bearer TOKEN
```

### 📋 Ver Eventos Eliminados (Soft Delete)
```http
GET /api/v1/events/deleted
Authorization: Bearer TOKEN
```

### 💥 Eliminar Permanentemente (PELIGROSO)
```http
DELETE /api/v1/events/{event_id}/hard-delete
Authorization: Bearer TOKEN
```
> ⚠️ **CUIDADO**: Esta acción es irreversible y elimina también todos los favoritos relacionados.

---

## 📱 Ejemplos con JavaScript/Fetch

### 🔐 Sistema de Autenticación

```javascript
// Variables globales para manejo de token
let currentUserToken = null;
let currentUser = null;

const API_BASE_URL = 'http://localhost:5000';

// Interfaz de Usuario (TypeScript)
interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  rol: 'user' | 'admin';
}

// Interfaz de Evento (TypeScript)
interface Evento {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  country?: string;
  city?: string;
  category_id?: string;
  subcategory_id?: string;
  hashtags?: string[];
  calendar?: string;
  image_url?: string;
  link?: string;
  visibility: 'public' | 'private' | 'only_me';
  status?: 'active' | 'archived' | 'deleted';
}
```

#### 📝 Registro de Usuario
```javascript
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    
    if (response.ok) {
      // Guardar token y usuario
      currentUserToken = result.data.token;
      currentUser = result.data.user;
      
      // Opcional: Guardar en localStorage
      localStorage.setItem('auth_token', currentUserToken);
      localStorage.setItem('current_user', JSON.stringify(currentUser));
      
      console.log('✅ Usuario registrado:', result.message);
      return result.data;
    } else {
      console.error('❌ Error en registro:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('❌ Error de red en registro:', error);
    throw error;
  }
}

// Ejemplo de uso
registerUser({
  email: 'juan@ejemplo.com',
  password: 'contraseña123',
  full_name: 'Juan Pérez',
  username: 'juanperez'
}).then(data => {
  console.log('Usuario creado:', data);
}).catch(error => {
  console.error('Error:', error);
});
```

#### 🔑 Inicio de Sesión
```javascript
async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    
    if (response.ok) {
      currentUserToken = result.data.token;
      currentUser = result.data.user;
      
      // Guardar en localStorage
      localStorage.setItem('auth_token', currentUserToken);
      localStorage.setItem('current_user', JSON.stringify(currentUser));
      
      console.log('✅ Login exitoso para:', result.data.user.username);
      return result.data;
    } else {
      console.error('❌ Error en login:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('❌ Error de red en login:', error);
    throw error;
  }
}

// Ejemplo de uso
loginUser('juan@ejemplo.com', 'contraseña123')
  .then(data => {
    console.log('Sesión iniciada:', data);
  })
  .catch(error => {
    console.error('Error en login:', error);
  });
```

#### 🔄 Recuperar Sesión al Cargar la Página
```javascript
function initializeAuth() {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('current_user');
  
  if (token && user) {
    currentUserToken = token;
    currentUser = JSON.parse(user);
    console.log('✅ Sesión recuperada para:', currentUser.username);
  }
}

// Llamar al cargar la página
document.addEventListener('DOMContentLoaded', initializeAuth);
```

### 🎉 Manejo de Eventos

#### 📋 Obtener Todos los Eventos
```javascript
async function getAllEvents(options = {}) {
  try {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.include_archived) params.append('include_archived', 'true');
    if (options.visibility) params.append('visibility', options.visibility);

    const url = `${API_BASE_URL}/api/v1/events/?${params.toString()}`;
    const response = await fetch(url);
    
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Obtenidos ${result.data.length} eventos`);
      return result.data;
    } else {
      throw new Error(result.message || 'Error al obtener eventos');
    }
  } catch (error) {
    console.error('❌ Error al obtener eventos:', error);
    throw error;
  }
}

// Ejemplo de uso
getAllEvents({ 
  page: 1, 
  per_page: 20, 
  visibility: 'public' 
}).then(eventos => {
  console.log('Eventos obtenidos:', eventos);
});
```

#### ➕ Crear Evento
```javascript
async function createEvent(eventData) {
  if (!currentUserToken) {
    throw new Error('Debes iniciar sesión para crear eventos');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUserToken}`
      },
      body: JSON.stringify(eventData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Evento creado:', result.data.title);
      return result.data;
    } else {
      console.error('❌ Error al crear evento:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('❌ Error de red al crear evento:', error);
    throw error;
  }
}

// Ejemplo de uso - Evento mínimo (solo campos requeridos)
const eventoMinimo = {
  title: "Mi Evento",
  date: "2025-12-25",
  visibility: "public"
};

// Ejemplo de uso - Evento completo
const eventoCompleto = {
  title: "Workshop de React",
  description: "Aprende React desde cero",
  date: "2025-08-20",
  time: "10:00",
  country: "España",
  city: "Barcelona",
  category_id: "2",
  subcategory_id: "1",
  hashtags: ["react", "javascript", "frontend"],
  calendar: "2025-08-20T10:00:00",
  image_url: "https://ejemplo.com/react-workshop.jpg",
  link: "https://react-workshop.com",
  visibility: "public"
};

createEvent(eventoCompleto)
  .then(evento => {
    console.log('Evento creado exitosamente:', evento);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### 🔧 Funciones de Utilidad

```javascript
// Función para manejar errores de respuesta HTTP
async function handleApiResponse(response) {
  const result = await response.json();
  
  if (response.ok) {
    return result;
  } else {
    const error = new Error(result.message || `HTTP Error: ${response.status}`);
    error.status = response.status;
    throw error;
  }
}

// Función para cerrar sesión
function logout() {
  currentUserToken = null;
  currentUser = null;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
  console.log('✅ Sesión cerrada');
}
```

---

## 🔍 Códigos de Estado HTTP

| Código | Significado | Cuándo Ocurre |
|--------|-------------|---------------|
| **200** | ✅ OK | Petición exitosa (GET, PUT exitoso) |
| **201** | ✅ Created | Recurso creado exitosamente (POST exitoso) |
| **400** | ❌ Bad Request | Datos inválidos o faltantes |
| **401** | ❌ Unauthorized | Token inválido o faltante |
| **403** | ❌ Forbidden | Sin permisos (ej. intentar editar evento ajeno) |
| **404** | ❌ Not Found | Recurso no encontrado |
| **500** | ❌ Internal Server Error | Error interno del servidor |

### 🚨 Manejo de Errores Comunes

```javascript
// Función para manejar errores específicos
function handleApiError(error) {
  switch (error.status) {
    case 401:
      console.warn('⚠️ Sesión expirada, redirigiendo al login...');
      logout();
      // Redireccionar a login
      window.location.href = '/login';
      break;
      
    case 403:
      console.error('❌ No tienes permisos para esta acción');
      alert('No tienes permisos para realizar esta acción');
      break;
      
    case 404:
      console.error('❌ Recurso no encontrado');
      alert('El elemento que buscas no existe');
      break;
      
    case 400:
      console.error('❌ Datos inválidos:', error.message);
      alert(`Error en los datos: ${error.message}`);
      break;
      
    default:
      console.error('❌ Error desconocido:', error);
      alert('Ocurrió un error inesperado. Inténtalo de nuevo.');
  }
}

// Usar en las funciones
async function safeApiCall(apiFunction) {
  try {
    return await apiFunction();
  } catch (error) {
    handleApiError(error);
    return null;
  }
}
```

---

## 🚀 Iniciar el Servidor

Para que los desarrolladores de frontend puedan usar la API, el servidor debe estar ejecutándose:

```bash
# Desde el directorio backend/
python app.py
```

El servidor estará disponible en: **http://localhost:5000**

### 🔧 Configuración CORS
La API ya tiene configurada CORS para permitir peticiones desde el frontend. Si necesitas configurar dominios específicos, modifica el archivo de configuración correspondiente.

---

## 📞 Soporte y Notas Importantes

### ⚠️ Campos Opcionales vs Requeridos
Según el modelo de datos actualizado, la mayoría de campos son **opcionales** excepto:
- `user_id` (se asigna automáticamente del token)
- `title` (nombre del evento)
- `date` (fecha del evento)
- `visibility` (público, privado, solo yo)

### 📝 Validaciones Especiales
- **Email**: Debe ser un email válido
- **Password**: Mínimo 8 caracteres
- **Username**: Mínimo 5 caracteres, solo a-z, 0-9 y _
- **Full Name**: Solo letras y espacios
- **Date**: Formato YYYY-MM-DD
- **Time**: Formato HH:MM
- **Birth Date**: Formato YYYY-MM-DD
- **Gender**: Solo "M" o "F"

### 🔄 Estados de Evento
- **active**: Evento activo y visible
- **archived**: Evento archivado (oculto pero recuperable)  
- **deleted**: Evento eliminado con soft delete

Si tienes problemas con la API o necesitas ayuda:
1. Revisa los logs del servidor
2. Verifica que los datos enviados coincidan con los esquemas
3. Asegúrate de incluir el token JWT en peticiones protegidas
4. Revisa los códigos de estado HTTP para entender los errores

¡Happy coding! 🎉
