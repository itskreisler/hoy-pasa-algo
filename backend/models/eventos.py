from pydantic import BaseModel, Field
from typing import Optional, Literal


class Evento(BaseModel):
    id: Optional[int] = Field(default=None, description="ID único del evento")
    title: str
    description: str
    date: str
    time: str
    country: str
    city: str
    category_id: str  # Se usara una tabla de categorías ej "Deportes=1"
    subcategory_id: int  # Se usara la misma tabla de categorías para crear subcategorías ej Atletismo, Ciclismo, etc. pertenecen a Deportes=1
    hashtags: list[str]
    calendar: str
    image_url: str
    link: str
    visibility: Literal["public", "private", "only_me"]


class Category(BaseModel):
    id: Optional[int] = Field(default=None, description="ID único de la categoría")
    name: str
    parent_id: Optional[int] = Field(default=None, description="ID de la categoría padre")


class Favorite(BaseModel):
    id: Optional[int] = Field(default=None, description="ID único del favorito")
    user_id: int
    event_id: int
