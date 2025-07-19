# 🧪 Tests del Backend - Events API

## 📋 Test Unificado Completo

### **test_api.py** 
**Test integral unificado que cubre toda la funcionalidad**

#### ✅ Tests de Infraestructura (1 test)
- Verificación de servidor funcionando

#### ✅ Tests de Autenticación (7 tests)
- Registro completo de usuario con todos los campos
- Registro mínimo con campos requeridos
- Validaciones de registro (email/username duplicado)
- Inicio de sesión exitoso
- Validación de credenciales inválidas
- Obtener usuario actual con token
- Validación de acceso no autorizado

#### ✅ Tests de Eventos (15 tests)
- Creación de evento completo con todos los campos
- Creación de evento mínimo
- Evento con visibilidad 'only_me'
- Validación de autorización en creación
- Obtener todos los eventos públicos
- Filtros y paginación
- Obtener evento específico
- Manejo de evento inexistente
- Actualización por propietario
- Validación de permisos en actualización
- Obtener mis eventos

#### ✅ Tests de Favoritos (5 tests)
- Agregar evento a favoritos
- Validación de favorito duplicado
- Obtener mis favoritos
- Quitar evento de favoritos
- Manejo de favorito inexistente

#### ✅ Tests de Soft Delete (8 tests)
- Archivar evento
- Eventos archivados ocultos en lista pública
- Obtener eventos archivados
- Restaurar evento archivado
- Soft delete de evento
- Obtener eventos eliminados
- Validación de permisos en soft delete
- Hard delete permanente

#### ✅ Tests de Categorías (4 tests)
- Crear categoría principal
- Crear subcategoría
- Obtener todas las categorías
- Obtener categoría específica

#### ✅ Tests de Búsqueda y Filtros (3 tests)
- Búsqueda de eventos por texto
- Filtrar eventos por ciudad
- Filtrar eventos por categoría

#### ✅ Tests de Permisos y Visibilidad (1 test)
- Test completo de permisos de visibilidad

#### ✅ Tests de Validación (1 test)
- Validaciones de campos requeridos en eventos

#### 🧹 Test de Limpieza (1 test)
- Resumen y limpieza final

**Total: 45 tests completos**

## 📊 Resultado de Ejecución Actual
- ✅ **5 tests pasaron** - Funcionalidades básicas funcionando
- ❌ **37 tests fallaron** - Endpoints por implementar o servidor no disponible
## 🚀 Ejecutar Tests con Nox

### Comandos principales:

```bash
# Listar todas las sesiones disponibles
nox --list

# Configurar entorno de desarrollo
nox -s dev_setup

# Test rápido de conectividad (requiere servidor)
nox -s test_quick

# Ejecutar todos los tests (requiere servidor en puerto 5000)
nox -s test_all

# Ejecutar tests con output detallado
nox -s test_api

# Iniciar servidor Flask para testing (en terminal separada)
nox -s start_server

# Herramientas de desarrollo
nox -s lint              # Linting del código
nox -s format            # Formatear código automáticamente
nox -s clean             # Limpiar archivos temporales (__pycache__, .pyc)
```

### Flujo recomendado:

1. **Configurar entorno:**
   ```bash
   nox -s dev_setup
   ```

2. **Verificar conectividad básica:**
   ```bash
   # Terminal 1: Iniciar servidor
   nox -s start_server
   
   # Terminal 2: Test rápido
   nox -s test_quick
   ```

3. **Ejecutar tests completos:**
   ```bash
   # Con servidor corriendo en otra terminal
   nox -s test_api
   ```

4. **Tests sin servidor (para desarrollo):**
   ```bash
   # Solo verifica sintaxis y estructura
   python -m pytest tests/test_api.py --collect-only
   ```

## 📁 Archivos de Test

```
tests/
└── test_api.py           # ✅ Test unificado completo (45 tests)
```

## 🗑️ Archivos consolidados:

- ✅ **test_api.py** - Test unificado que incluye toda la funcionalidad
- ❌ Tests anteriores consolidados en el archivo principal

## 💡 Análisis de Fallos Actuales

### Posibles causas de los 37 tests fallidos:

1. **Servidor no corriendo** (más probable)
   - El servidor Flask debe estar en `http://localhost:5000`
   - Usar `nox -s start_server` en terminal separada

2. **Endpoints no implementados**
   - Algunos endpoints pueden no estar completamente desarrollados
   - Verificar rutas en `routes/` directory

3. **Base de datos no inicializada**
   - Los archivos CSV pueden no existir
   - El ORM puede necesitar inicialización

4. **Dependencias faltantes**
   - JWT, Flask-CORS, u otras librerías
   - Ejecutar `nox -s dev_setup` para instalar

### Debugging paso a paso:

```bash
# 1. Verificar servidor
curl http://localhost:5000/docs

# 2. Test individual más simple
python -c "import requests; print(requests.get('http://localhost:5000/docs').json())"

# 3. Test específico
python -m pytest tests/test_api.py::test_01_server_status -v

# 4. Ver detalles de fallos
nox -s test_api | tee test_results.log
```

## 🔧 Configuración uv venv:

Todos los comandos de nox usan `venv_backend="uv"` para aprovechamiento del entorno virtual de uv.

## 📊 Estado del Proyecto:

### ✅ Completado:
- Test suite completa (45 tests)
- Configuración nox 
- Documentación de API
- Estructura de tests unificada

### 🔄 En proceso:
- Implementación de endpoints faltantes
- Corrección de fallos en tests
- Optimización de la base de datos CSV

### 🎯 Próximos pasos:
1. Identificar qué 5 tests pasan para mantener esa funcionalidad
2. Implementar endpoints faltantes uno por uno
3. Ejecutar tests incrementalmente
4. Documentar endpoints implementados vs pendientes
