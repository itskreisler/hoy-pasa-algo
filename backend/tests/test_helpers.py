import unittest
from libs.helpers import (
    hash_password,
    verify_password,
    create_token,
    decode_token,
)


class TestHelpers(unittest.TestCase):
    def test_password_hashing(self):
        """Prueba el hasheo y verificación de contraseñas."""
        password = "mysecretpassword"
        hashed = hash_password(password)
        self.assertIsInstance(hashed, str)
        self.assertNotEqual(password, hashed)
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("wrongpassword", hashed))

    def test_password_hashing_empty(self):
        """Prueba que el hasheo de una contraseña vacía lanza un error."""
        with self.assertRaises(ValueError):
            hash_password("")
        with self.assertRaises(ValueError):
            hash_password("   ")

    def test_token_creation_and_decoding(self):
        """Prueba la creación y decodificación de tokens."""
        user_data = {"user_id": 123, "username": "testuser"}
        token = create_token(user_data)
        self.assertIsInstance(token, str)

        error, decoded_data = decode_token(token)
        self.assertIsNone(error)
        self.assertEqual(user_data, decoded_data)

    def test_invalid_token_decoding(self):
        """Prueba que un token inválido no se decodifica."""
        invalid_token = "invalid.token.string"
        error, decoded_data = decode_token(invalid_token)
        self.assertIsNotNone(error)
        self.assertIsNone(decoded_data)


if __name__ == "__main__":
    unittest.main()
