import unittest
from pydantic import ValidationError
from models.usuario import Usuario
from models.evento import Evento, Category, Favorite


class TestModels(unittest.TestCase):
    def test_usuario_validation_success(self):
        """Prueba una validación exitosa del modelo Usuario."""
        try:
            Usuario(
                email="test@example.com",
                password="validpassword123",
                full_name="Test User",
                username="testuser1",
            )
        except ValidationError as e:
            self.fail(f"La validación de Usuario falló inesperadamente: {e}")

    def test_usuario_invalid_email(self):
        """Prueba que un email inválido lanza un error."""
        with self.assertRaises(ValidationError):
            Usuario(email="not-an-email", password="password")

    def test_usuario_short_password(self):
        """Prueba que una contraseña corta lanza un error."""
        with self.assertRaises(ValidationError):
            Usuario(email="test@example.com", password="short")

    def test_usuario_invalid_username(self):
        """Prueba que un nombre de usuario inválido lanza un error."""
        with self.assertRaises(ValidationError):
            Usuario(
                email="test@example.com",
                password="password123",
                username="invalid username",  # Contiene espacios
            )
        with self.assertRaises(ValidationError):
            Usuario(
                email="test@example.com",
                password="password123",
                username="inv",  # Demasiado corto
            )

    def test_usuario_invalid_full_name(self):
        """Prueba que un nombre completo con números lanza un error."""
        with self.assertRaises(ValidationError):
            Usuario(
                email="test@example.com",
                password="password123",
                full_name="Invalid Name 123",
            )

    def test_evento_validation_success(self):
        """Prueba una validación exitosa del modelo Evento."""
        try:
            Evento(
                user_id="user123",
                title="Mi Evento",
                date="2024-12-31",
                visibility="public",
            )
        except ValidationError as e:
            self.fail(f"La validación de Evento falló inesperadamente: {e}")

    def test_category_validation_success(self):
        """Prueba una validación exitosa del modelo Category."""
        try:
            Category(name="Deportes")
        except ValidationError as e:
            self.fail(f"La validación de Category falló inesperadamente: {e}")

    def test_favorite_validation_success(self):
        """Prueba una validación exitosa del modelo Favorite."""
        try:
            Favorite(user_id="user123", event_id="event456")
        except ValidationError as e:
            self.fail(f"La validación de Favorite falló inesperadamente: {e}")


if __name__ == "__main__":
    unittest.main()
