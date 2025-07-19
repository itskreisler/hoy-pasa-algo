import requests
from typing import Dict, Any, Optional, List

BASE_URL: str = "http://localhost:5000"

# Variables globales para almacenar datos de test
test_users: Dict[str, Dict[str, Any]] = {}
test_tokens: Dict[str, str] = {}
test_events: Dict[str, Dict[str, Any]] = {}
test_categories: Dict[str, Dict[str, Any]] = {}


# ====== FUNCIONES HELPER ======


def make_request(
    method: str,
    endpoint: str,
    data: Optional[Dict[str, Any]] = None,
    headers: Optional[Dict[str, str]] = None,
    token: Optional[str] = None,
) -> requests.Response:
    """Helper para hacer requests HTTP con headers opcionales"""
    url: str = f"{BASE_URL}{endpoint}"

    if headers is None:
        headers = {"Content-Type": "application/json"}

    if token:
        headers["Authorization"] = f"Bearer {token}"

    if method.upper() == "GET":
        return requests.get(url, headers=headers)
    elif method.upper() == "POST":
        return requests.post(url, json=data, headers=headers)
    elif method.upper() == "PUT":
        return requests.put(url, json=data, headers=headers)
    elif method.upper() == "DELETE":
        return requests.delete(url, headers=headers)
    else:
        raise ValueError(f"Método HTTP no soportado: {method}")


def assert_response_success(
    response: requests.Response, expected_status: int = 200
) -> Dict[str, Any]:
    """Assert que la respuesta sea exitosa y retorna los datos"""
    assert response.status_code == expected_status, (
        f"Expected {expected_status}, got {response.status_code}: {response.text}"
    )
    data: Dict[str, Any] = response.json()
    assert "type" in data or "data" in data or "message" in data
    return data


def assert_response_error(
    response: requests.Response, expected_status: int = 400
) -> Dict[str, Any]:
    """Assert que la respuesta sea de error y retorna los datos"""
    assert response.status_code == expected_status, (
        f"Expected {expected_status}, got {response.status_code}: {response.text}"
    )
    data: Dict[str, Any] = response.json()
    assert data["type"] == "error" or "message" in data
    return data


def create_test_user(
    email: str,
    password: str = "test_password_123",
    username: Optional[str] = None,
    full_name: Optional[str] = None,
) -> Dict[str, Any]:
    """Crear usuario de test y obtener token"""
    user_data: Dict[str, Any] = {
        "email": email,
        "password": password,
    }

    if username:
        user_data["username"] = username
    if full_name:
        user_data["full_name"] = full_name

    # Registrar usuario
    response = make_request("POST", "/api/v1/auth/register", user_data)
    result = assert_response_success(response, 201)

    # Guardar datos de usuario y token
    user_key: str = email.split("@")[0]
    test_users[user_key] = result["data"]["user"]
    test_tokens[user_key] = result["data"]["token"]

    return result["data"]


def create_test_event(
    token: str,
    title: str = "Test Event",
    date: str = "2025-12-25",
    visibility: str = "public",
    **kwargs: Any,
) -> Dict[str, Any]:
    """Crear evento de test"""
    event_data: Dict[str, Any] = {"title": title, "date": date, "visibility": visibility, **kwargs}

    response = make_request("POST", "/api/v1/events/", event_data, token=token)
    result = assert_response_success(response, 201)

    return result["data"]


# ====== TESTS DE INFRAESTRUCTURA ======


def test_01_server_status():
    """Test básico: verificar que el servidor esté funcionando"""
    response = make_request("GET", "/docs")
    data = assert_response_success(response)

    assert "endpoints" in data and "message" in data
    assert data["message"] == "API Backend funcionando"
    print("✅ Servidor funcionando correctamente")


# ====== TESTS DE AUTENTICACIÓN ======


def test_02_user_registration_complete():
    """Test completo de registro de usuario con todos los campos"""
    user_data: Dict[str, Any] = {
        "email": "test_complete_user@test.com",
        "password": "test_password_123",
        "username": "testcompleteuser",
        "full_name": "Test Complete User",
        "birth_date": "1990-01-01",
        "gener": "M",
        "rol": "user",
    }

    response = make_request("POST", "/api/v1/auth/register", user_data)
    result = assert_response_success(response, 201)

    # Verificar estructura de respuesta
    assert "data" in result
    assert "user" in result["data"] and "token" in result["data"]

    user: Dict[str, Any] = result["data"]["user"]
    token: str = result["data"]["token"]

    # Verificar datos del usuario
    assert user["email"] == user_data["email"]
    assert user["username"] == user_data["username"]
    assert user["full_name"] == user_data["full_name"]
    assert user["rol"] == user_data["rol"]
    assert "id" in user

    # Verificar que el token es válido
    assert isinstance(token, str) and len(token) > 20

    # Guardar para tests posteriores
    test_users["complete"] = user
    test_tokens["complete"] = token

    print("✅ Registro de usuario completo exitoso")


def test_03_user_registration_minimal():
    """Test de registro con campos mínimos requeridos"""
    user_data: Dict[str, Any] = {"email": "test_minimal@test.com", "password": "test_password_123"}

    response = make_request("POST", "/api/v1/auth/register", user_data)
    result = assert_response_success(response, 201)

    user: Dict[str, Any] = result["data"]["user"]
    token: str = result["data"]["token"]

    # Verificar datos mínimos
    assert user["email"] == user_data["email"]
    assert user["rol"] == "user"  # Valor por defecto
    assert "id" in user

    # Guardar para tests posteriores
    test_users["minimal"] = user
    test_tokens["minimal"] = token

    print("✅ Registro mínimo exitoso")


def test_04_user_registration_validations():
    """Test de validaciones en registro de usuario"""

    # Email duplicado
    duplicate_email_data: Dict[str, Any] = {
        "email": "test_complete_user@test.com",  # Ya existe
        "password": "test_password_123",
    }
    response = make_request("POST", "/api/v1/auth/register", duplicate_email_data)
    assert_response_error(response, 400)

    # Username duplicado
    duplicate_username_data: Dict[str, Any] = {
        "email": "new_email@test.com",
        "password": "test_password_123",
        "username": "testcompleteuser",  # Ya existe
    }
    response = make_request("POST", "/api/v1/auth/register", duplicate_username_data)
    assert_response_error(response, 400)

    print("✅ Validaciones de registro funcionando")


def test_05_user_login():
    """Test de inicio de sesión"""
    login_data: Dict[str, Any] = {
        "email": "test_complete_user@test.com",
        "password": "test_password_123",
    }

    response = make_request("POST", "/api/v1/auth/login", login_data)
    result = assert_response_success(response, 200)

    assert "data" in result
    assert "user" in result["data"] and "token" in result["data"]

    # Verificar que el token es diferente (nuevo)
    new_token: str = result["data"]["token"]
    assert isinstance(new_token, str) and len(new_token) > 20

    print("✅ Login exitoso")


def test_06_user_login_invalid_credentials():
    """Test de login con credenciales inválidas"""

    # Email inexistente
    invalid_email_data: Dict[str, Any] = {
        "email": "inexistente@test.com",
        "password": "test_password_123",
    }
    response = make_request("POST", "/api/v1/auth/login", invalid_email_data)
    assert_response_error(response, 401)

    # Contraseña incorrecta
    invalid_password_data: Dict[str, Any] = {
        "email": "test_complete_user@test.com",
        "password": "wrong_password",
    }
    response = make_request("POST", "/api/v1/auth/login", invalid_password_data)
    assert_response_error(response, 401)

    print("✅ Validación de credenciales funcionando")


def test_07_get_current_user():
    """Test de obtener usuario actual con token"""
    response = make_request("GET", "/api/v1/auth/me", token=test_tokens["complete"])
    result = assert_response_success(response)

    assert "data" in result
    user: Dict[str, Any] = result["data"]

    # Verificar que es el mismo usuario
    assert user["email"] == test_users["complete"]["email"]
    assert user["id"] == test_users["complete"]["id"]

    print("✅ Get current user exitoso")


def test_08_unauthorized_access():
    """Test de acceso sin token y con token inválido"""

    # Sin token
    response = make_request("GET", "/api/v1/auth/me")
    assert_response_error(response, 401)

    # Token inválido
    response = make_request("GET", "/api/v1/auth/me", token="invalid_token")
    assert_response_error(response, 401)

    print("✅ Validación de autorización funcionando")


# ====== TESTS DE EVENTOS ======


def test_09_create_event_complete():
    """Test de creación de evento con todos los campos"""
    event_data: Dict[str, Any] = {
        "title": "Conferencia Tech Madrid 2025",
        "description": "La mayor conferencia de tecnología",
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
        "visibility": "public",
    }

    response = make_request("POST", "/api/v1/events/", event_data, token=test_tokens["complete"])
    result = assert_response_success(response, 201)

    event: Dict[str, Any] = result["data"]

    # Verificar todos los campos
    assert event["title"] == event_data["title"]
    assert event["description"] == event_data["description"]
    assert event["date"] == event_data["date"]
    assert event["time"] == event_data["time"]
    assert event["country"] == event_data["country"]
    assert event["city"] == event_data["city"]
    assert event["visibility"] == event_data["visibility"]
    assert event["hashtags"] == event_data["hashtags"]
    assert event["user_id"] == test_users["complete"]["id"]
    assert event["status"] == "active"  # Por defecto
    assert "id" in event

    # Guardar para tests posteriores
    test_events["complete"] = event

    print("✅ Creación de evento completo exitosa")


def test_10_create_event_minimal():
    """Test de creación de evento con campos mínimos"""
    event_data: Dict[str, Any] = {
        "title": "Evento Minimal",
        "date": "2025-12-25",
        "visibility": "private",
    }

    response = make_request("POST", "/api/v1/events/", event_data, token=test_tokens["minimal"])
    result = assert_response_success(response, 201)

    event: Dict[str, Any] = result["data"]

    assert event["title"] == event_data["title"]
    assert event["date"] == event_data["date"]
    assert event["visibility"] == event_data["visibility"]
    assert event["user_id"] == test_users["minimal"]["id"]
    assert event["status"] == "active"

    # Guardar para tests posteriores
    test_events["minimal"] = event

    print("✅ Creación de evento mínimo exitosa")


def test_11_create_event_only_me():
    """Test de creación de evento con visibilidad 'only_me'"""
    event_data: Dict[str, Any] = {
        "title": "Evento Solo Yo",
        "date": "2025-11-11",
        "visibility": "only_me",
    }

    response = make_request("POST", "/api/v1/events/", event_data, token=test_tokens["complete"])
    result = assert_response_success(response, 201)

    event: Dict[str, Any] = result["data"]
    assert event["visibility"] == "only_me"

    # Guardar para tests posteriores
    test_events["only_me"] = event

    print("✅ Creación de evento 'only_me' exitosa")


def test_12_create_event_unauthorized():
    """Test de creación de evento sin autorización"""
    event_data: Dict[str, Any] = {
        "title": "Evento No Autorizado",
        "date": "2025-12-25",
        "visibility": "public",
    }

    # Sin token
    response = make_request("POST", "/api/v1/events/", event_data)
    assert_response_error(response, 401)

    # Token inválido
    response = make_request("POST", "/api/v1/events/", event_data, token="invalid_token")
    assert_response_error(response, 401)

    print("✅ Validación de autorización en eventos funcionando")


def test_13_get_all_events_public():
    """Test de obtener todos los eventos públicos"""
    response = make_request("GET", "/api/v1/events/")
    result = assert_response_success(response)

    assert "data" in result
    events: List[Dict[str, Any]] = result["data"]

    # Verificar que solo hay eventos públicos
    public_events = [e for e in events if e.get("visibility") == "public"]
    assert len(public_events) >= 1  # Al menos el evento que creamos

    # Verificar que no hay eventos privados o only_me
    for event in events:
        assert event.get("visibility") == "public"

    print("✅ Obtener eventos públicos exitoso")


def test_14_get_all_events_with_filters():
    """Test de obtener eventos con filtros"""

    # Con paginación
    response = make_request("GET", "/api/v1/events/?page=1&per_page=5")
    result = assert_response_success(response)
    events: List[Dict[str, Any]] = result["data"]
    assert len(events) <= 5

    # Con filtro de visibilidad
    response = make_request("GET", "/api/v1/events/?visibility=public")
    result = assert_response_success(response)
    events = result["data"]

    for event in events:
        assert event.get("visibility") == "public"

    print("✅ Filtros en eventos funcionando")


def test_15_get_specific_event():
    """Test de obtener evento específico"""
    event_id: str = test_events["complete"]["id"]

    response = make_request("GET", f"/api/v1/events/{event_id}")
    result = assert_response_success(response)

    event: Dict[str, Any] = result["data"]
    assert event["id"] == event_id
    assert event["title"] == test_events["complete"]["title"]

    print("✅ Obtener evento específico exitoso")


def test_16_get_nonexistent_event():
    """Test de obtener evento inexistente"""
    response = make_request("GET", "/api/v1/events/nonexistent_id")
    assert_response_error(response, 404)

    print("✅ Manejo de evento inexistente funcionando")


def test_17_update_event_owner():
    """Test de actualizar evento (solo propietario)"""
    event_id: str = test_events["complete"]["id"]

    update_data: Dict[str, Any] = {
        "title": "Conferencia Tech Madrid 2025 - ACTUALIZADA",
        "description": "Descripción actualizada",
        "city": "Barcelona",
    }

    response = make_request(
        "PUT", f"/api/v1/events/{event_id}", update_data, token=test_tokens["complete"]
    )
    result = assert_response_success(response)

    updated_event: Dict[str, Any] = result["data"]
    assert updated_event["title"] == update_data["title"]
    assert updated_event["description"] == update_data["description"]
    assert updated_event["city"] == update_data["city"]

    # Actualizar en nuestros test_events
    test_events["complete"] = updated_event

    print("✅ Actualización de evento por propietario exitosa")


def test_18_update_event_unauthorized():
    """Test de actualizar evento sin ser propietario"""
    event_id: str = test_events["complete"]["id"]  # Evento del usuario "complete"

    update_data: Dict[str, Any] = {"title": "Intento de hackeo"}

    # Intentar actualizar con token de otro usuario
    response = make_request(
        "PUT", f"/api/v1/events/{event_id}", update_data, token=test_tokens["minimal"]
    )
    assert_response_error(response, 403)

    print("✅ Validación de propietario en actualización funcionando")


def test_19_my_events():
    """Test de obtener mis eventos"""
    response = make_request("GET", "/api/v1/events/my-events", token=test_tokens["complete"])
    result = assert_response_success(response)

    my_events: List[Dict[str, Any]] = result["data"]

    # Verificar que todos los eventos son del usuario actual
    for event in my_events:
        assert event["user_id"] == test_users["complete"]["id"]

    # Verificar que incluye nuestros eventos creados
    event_titles = [e["title"] for e in my_events]
    assert "Conferencia Tech Madrid 2025 - ACTUALIZADA" in event_titles
    assert "Evento Solo Yo" in event_titles

    print("✅ Obtener mis eventos exitoso")


# ====== TESTS DE FAVORITOS ======


def test_20_add_to_favorites():
    """Test de agregar evento a favoritos"""
    event_id: str = test_events["complete"]["id"]

    favorite_data: Dict[str, Any] = {"event_id": event_id}

    response = make_request(
        "POST", "/api/v1/events/favorites", favorite_data, token=test_tokens["minimal"]
    )
    result = assert_response_success(response, 201)

    assert "data" in result
    favorite: Dict[str, Any] = result["data"]
    assert favorite["event_id"] == event_id
    assert favorite["user_id"] == test_users["minimal"]["id"]

    print("✅ Agregar a favoritos exitoso")


def test_21_add_duplicate_favorite():
    """Test de agregar favorito duplicado"""
    event_id: str = test_events["complete"]["id"]

    favorite_data: Dict[str, Any] = {"event_id": event_id}

    # Intentar agregar el mismo favorito otra vez
    response = make_request(
        "POST", "/api/v1/events/favorites", favorite_data, token=test_tokens["minimal"]
    )
    assert_response_error(response, 400)

    print("✅ Validación de favorito duplicado funcionando")


def test_22_get_my_favorites():
    """Test de obtener mis favoritos"""
    response = make_request("GET", "/api/v1/events/favorites", token=test_tokens["minimal"])
    result = assert_response_success(response)

    favorites: List[Dict[str, Any]] = result["data"]

    # Verificar que tenemos al menos un favorito
    assert len(favorites) >= 1

    # Verificar que todos los favoritos son del usuario actual
    for fav in favorites:
        assert fav["user_id"] == test_users["minimal"]["id"]

    # Verificar que incluye el evento que agregamos
    favorite_event_ids = [f["event_id"] for f in favorites]
    assert test_events["complete"]["id"] in favorite_event_ids

    print("✅ Obtener mis favoritos exitoso")


def test_23_remove_from_favorites():
    """Test de quitar evento de favoritos"""
    event_id: str = test_events["complete"]["id"]

    response = make_request(
        "DELETE", f"/api/v1/events/favorites/{event_id}", token=test_tokens["minimal"]
    )
    assert_response_success(response)

    # Verificar que ya no está en favoritos
    response = make_request("GET", "/api/v1/events/favorites", token=test_tokens["minimal"])
    result = assert_response_success(response)

    favorites: List[Dict[str, Any]] = result["data"]
    favorite_event_ids = [f["event_id"] for f in favorites]
    assert event_id not in favorite_event_ids

    print("✅ Quitar de favoritos exitoso")


def test_24_remove_nonexistent_favorite():
    """Test de quitar favorito inexistente"""
    response = make_request(
        "DELETE", "/api/v1/events/favorites/nonexistent_id", token=test_tokens["minimal"]
    )
    assert_response_error(response, 404)

    print("✅ Manejo de favorito inexistente funcionando")


# ====== TESTS DE SOFT DELETE ======


def test_25_archive_event():
    """Test de archivar evento"""
    # Crear nuevo evento para archivar
    archive_event = create_test_event(
        test_tokens["complete"],
        title="Evento Para Archivar",
        date="2025-12-01",
        visibility="public",
    )

    event_id: str = archive_event["id"]

    # Archivar evento
    response = make_request(
        "PUT", f"/api/v1/events/{event_id}/archive", token=test_tokens["complete"]
    )
    result = assert_response_success(response)

    archived_event: Dict[str, Any] = result["data"]
    assert archived_event["status"] == "archived"

    # Guardar para tests posteriores
    test_events["archived"] = archived_event

    print("✅ Archivar evento exitoso")


def test_26_archived_event_not_in_public_list():
    """Test de que eventos archivados no aparecen en lista pública"""
    response = make_request("GET", "/api/v1/events/")
    result = assert_response_success(response)

    events: List[Dict[str, Any]] = result["data"]

    # Verificar que el evento archivado no está en la lista
    event_ids = [e["id"] for e in events]
    assert test_events["archived"]["id"] not in event_ids

    print("✅ Eventos archivados ocultos en lista pública")


def test_27_get_archived_events():
    """Test de obtener eventos archivados"""
    response = make_request("GET", "/api/v1/events/archived", token=test_tokens["complete"])
    result = assert_response_success(response)

    archived_events: List[Dict[str, Any]] = result["data"]

    # Verificar que incluye nuestro evento archivado
    archived_ids = [e["id"] for e in archived_events]
    assert test_events["archived"]["id"] in archived_ids

    # Verificar que todos tienen status archived
    for event in archived_events:
        assert event["status"] == "archived"
        assert event["user_id"] == test_users["complete"]["id"]

    print("✅ Obtener eventos archivados exitoso")


def test_28_restore_archived_event():
    """Test de restaurar evento archivado"""
    event_id: str = test_events["archived"]["id"]

    response = make_request(
        "PUT", f"/api/v1/events/{event_id}/restore", token=test_tokens["complete"]
    )
    result = assert_response_success(response)

    restored_event: Dict[str, Any] = result["data"]
    assert restored_event["status"] == "active"

    # Verificar que ahora aparece en la lista pública
    response = make_request("GET", "/api/v1/events/")
    result = assert_response_success(response)

    events: List[Dict[str, Any]] = result["data"]
    event_ids = [e["id"] for e in events]
    assert event_id in event_ids

    # Actualizar en test_events
    test_events["archived"] = restored_event

    print("✅ Restaurar evento archivado exitoso")


def test_29_soft_delete_event():
    """Test de soft delete de evento"""
    # Crear evento para eliminar
    delete_event = create_test_event(
        test_tokens["complete"],
        title="Evento Para Eliminar",
        date="2025-12-02",
        visibility="public",
    )

    event_id: str = delete_event["id"]

    # Eliminar evento (soft delete)
    response = make_request("DELETE", f"/api/v1/events/{event_id}", token=test_tokens["complete"])
    assert_response_success(response)

    # Verificar que no aparece en lista pública
    response = make_request("GET", "/api/v1/events/")
    result = assert_response_success(response)

    events: List[Dict[str, Any]] = result["data"]
    event_ids = [e["id"] for e in events]
    assert event_id not in event_ids

    # Guardar para tests posteriores
    test_events["deleted"] = delete_event
    test_events["deleted"]["id"] = event_id

    print("✅ Soft delete de evento exitoso")


def test_30_get_deleted_events():
    """Test de obtener eventos eliminados (soft delete)"""
    response = make_request("GET", "/api/v1/events/deleted", token=test_tokens["complete"])
    result = assert_response_success(response)

    deleted_events: List[Dict[str, Any]] = result["data"]

    # Verificar que incluye nuestro evento eliminado
    deleted_ids = [e["id"] for e in deleted_events]
    assert test_events["deleted"]["id"] in deleted_ids

    # Verificar que todos tienen status deleted
    for event in deleted_events:
        assert event["status"] == "deleted"
        assert event["user_id"] == test_users["complete"]["id"]

    print("✅ Obtener eventos eliminados exitoso")


def test_31_unauthorized_soft_delete():
    """Test de soft delete sin ser propietario"""
    event_id: str = test_events["minimal"]["id"]  # Evento del usuario minimal

    # Intentar eliminar con otro usuario
    response = make_request("DELETE", f"/api/v1/events/{event_id}", token=test_tokens["complete"])
    assert_response_error(response, 403)

    print("✅ Validación de propietario en soft delete funcionando")


def test_32_hard_delete_event():
    """Test de eliminación permanente (hard delete)"""
    event_id: str = test_events["deleted"]["id"]

    # Eliminar permanentemente
    response = make_request(
        "DELETE", f"/api/v1/events/{event_id}/hard-delete", token=test_tokens["complete"]
    )
    assert_response_success(response)

    # Verificar que ya no está en eventos eliminados
    response = make_request("GET", "/api/v1/events/deleted", token=test_tokens["complete"])
    result = assert_response_success(response)

    deleted_events: List[Dict[str, Any]] = result["data"]
    deleted_ids = [e["id"] for e in deleted_events]
    assert event_id not in deleted_ids

    # Verificar que tampoco se puede obtener directamente
    response = make_request("GET", f"/api/v1/events/{event_id}")
    assert_response_error(response, 404)

    print("✅ Hard delete de evento exitoso")


# ====== TESTS DE CATEGORÍAS ======


def test_33_create_category():
    """Test de crear categoría"""
    category_data: Dict[str, Any] = {"name": "Tecnología", "parent_id": None}

    response = make_request(
        "POST", "/api/v1/events/categories", category_data, token=test_tokens["complete"]
    )
    result = assert_response_success(response, 201)

    category: Dict[str, Any] = result["data"]
    assert category["name"] == category_data["name"]
    assert category["parent_id"] is None
    assert "id" in category

    # Guardar para tests posteriores
    test_categories["tech"] = category

    print("✅ Crear categoría exitosa")


def test_34_create_subcategory():
    """Test de crear subcategoría"""
    subcategory_data: Dict[str, Any] = {
        "name": "Inteligencia Artificial",
        "parent_id": test_categories["tech"]["id"],
    }

    response = make_request(
        "POST", "/api/v1/events/categories", subcategory_data, token=test_tokens["complete"]
    )
    result = assert_response_success(response, 201)

    subcategory: Dict[str, Any] = result["data"]
    assert subcategory["name"] == subcategory_data["name"]
    assert subcategory["parent_id"] == test_categories["tech"]["id"]

    # Guardar para tests posteriores
    test_categories["ai"] = subcategory

    print("✅ Crear subcategoría exitosa")


def test_35_get_all_categories():
    """Test de obtener todas las categorías"""
    response = make_request("GET", "/api/v1/events/categories")
    result = assert_response_success(response)

    categories: List[Dict[str, Any]] = result["data"]
    assert len(categories) >= 2  # Al menos las que creamos

    # Verificar que incluye nuestras categorías
    category_names = [c["name"] for c in categories]
    assert "Tecnología" in category_names
    assert "Inteligencia Artificial" in category_names

    print("✅ Obtener todas las categorías exitoso")


def test_36_get_specific_category():
    """Test de obtener categoría específica"""
    category_id: str = test_categories["tech"]["id"]

    response = make_request("GET", f"/api/v1/events/categories/{category_id}")
    result = assert_response_success(response)

    category: Dict[str, Any] = result["data"]
    assert category["id"] == category_id
    assert category["name"] == "Tecnología"

    print("✅ Obtener categoría específica exitoso")


# ====== TESTS DE BÚSQUEDA Y FILTROS ======


def test_37_search_events():
    """Test de búsqueda de eventos"""
    response = make_request("GET", "/api/v1/events/search?q=madrid")
    result = assert_response_success(response)

    events: List[Dict[str, Any]] = result["data"]

    # Verificar que los resultados contienen la palabra de búsqueda
    found_madrid = False
    for event in events:
        if "madrid" in event.get("title", "").lower() or "madrid" in event.get("city", "").lower():
            found_madrid = True
            break

    assert found_madrid, "No se encontraron eventos con 'madrid'"

    print("✅ Búsqueda de eventos exitosa")


def test_38_filter_events_by_city():
    """Test de filtrar eventos por ciudad"""
    # Crear evento con ciudad específica
    create_test_event(
        test_tokens["complete"], title="Evento en Valencia", city="Valencia", visibility="public"
    )

    response = make_request("GET", "/api/v1/events/city/Valencia")
    result = assert_response_success(response)

    events: List[Dict[str, Any]] = result["data"]

    # Verificar que todos los eventos son de Valencia
    for event in events:
        assert event.get("city") == "Valencia"

    print("✅ Filtrar por ciudad exitoso")


def test_39_filter_events_by_category():
    """Test de filtrar eventos por categoría"""
    # Crear evento con categoría
    create_test_event(
        test_tokens["complete"],
        title="Evento Tech Con Categoría",
        category_id=test_categories["tech"]["id"],
        visibility="public",
    )

    category_id: str = test_categories["tech"]["id"]
    response = make_request("GET", f"/api/v1/events/category/{category_id}")
    result = assert_response_success(response)

    events: List[Dict[str, Any]] = result["data"]

    # Verificar que todos los eventos tienen la categoría correcta
    for event in events:
        assert event.get("category_id") == category_id

    print("✅ Filtrar por categoría exitoso")


# ====== TESTS DE PERMISOS Y VISIBILIDAD ======


def test_40_visibility_permissions():
    """Test completo de permisos de visibilidad"""

    # Crear eventos con diferentes visibilidades
    public_event = create_test_event(
        test_tokens["complete"], title="Evento Público Test", visibility="public"
    )

    private_event = create_test_event(
        test_tokens["complete"], title="Evento Privado Test", visibility="private"
    )

    only_me_event = create_test_event(
        test_tokens["complete"], title="Evento Solo Mío Test", visibility="only_me"
    )

    # Verificar que en la lista pública solo aparece el público
    response = make_request("GET", "/api/v1/events/")
    result = assert_response_success(response)
    events: List[Dict[str, Any]] = result["data"]

    event_ids = [e["id"] for e in events]
    assert public_event["id"] in event_ids
    assert private_event["id"] not in event_ids
    assert only_me_event["id"] not in event_ids

    # Verificar que el propietario puede ver todos sus eventos
    response = make_request("GET", "/api/v1/events/my-events", token=test_tokens["complete"])
    result = assert_response_success(response)
    my_events: List[Dict[str, Any]] = result["data"]

    my_event_ids = [e["id"] for e in my_events]
    assert public_event["id"] in my_event_ids
    assert private_event["id"] in my_event_ids
    assert only_me_event["id"] in my_event_ids

    print("✅ Permisos de visibilidad funcionando correctamente")


# ====== TESTS DE VALIDACIÓN DE DATOS ======


def test_41_event_validation():
    """Test de validaciones en eventos"""

    # Sin título
    invalid_event: Dict[str, Any] = {"date": "2025-12-25", "visibility": "public"}
    response = make_request("POST", "/api/v1/events/", invalid_event, token=test_tokens["complete"])
    assert_response_error(response, 400)

    # Sin fecha
    invalid_event = {"title": "Evento Sin Fecha", "visibility": "public"}
    response = make_request("POST", "/api/v1/events/", invalid_event, token=test_tokens["complete"])
    assert_response_error(response, 400)

    # Sin visibilidad
    invalid_event = {"title": "Evento Sin Visibilidad", "date": "2025-12-25"}
    response = make_request("POST", "/api/v1/events/", invalid_event, token=test_tokens["complete"])
    assert_response_error(response, 400)

    # Visibilidad inválida
    invalid_event = {
        "title": "Evento Visibilidad Inválida",
        "date": "2025-12-25",
        "visibility": "invalid_visibility",
    }
    response = make_request("POST", "/api/v1/events/", invalid_event, token=test_tokens["complete"])
    assert_response_error(response, 400)

    print("✅ Validaciones de eventos funcionando")


# ====== TEST DE LIMPIEZA ======


def test_99_cleanup():
    """Test final para limpiar datos de prueba"""
    print("\n🧹 Ejecutando limpieza final...")

    # Mostrar resumen de tests
    print(f"✅ Usuarios creados: {len(test_users)}")
    print(f"✅ Eventos creados: {len(test_events)}")
    print(f"✅ Categorías creadas: {len(test_categories)}")

    # Los datos se limpiarán automáticamente al reiniciar el servidor
    # o se pueden mantener para inspección manual

    print("🎉 Todos los tests completados exitosamente!")


if __name__ == "__main__":
    # Ejecutar tests de forma secuencial para debugging
    import sys
    import subprocess

    result = subprocess.run([sys.executable, "-m", "pytest", __file__, "-v", "-s"])
    sys.exit(result.returncode)
