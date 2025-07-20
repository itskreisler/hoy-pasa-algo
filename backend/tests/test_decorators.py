import unittest
import json
from flask import Flask, jsonify
from pydantic import BaseModel
from libs.helpers import auth_required, validate, auth_optional, create_token


# Modelo Pydantic de prueba
class SampleModel(BaseModel):
    name: str
    value: int


class DecoratorsTest(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.client = self.app.test_client()

        # Ruta de prueba para @auth_required
        @self.app.route("/protected")
        @auth_required
        def protected_route(user):
            return jsonify(user)

        # Ruta de prueba para @validate
        @self.app.route("/validated", methods=["POST"])
        @validate(SampleModel)
        def validated_route(validated):
            return jsonify(validated.model_dump())

        # Ruta de prueba para @auth_optional
        @self.app.route("/optional")
        @auth_optional
        def optional_route(user):
            return jsonify(user)

        # Datos de prueba
        self.user_data = {"id": 1, "username": "test"}
        self.valid_token = create_token(self.user_data)
        self.valid_headers = {"Authorization": f"Bearer {self.valid_token}"}
        self.invalid_headers = {"Authorization": "Bearer invalidtoken"}

    def test_auth_required_no_token(self):
        response = self.client.get("/protected")
        self.assertEqual(response.status_code, 401)

    def test_auth_required_invalid_token(self):
        response = self.client.get("/protected", headers=self.invalid_headers)
        self.assertEqual(response.status_code, 401)

    def test_auth_required_valid_token(self):
        response = self.client.get("/protected", headers=self.valid_headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), self.user_data)

    def test_validate_success(self):
        valid_data = {"name": "test", "value": 123}
        response = self.client.post("/validated", data=json.dumps(valid_data), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), valid_data)

    def test_validate_failure(self):
        invalid_data = {"name": "test"}  # Falta 'value'
        response = self.client.post("/validated", data=json.dumps(invalid_data), content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_auth_optional_no_token(self):
        response = self.client.get("/optional")
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.get_json())

    def test_auth_optional_valid_token(self):
        response = self.client.get("/optional", headers=self.valid_headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), self.user_data)


if __name__ == "__main__":
    unittest.main()
