import unittest
import os
import csv
from pydantic import BaseModel
from db.ORMcsv import CSVModel, ORMManager


# Modelo Pydantic de prueba
class TestModel(BaseModel):
    id: str
    name: str
    value: int


class TestCSVModel(unittest.TestCase):
    def setUp(self):
        """Configura un entorno de prueba limpio antes de cada test."""
        self.db_dir = "db/data"
        self.csv_file = "test_data.csv"
        self.full_path = os.path.join(self.db_dir, self.csv_file)

        # Asegurarse de que el directorio de datos de prueba exista
        os.makedirs(self.db_dir, exist_ok=True)

        # Eliminar el archivo CSV de prueba si existe para empezar de cero
        if os.path.exists(self.full_path):
            os.remove(self.full_path)

        # Crear una instancia del modelo CSV
        self.model = CSVModel(TestModel, self.csv_file)

    def tearDown(self):
        """Limpia el entorno de prueba después de cada test."""
        if os.path.exists(self.full_path):
            os.remove(self.full_path)

    def test_01_file_creation(self):
        """Prueba que el archivo CSV se crea con los encabezados correctos."""
        self.assertTrue(os.path.exists(self.full_path))
        with open(self.full_path, "r") as f:
            reader = csv.reader(f)
            headers = next(reader)
            self.assertEqual(headers, ["id", "name", "value"])

    def test_02_create(self):
        """Prueba la creación de un nuevo registro."""
        data = {"name": "Test Name", "value": 123}
        created_record = self.model.create(data)

        self.assertIn("id", created_record)
        self.assertEqual(created_record["name"], "Test Name")
        self.assertEqual(created_record["value"], 123)

        # Verificar que el registro está en el archivo
        records = self.model.find_all()
        self.assertEqual(len(records), 1)
        self.assertEqual(records[0]["name"], "Test Name")

    def test_03_find_all(self):
        """Prueba que se pueden encontrar todos los registros."""
        self.model.create({"name": "Record 1", "value": 1})
        self.model.create({"name": "Record 2", "value": 2})

        records = self.model.find_all()
        self.assertEqual(len(records), 2)

    def test_04_find_by_id(self):
        """Prueba la búsqueda de un registro por su ID."""
        created = self.model.create({"name": "Find Me", "value": 456})
        found = self.model.find_by_id(created["id"])

        self.assertIsNotNone(found)
        self.assertEqual(found["name"], "Find Me")

        not_found = self.model.find_by_id("non-existent-id")
        self.assertIsNone(not_found)

    def test_05_find_by_field(self):
        """Prueba la búsqueda de registros por un campo y valor."""
        self.model.create({"name": "Common Name", "value": 1})
        self.model.create({"name": "Common Name", "value": 2})
        self.model.create({"name": "Unique Name", "value": 3})

        results = self.model.find_by_field("name", "Common Name")
        self.assertEqual(len(results), 2)

    def test_06_update_by_id(self):
        """Prueba la actualización de un registro."""
        created = self.model.create({"name": "Original", "value": 100})
        update_data = {"name": "Updated"}
        updated = self.model.update_by_id(created["id"], update_data)

        self.assertIsNotNone(updated)
        self.assertEqual(updated["name"], "Updated")
        self.assertEqual(updated["value"], 100)  # El valor no debería cambiar

        # Verificar que el cambio se guardó
        found = self.model.find_by_id(created["id"])
        self.assertEqual(found["name"], "Updated")

    def test_07_delete_by_id(self):
        """Prueba la eliminación de un registro."""
        created1 = self.model.create({"name": "To Delete", "value": 1})
        created2 = self.model.create({"name": "To Keep", "value": 2})

        deleted = self.model.delete_by_id(created1["id"])
        self.assertTrue(deleted)

        # Verificar que solo queda un registro
        records = self.model.find_all()
        self.assertEqual(len(records), 1)
        self.assertEqual(records[0]["name"], "To Keep")

        # Probar a eliminar un ID que no existe
        not_deleted = self.model.delete_by_id("non-existent-id")
        self.assertFalse(not_deleted)


class TestORMManager(unittest.TestCase):
    def setUp(self):
        self.orm = ORMManager()

    def test_register_and_get_model(self):
        """Prueba el registro y obtención de un modelo."""
        self.orm.register_model("test", TestModel, "test.csv")
        model_instance = self.orm.get_model("test")
        self.assertIsInstance(model_instance, CSVModel)

    def test_get_unregistered_model(self):
        """Prueba que obtener un modelo no registrado lanza un error."""
        with self.assertRaises(ValueError):
            self.orm.get_model("unregistered")


if __name__ == "__main__":
    unittest.main()
