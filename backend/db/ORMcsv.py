import csv
import os
from typing import Any, Dict, List, Optional, Type, Union
from pydantic import BaseModel
import json
from libs.helpers import generate_id


class CSVModel:
    """Clase base para modelos que se almacenan en CSV"""

    def __init__(self, model_class: Type[BaseModel], csv_file: str):
        self.model_class = model_class
        self.csv_file = csv_file
        self.data_dir = "db/data"
        self.full_path = os.path.join(self.data_dir, csv_file)
        self._ensure_directory()
        self._ensure_file()

    def _ensure_directory(self):
        """Crea el directorio de datos si no existe"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)

    def _ensure_file(self):
        """Crea el archivo CSV si no existe con los headers del modelo"""
        if not os.path.exists(self.full_path):
            # Obtener los campos del modelo Pydantic
            fields = list(self.model_class.model_fields.keys())
            with open(self.full_path, "w", newline="", encoding="utf-8") as file:
                writer = csv.DictWriter(file, fieldnames=fields)
                writer.writeheader()

    def _serialize_value(self, value: Any) -> str:
        """Convierte valores complejos a string para CSV"""
        if value is None:
            return ""
        elif isinstance(value, str):
            return value
        elif isinstance(value, (dict, list)):
            return json.dumps(value)
        elif isinstance(value, (int, float, bool)):
            return str(value)
        else:
            return str(value)

    def _deserialize_value(self, field_name: str, value: str) -> Any:
        """Convierte strings de CSV a valores Python"""
        if not value or value == "":
            return None

        # Obtener el tipo del campo del modelo
        field_info = self.model_class.model_fields.get(field_name)
        if not field_info:
            return value

        # Intentar deserializar JSON (listas y diccionarios)
        if value.startswith(("[", "{")):
            try:
                return json.loads(value)
            except Exception:
                pass

        # Convertir tipos básicos
        if field_info.annotation in (int, Optional[int]):
            try:
                return int(value)
            except Exception:
                return None if field_info.annotation == Optional[int] else 0

        # Para todos los demás casos, devolver el string tal como está
        return value

    def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Crea un nuevo registro"""
        # Generar ID automático como string para compatibilidad
        data["id"] = generate_id()

        # Validar con Pydantic
        validated = self.model_class.model_validate(data)
        record = validated.model_dump()

        # Escribir al CSV
        fieldnames = list(self.model_class.model_fields.keys())
        with open(self.full_path, "a", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            # Serializar valores complejos
            serialized_record = {k: self._serialize_value(v) for k, v in record.items()}
            writer.writerow(serialized_record)

        return record

    def find_all(self) -> List[Dict[str, Any]]:
        """Obtiene todos los registros"""
        records: List[Dict[str, Any]] = []
        try:
            with open(self.full_path, "r", newline="", encoding="utf-8") as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Deserializar valores
                    record = {k: self._deserialize_value(k, v) for k, v in row.items()}
                    records.append(record)
        except FileNotFoundError:
            pass
        return records

    def find_by_id(self, record_id: Union[int, str]) -> Optional[Dict[str, Any]]:
        """Busca un registro por ID"""
        records = self.find_all()
        for record in records:
            if str(record.get("id")) == str(record_id):
                return record
        return None

    def find_by_field(self, field: str, value: Any) -> List[Dict[str, Any]]:
        """Busca registros por un campo específico"""
        records = self.find_all()
        return [r for r in records if r.get(field) == value]

    def find_one_by_field(self, field: str, value: Any) -> Optional[Dict[str, Any]]:
        """Busca un solo registro por un campo específico"""
        results = self.find_by_field(field, value)
        return results[0] if results else None

    def update_by_id(
        self, record_id: Union[int, str], data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Actualiza un registro por ID"""
        records = self.find_all()
        updated_record = None

        for i, record in enumerate(records):
            if str(record.get("id")) == str(record_id):
                # Actualizar solo los campos proporcionados
                record.update(data)
                # Validar con Pydantic
                validated = self.model_class.model_validate(record)
                records[i] = validated.model_dump()
                updated_record = records[i]
                break

        if updated_record:
            self._write_all_records(records)
            return updated_record
        return None

    def delete_by_id(self, record_id: Union[int, str]) -> bool:
        """Elimina un registro por ID"""
        records = self.find_all()
        original_length = len(records)
        records = [r for r in records if str(r.get("id")) != str(record_id)]

        if len(records) < original_length:
            self._write_all_records(records)
            return True
        return False

    def _write_all_records(self, records: List[Dict[str, Any]]):
        """Reescribe todo el archivo CSV con los registros dados"""
        fieldnames = list(self.model_class.model_fields.keys())
        with open(self.full_path, "w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            for record in records:
                # Serializar valores complejos
                serialized_record = {k: self._serialize_value(v) for k, v in record.items()}
                writer.writerow(serialized_record)

    def count(self) -> int:
        """Cuenta el total de registros"""
        return len(self.find_all())

    def paginate(self, page: int = 1, per_page: int = 10) -> Dict[str, Any]:
        """Paginación de registros"""
        records = self.find_all()
        total = len(records)
        start = (page - 1) * per_page
        end = start + per_page

        return {
            "data": records[start:end],
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": (total + per_page - 1) // per_page,
        }


class ORMManager:
    """Gestor principal del ORM para diferentes modelos"""

    def __init__(self):
        self.models: Dict[str, CSVModel] = {}

    def register_model(self, name: str, model_class: Type[BaseModel], csv_file: str):
        """Registra un modelo en el ORM"""
        self.models[name] = CSVModel(model_class, csv_file)

    def get_model(self, name: str) -> CSVModel:
        """Obtiene un modelo registrado"""
        if name not in self.models:
            raise ValueError(f"Modelo '{name}' no registrado")
        return self.models[name]


# Instancia global del ORM
orm = ORMManager()
