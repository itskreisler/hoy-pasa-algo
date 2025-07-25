import unittest
import json
from factory import create_app
from db.ORMcsv import orm
from libs.helpers import ResponseType
import os

class EventsFlowTest(unittest.TestCase):
    def setUp(self):
        os.environ["FLASK_ENV"] = "development"
        self.app = create_app("development")
        self.client = self.app.test_client()

        # Limpiar y preparar BBDD
        for model_name in ["usuario", "event", "favorite", "category"]:
            if model_name in orm.models:
                model = orm.get_model(model_name)
                if os.path.exists(model.full_path):
                    os.remove(model.full_path)
                model._ensure_file()

        # Crear un usuario y obtener token
        self.user_data = {"email": "test@test.com", "password": "password"}
        reg_resp = self.client.post("/api/v1/auth/register", data=json.dumps(self.user_data), content_type="application/json")
        self.token = json.loads(reg_resp.data)["data"]["token"]
        self.user_id = json.loads(reg_resp.data)["data"]["user"]["id"]
        self.auth_headers = {"Authorization": f"Bearer {self.token}"}

        self.event_data = {
            "title": "Mi Evento de Prueba",
            "description": "Una descripción detallada.",
            "date": "2025-01-01",
            "visibility": "public",
            "user_id": self.user_id
        }

    def tearDown(self):
        for model_name in ["usuario", "event", "favorite", "category"]:
            if model_name in orm.models:
                model = orm.get_model(model_name)
                if os.path.exists(model.full_path):
                    os.remove(model.full_path)

    def test_01_create_event(self):
        """Prueba la creación de un nuevo evento."""
        response = self.client.post("/api/v1/events/", data=json.dumps(self.event_data), headers=self.auth_headers, content_type="application/json")
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data["type"], ResponseType.SUCCESS)
        self.assertEqual(data["data"]["title"], self.event_data["title"])

    def test_02_get_events(self):
        """Prueba obtener la lista de eventos."""
        self.client.post("/api/v1/events/", data=json.dumps(self.event_data), headers=self.auth_headers, content_type="application/json")
        response = self.client.get("/api/v1/events/")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["type"], ResponseType.SUCCESS)
        self.assertEqual(len(data["data"]), 1)

    def test_03_get_event_by_id(self):
        """Prueba obtener un evento por su ID."""
        create_resp = self.client.post("/api/v1/events/", data=json.dumps(self.event_data), headers=self.auth_headers, content_type="application/json")
        event_id = json.loads(create_resp.data)["data"]["id"]

        response = self.client.get(f"/api/v1/events/{event_id}")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["type"], ResponseType.SUCCESS)
        self.assertEqual(data["data"]["id"], event_id)

    def test_04_update_event(self):
        """Prueba actualizar un evento."""
        create_resp = self.client.post("/api/v1/events/", data=json.dumps(self.event_data), headers=self.auth_headers, content_type="application/json")
        event_id = json.loads(create_resp.data)["data"]["id"]

        update_data = {"title": "Título Actualizado"}
        response = self.client.put(f"/api/v1/events/{event_id}", data=json.dumps(update_data), headers=self.auth_headers, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["type"], ResponseType.SUCCESS)
        self.assertEqual(data["data"]["title"], "Título Actualizado")

    def test_05_soft_delete_event(self):
        """Prueba el borrado lógico (soft delete) de un evento."""
        create_resp = self.client.post("/api/v1/events/", data=json.dumps(self.event_data), headers=self.auth_headers, content_type="application/json")
        event_id = json.loads(create_resp.data)["data"]["id"]

        del_response = self.client.delete(f"/api/v1/events/{event_id}", headers=self.auth_headers)
        self.assertEqual(del_response.status_code, 200)
        self.assertEqual(json.loads(del_response.data)["type"], ResponseType.SUCCESS)

        get_response = self.client.get(f"/api/v1/events/{event_id}")
        self.assertEqual(get_response.status_code, 404)
        self.assertEqual(json.loads(get_response.data)["type"], ResponseType.ERROR)

    def test_06_archive_and_restore_event(self):
        """Prueba el archivado y restauración de un evento."""
        create_resp = self.client.post("/api/v1/events/", data=json.dumps(self.event_data), headers=self.auth_headers, content_type="application/json")
        event_id = json.loads(create_resp.data)["data"]["id"]

        archive_resp = self.client.put(f"/api/v1/events/{event_id}/archive", headers=self.auth_headers)
        self.assertEqual(archive_resp.status_code, 200)
        self.assertEqual(json.loads(archive_resp.data)["type"], ResponseType.SUCCESS)

        restore_resp = self.client.put(f"/api/v1/events/{event_id}/restore", headers=self.auth_headers)
        self.assertEqual(restore_resp.status_code, 200)
        self.assertEqual(json.loads(restore_resp.data)["type"], ResponseType.SUCCESS)

    def test_07_hard_delete_event(self):
        """Prueba el borrado físico (hard delete) de un evento."""
        create_resp = self.client.post("/api/v1/events/", data=json.dumps(self.event_data), headers=self.auth_headers, content_type="application/json")
        event_id = json.loads(create_resp.data)["data"]["id"]

        response = self.client.delete(f"/api/v1/events/{event_id}/hard-delete", headers=self.auth_headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data)["type"], ResponseType.SUCCESS)

    def test_08_favorites(self):
        """Prueba el flujo completo de favoritos."""
        create_resp = self.client.post("/api/v1/events/", data=json.dumps(self.event_data), headers=self.auth_headers, content_type="application/json")
        event_id = json.loads(create_resp.data)["data"]["id"]

        add_fav_resp = self.client.post("/api/v1/events/favorites", data=json.dumps({"event_id": event_id}), headers=self.auth_headers, content_type="application/json")
        self.assertEqual(add_fav_resp.status_code, 201)
        self.assertEqual(json.loads(add_fav_resp.data)["type"], ResponseType.SUCCESS)

        get_fav_resp = self.client.get("/api/v1/events/favorites", headers=self.auth_headers)
        self.assertEqual(get_fav_resp.status_code, 200)
        self.assertEqual(json.loads(get_fav_resp.data)["type"], ResponseType.SUCCESS)

        del_fav_resp = self.client.delete(f"/api/v1/events/favorites/{event_id}", headers=self.auth_headers)
        self.assertEqual(del_fav_resp.status_code, 200)
        self.assertEqual(json.loads(del_fav_resp.data)["type"], ResponseType.SUCCESS)


if __name__ == "__main__":
    unittest.main()
