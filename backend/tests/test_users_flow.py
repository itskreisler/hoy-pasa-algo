import unittest
import json
from factory import create_app
from db.ORMcsv import orm
import os


class UsersFlowTest(unittest.TestCase):
    def setUp(self):
        os.environ["FLASK_ENV"] = "development"
        self.app = create_app("development")
        self.client = self.app.test_client()

        # Limpiar la base de datos de usuarios
        self.user_model = orm.get_model("usuario")
        if os.path.exists(self.user_model.full_path):
            os.remove(self.user_model.full_path)
        self.user_model._ensure_file()

        # Crear usuarios de prueba (admin y normal)
        self.admin_data = {"email": "admin@test.com", "password": "password", "rol": "admin"}
        self.user_data = {"email": "user@test.com", "password": "password", "rol": "user"}

        # Registrar admin y obtener token
        reg_admin_resp = self.client.post("/api/v1/auth/register", data=json.dumps(self.admin_data), content_type="application/json")
        self.admin_token = json.loads(reg_admin_resp.data)["data"]["token"]
        self.admin_id = json.loads(reg_admin_resp.data)["data"]["user"]["id"]
        self.admin_headers = {"Authorization": f"Bearer {self.admin_token}"}

        # Registrar usuario y obtener token
        reg_user_resp = self.client.post("/api/v1/auth/register", data=json.dumps(self.user_data), content_type="application/json")
        self.user_token = json.loads(reg_user_resp.data)["data"]["token"]
        self.user_id = json.loads(reg_user_resp.data)["data"]["user"]["id"]
        self.user_headers = {"Authorization": f"Bearer {self.user_token}"}

    def tearDown(self):
        if os.path.exists(self.user_model.full_path):
            os.remove(self.user_model.full_path)

    def test_01_get_all_users_as_admin(self):
        """Prueba que un admin puede obtener la lista de todos los usuarios."""
        response = self.client.get("/api/v1/users/", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["total"], 2)

    def test_02_get_all_users_as_user(self):
        """Prueba que un usuario normal no puede obtener la lista de usuarios."""
        response = self.client.get("/api/v1/users/", headers=self.user_headers)
        self.assertEqual(response.status_code, 403)

    def test_03_get_user_by_id_as_admin(self):
        """Prueba que un admin puede obtener cualquier usuario por su ID."""
        response = self.client.get(f"/api/v1/users/{self.user_id}", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["data"]["id"], self.user_id)

    def test_04_get_own_user_by_id_as_user(self):
        """Prueba que un usuario puede obtener su propia información."""
        response = self.client.get(f"/api/v1/users/{self.user_id}", headers=self.user_headers)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["data"]["id"], self.user_id)

    def test_05_get_other_user_by_id_as_user(self):
        """Prueba que un usuario no puede obtener la info de otro usuario."""
        response = self.client.get(f"/api/v1/users/{self.admin_id}", headers=self.user_headers)
        self.assertEqual(response.status_code, 403)

    def test_06_update_user_as_admin(self):
        """Prueba que un admin puede actualizar a otro usuario."""
        update_data = {"full_name": "Updated Name by Admin"}
        response = self.client.put(f"/api/v1/users/{self.user_id}", data=json.dumps(update_data), headers=self.admin_headers, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["data"]["full_name"], "Updated Name by Admin")

    def test_07_update_own_user_as_user(self):
        """Prueba que un usuario puede actualizar su propia información."""
        update_data = {"full_name": "Updated Name by Myself"}
        response = self.client.put(f"/api/v1/users/{self.user_id}", data=json.dumps(update_data), headers=self.user_headers, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["data"]["full_name"], "Updated Name by Myself")

    def test_08_delete_user_as_admin(self):
        """Prueba que un admin puede eliminar a otro usuario."""
        response = self.client.delete(f"/api/v1/users/{self.user_id}", headers=self.admin_headers)
        self.assertEqual(response.status_code, 200)

        # Verificar que el usuario fue eliminado
        get_resp = self.client.get(f"/api/v1/users/{self.user_id}", headers=self.admin_headers)
        self.assertEqual(get_resp.status_code, 404)

    def test_09_delete_user_as_user(self):
        """Prueba que un usuario normal no puede eliminar a otro."""
        response = self.client.delete(f"/api/v1/users/{self.admin_id}", headers=self.user_headers)
        self.assertEqual(response.status_code, 403)


if __name__ == "__main__":
    unittest.main()
