# 🧪 Tests del Backend - Events API

## 📋 Tests Disponibles

### 1. **test_orm_final.py** 
**Test completo del ORM con soft delete**
- ✅ Verificación de creación de registros
- ✅ Validación de IDs (formato hex de 32 caracteres)
- ✅ Relaciones parent_id en categorías
- ✅ Consistencia de tipos (todos los IDs son string)
- ✅ Funcionalidad DEBUG_DB

### 2. **test_api_complete.py**
**Test integral del flujo completo de la API**
- ✅ Registro y login de usuarios
- ✅ Creación y gestión de eventos
- ✅ Sistema de visibilidad (public/private/only_me)
- ✅ Sistema de favoritos completo
- ✅ Validación de permisos entre usuarios
- ✅ Soft delete y gestión de estados

### 3. **test_soft_delete.py**
**Test específico del sistema de soft delete**
- ✅ Soft delete (marcar como eliminado)
- ✅ Archivado y restauración de eventos
- ✅ Hard delete con cascada de favoritos
- ✅ Filtros por estado (activo/archivado/eliminado)
- ✅ Permisos y validaciones de propietario

## 🚀 Ejecutar Tests con Nox

### Comandos principales:

```bash
# Configurar entorno de desarrollo
nox -s dev_setup

# Ejecutar todos los tests
nox -s test_all

# Tests individuales
nox -s test_orm           # Solo ORM
nox -s test_api           # Solo API (requiere servidor)
nox -s test_soft_delete   # Solo soft delete (requiere servidor)

# Herramientas de desarrollo
nox -s lint              # Linting del código
nox -s format            # Formatear código
nox -s clean             # Limpiar archivos temporales

# Utilidades
nox -s start_server      # Iniciar servidor Flask
```

### Flujo recomendado:

1. **Configurar entorno:**
   ```bash
   nox -s dev_setup
   ```

2. **Test ORM (sin servidor):**
   ```bash
   nox -s test_orm
   ```

3. **Test API completos:**
   ```bash
   # Terminal 1: Iniciar servidor
   nox -s start_server
   
   # Terminal 2: Ejecutar tests
   nox -s test_api
   nox -s test_soft_delete
   ```

4. **Test todo junto:**
   ```bash
   nox -s test_all
   # (Te pedirá que inicies el servidor manualmente)
   ```

## 📁 Archivos de Test

```
tests/
├── test_orm_final.py      # ✅ ORM completo
├── test_api_complete.py   # ✅ API completa
└── test_soft_delete.py    # ✅ Soft delete
```

## 🗑️ Tests eliminados:

- ❌ `test_api.py` - Redundante con test_api_complete.py
- ❌ `test_categories.py` - Incluido en test_orm_final.py
- ❌ `test_user_id_relations.py` - Incluido en test_api_complete.py
- ❌ `test_orm_complete.py` - Redundante con test_orm_final.py

## 💡 Notas importantes:

### Tests de ORM:
- No requieren servidor corriendo
- Limpian automáticamente archivos CSV de test
- Verifican formato de IDs y relaciones

### Tests de API:
- **REQUIEREN** servidor Flask corriendo en puerto 5000
- Prueban endpoints reales con HTTP requests
- Verifican autenticación JWT y permisos

### Tests de Soft Delete:
- Requieren servidor corriendo
- Prueban todos los estados: active → archived → deleted → hard delete(delete from DB)
- Verifican cascada de favoritos

## 🔧 Configuración uv venv:

Todos los comandos de nox usan `venv_backend="uv"` para aprovechamiento del entorno virtual de uv.

## 📊 Cobertura esperada:

- ✅ **ORM**: 100% de funcionalidades básicas
- ✅ **API**: Flujo completo de usuario (registro → eventos → favoritos)
- ✅ **Soft Delete**: Todos los estados y transiciones
- ✅ **Autenticación**: JWT, permisos, propietarios
- ✅ **Validaciones**: Tipos, relaciones, consistencia
