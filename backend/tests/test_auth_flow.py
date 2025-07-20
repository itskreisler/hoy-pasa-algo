import unittest
import json
from factory import create_app
from db.ORMcsv import orm
from models.usuario import Usuario
import os


class AuthFlowTest(unittest.TestCase):
    def setUp(self):
        """Configura la aplicación de Flask para pruebas."""
        os.environ["FLASK_ENV"] = "development"
        self.app = create_app("development")
        self.client = self.app.test_client()

        # Limpiar la base de datos de usuarios antes de cada prueba
        self.user_model = orm.get_model("usuario")
        if os.path.exists(self.user_model.full_path):
            os.remove(self.user_model.full_path)
        self.user_model._ensure_file()  # Recrear el archivo con encabezados

        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "strongpassword123",
            "rol": "user",
        }

    def tearDown(self):
        """Limpia después de cada prueba."""
        if os.path.exists(self.user_model.full_path):
            os.remove(self.user_model.full_path)

    def test_01_register(self):
        """Prueba el registro de un nuevo usuario."""
        response = self.client.post(
            "/api/v1/auth/register",
            data=json.dumps(self.user_data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data["type"], "success")
        self.assertIn("token", data["data"])
        self.assertEqual(data["data"]["user"]["email"], self.user_data["email"])

    def test_02_register_duplicate_email(self):
        """Prueba que no se puede registrar un usuario con un email duplicado."""
        # Primer registro
        self.client.post(
            "/api/v1/auth/register",
            data=json.dumps(self.user_data),
            content_type="application/json",
        )
        # Segundo intento con el mismo email
        response = self.client.post(
            "/api/v1/auth/register",
            data=json.dumps(self.user_data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertEqual(data["message"], "Ya existe un usuario con este email")

    def test_03_login(self):
        """Prueba el inicio de sesión de un usuario."""
        # Primero, registrar
        self.client.post(
            "/api/v1/auth/register",
            data=json.dumps(self.user_data),
            content_type="application/json",
        )
        # Luego, login
        login_data = {"email": self.user_data["email"], "password": self.user_data["password"]}
        response = self.client.post(
            "/api/v1/auth/login",
            data=json.dumps(login_data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["type"], "success")
        self.assertIn("token", data["data"])

    def test_04_login_invalid_credentials(self):
        """Prueba el login con credenciales incorrectas."""
        self.client.post(
            "/api/v1/auth/register",
            data=json.dumps(self.user_data),
            content_type="application/json",
        )
        login_data = {"email": self.user_data["email"], "password": "wrongpassword"}
        response = self.client.post(
            "/api/v1/auth/login",
            data=json.dumps(login_data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertEqual(data["message"], "Credenciales inválidas")

    def test_05_access_protected_route(self):
        """Prueba el acceso a una ruta protegida con un token válido."""
        # Registrar y obtener token
        reg_response = self.client.post(
            "/api/v1/auth/register",
            data=json.dumps(self.user_data),
            content_type="application/json",
        )
        token = json.loads(reg_response.data)["data"]["token"]

        # Acceder a la ruta protegida
        response = self.client.get(
            "/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["data"]["user"]["email"], self.user_data["email"])

    def test_06_access_protected_route_no_token(self):
        """Prueba que no se puede acceder a una ruta protegida sin token."""
        response = self.client.get("/api/v1/auth/me")
        self.assertEqual(response.status_code, 401)

    def test_07_admin_only_route_as_user(self):
        """Prueba que un usuario normal no puede acceder a una ruta de admin."""
        reg_response = self.client.post(
            "/api/v1/auth/register",
            data=json.dumps(self.user_data), # rol='user'
            content_type="application/json",
        )
        token = json.loads(reg_response.data)["data"]["token"]

        response = self.client.get(
            "/api/v1/auth/admin-only", headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(response.status_code, 403)

    def test_08_admin_only_route_as_admin(self):
        """Prueba que un admin sí puede acceder a una ruta de admin."""
        admin_data = self.user_data.copy()
        admin_data["email"] = "admin@example.com"
        admin_data["username"] = "adminuser"
        admin_data["rol"] = "admin"

        reg_response = self.client.post(
            "/api/v1/auth/register",
            data=json.dumps(admin_data),
            content_type="application/json",
        )
        token = json.loads(reg_response.data)["data"]["token"]

        response = self.client.get(
            "/api/v1/auth/admin-only", headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()
