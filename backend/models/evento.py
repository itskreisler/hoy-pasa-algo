from pydantic import BaseModel, Field
from typing import Optional, Literal


class Evento(BaseModel):
    id: Optional[str] = Field(default=None, description="ID único del evento")
    user_id: str
    title: str
    description: Optional[str]
    date: str
    time: Optional[str]
    country: Optional[str]
    city: Optional[str]
    category_id: Optional[str]  # Se usara una tabla de categorías ej "Deportes=1"
    subcategory_id: Optional[
        str
    ]  # Subcategorías ej Atletismo, Ciclismo, etc. pertenecen a Deportes=1
    hashtags: Optional[list[str]]
    calendar: Optional[str]
    image_url: Optional[str]
    link: Optional[str]
    visibility: Literal["public", "private", "only_me"]
    status: Optional[Literal["active", "archived", "deleted"]] = Field(
        default="active", description="Estado del evento, por defecto 'active'"
    )  # Estado del evento


class Category(BaseModel):
    id: Optional[str] = Field(default=None, description="ID único de la categoría")
    name: str
    parent_id: Optional[str] = Field(default=None, description="ID de la categoría padre")


class Favorite(BaseModel):
    id: Optional[str] = Field(default=None, description="ID único del favorito")
    user_id: str
    event_id: str
