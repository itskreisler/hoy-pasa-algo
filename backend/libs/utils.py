import secrets
import requests


def generate_id(length: int = 32) -> str:
    """Genera un ID único de longitud especificada."""
    return secrets.token_hex(length // 2)
