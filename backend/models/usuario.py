from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, Literal, Any
import regex


class Usuario(BaseModel):
    id: Optional[int] = Field(default=None, description="ID único del usuario")
    username: Optional[str] = Field(
        default=None,
        min_length=5,
        pattern=r"^[a-z0-9_]+$",
        description="Nombre de usuario (solo a-z, 0-9 y _, mínimo 5 caracteres)",
    )
    rol: Optional[Literal["admin", "user"]] = Field(
        default=None,
        description="Rol del usuario, puede ser 'admin' o 'user'",
    )
    full_name: Optional[str] = Field(
        default=None,
        description="Nombre completo del usuario",
    )

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        pattern = regex.compile(r"^[\p{L}\s]+$")
        if not pattern.match(v) or not v.replace(" ", "").isalpha():
            raise ValueError("El nombre completo solo puede contener letras y espacios")
        return v

    email: EmailStr = Field(..., description="Correo electrónico del usuario")
    password: str = Field(..., min_length=8, description="Contraseña del usuario")
    birth_date: Optional[str] = Field(
        default=None, description="Fecha de nacimiento del usuario en formato YYYY-MM-DD"
    )
    gener: Optional[Literal["M", "F"]] = Field(default=None, description="Género del usuario")

    @classmethod
    def to_json(cls, usuario: "Usuario") -> dict[str, Any]:
        return dict(usuario)
