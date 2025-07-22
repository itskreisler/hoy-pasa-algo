from pydantic import BaseModel, Field
from typing import Optional, Literal


class Evento(BaseModel):
    id: Optional[str] = Field(default=None, description="ID único del evento")
    user_id: Optional[str] = Field(default=None, description="ID del usuario que creó el evento")
    title: str
    description: Optional[str] = None
    date: str
    time: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    category_id: Optional[str] = None
    subcategory_id: Optional[str] = None
    hashtags: Optional[list[str]] = None
    calendar: Optional[str] = None
    image_url: Optional[str] = None
    link: Optional[str] = None
    visibility: Literal["public", "private", "only_me"]
    status: Optional[Literal["active", "archived", "deleted"]] = Field(
        default="active", description="Estado del evento, por defecto 'active'"
    )


class Category(BaseModel):
    id: Optional[str] = Field(default=None, description="ID único de la categoría")
    name: str
    parent_id: Optional[str] = Field(default=None, description="ID de la categoría padre")


class Favorite(BaseModel):
    id: Optional[str] = Field(default=None, description="ID único del favorito")
    user_id: str
    event_id: str
