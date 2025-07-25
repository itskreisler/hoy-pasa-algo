# 🧪 Pruebas del Backend con Pytest y Nox

Este documento describe cómo ejecutar y gestionar la suite de pruebas para la API del backend.

## 🚀 Herramientas Utilizadas

- **Pytest**: El framework principal para escribir y ejecutar las pruebas.
- **Nox**: Una herramienta de automatización que gestiona entornos y comandos de prueba en un `noxfile.py`.

## ✅ Cobertura de las Pruebas

La suite de pruebas está diseñada para cubrir todas las funcionalidades críticas de la API, incluyendo:

- **Autenticación**: Registro, inicio de sesión, validación de tokens y protección de rutas.
- **CRUD de Eventos**: Creación, lectura, actualización y eliminación de eventos, incluyendo validaciones de permisos.
- **Visibilidad de Eventos**: Pruebas para asegurar que los eventos `public`, `private` y `only_me` se muestren correctamente según el estado de autenticación del usuario.
- **Favoritos**: Añadir, ver y eliminar eventos favoritos.
- **Soft Deletes y Archiving**: Pruebas para el archivado y restauración de eventos.
- **Búsqueda y Filtrado**: Verificación de que los filtros por texto, ciudad y categoría funcionen como se espera.
- **Validación de Datos**: Pruebas para los campos requeridos y formatos de datos correctos.

El archivo principal de pruebas es `tests/test_api.py`, que contiene una suite de integración completa.

## 🚀 Cómo Ejecutar las Pruebas

### Opción 1: Usando Nox (Recomendado)

Nox automatiza la creación del entorno y la ejecución de los comandos.

1.  **Abre una terminal** en la carpeta `backend`.
2.  **Inicia el servidor de desarrollo** en esa terminal. Esto es crucial, ya que las pruebas de integración hacen peticiones HTTP reales a la API.
    ```bash
    nox -s start_server
    ```
3.  **Abre una segunda terminal** en la misma carpeta (`backend`).
4.  **Ejecuta la suite de pruebas completa:**
    ```bash
    nox -s test_api
    ```
    Este comando le dirá a Nox que ejecute la sesión `test_api` definida en `noxfile.py`.

### Opción 2: Usando Pytest Directamente

Si prefieres no usar Nox, puedes ejecutar Pytest directamente.

1.  **Asegúrate de que el servidor esté corriendo** (`uv run flask --app app run --debug`).
2.  **Asegúrate de tener las dependencias instaladas** (`uv sync`).
3.  **Ejecuta Pytest:**
    ```bash
    uv run pytest -v
    ```
    El flag `-v` proporciona una salida más detallada.

## 📂 Flujo de Trabajo para Desarrollo y Pruebas

1.  **Desarrolla una nueva funcionalidad** en un endpoint (por ejemplo, en `routes/events.py`).
2.  **Escribe una o más pruebas** para esa funcionalidad en `tests/test_api.py`. Intenta cubrir tanto los casos de éxito como los de error.
3.  **Ejecuta las pruebas** usando `nox -s test_api` o `uv run pytest` para asegurarte de que tu nueva funcionalidad pasa las pruebas y no ha roto nada existente (regresiones).
4.  **Repite** hasta que todas las pruebas pasen.

## 🧹 Otras Tareas con Nox

Nox también puede ayudarte con otras tareas de calidad de código:

- **Linting**:
  ```bash
  nox -s lint
  ```
- **Formateo de código**:
  ```bash
  nox -s format
  ```
- **Limpieza de archivos temporales**:
  ```bash
  nox -s clean
  ```

Para ver todas las sesiones disponibles, ejecuta: `nox --list`.
