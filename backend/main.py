from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import csv
from typing import Literal, TypedDict, Optional
from flask_cors import CORS
from pydantic import BaseModel, Field, ValidationError

app = Flask(__name__)
CORS(app, origins=["http://localhost:4321", "http://127.0.0.1:4321"])
CSV_FILE = "data.csv"


class Usuario(BaseModel):
    id: Optional[int] = Field(default=None, description="ID único del usuario")
    nombre: str
    edad: int = Field(ge=0, le=130)


# Definición de tipos extraídos para evitar repetición
class UserData(TypedDict):
    _id: str
    usuario: str
    name: str
    email: str
    password: str


# Tipo alias para mayor claridad
UserDataDict = dict[Literal["usuario", "clave", "nombre", "correo"], str]


# Verificar si el archivo CSV existe, si no, crearlo con encabezados
class CSVHandler:
    @staticmethod
    def initialize_csv():
        if not os.path.isfile(CSV_FILE):
            with open(CSV_FILE, "w", newline="", encoding="utf-8") as archivo:
                writer = csv.writer(archivo)
                writer.writerow(["_id", "usuario", "password", "name", "email"])

    @staticmethod
    def save(data: UserData):
        with open(CSV_FILE, "a", newline="", encoding="utf-8") as archivo:
            writer = csv.writer(archivo)
            writer.writerow(
                [data["_id"], data["usuario"], data["password"], data["name"], data["email"]]
            )

    @staticmethod
    def getById(user_id: str) -> UserData | None:
        with open(CSV_FILE, "r", newline="", encoding="utf-8") as archivo:
            reader = csv.DictReader(archivo)
            for row in reader:
                if row["_id"] == user_id:
                    return {
                        "_id": row["_id"],
                        "usuario": row["usuario"],
                        "password": row["password"],
                        "name": row["name"],
                        "email": row["email"],
                    }
        return None

    @staticmethod
    def getByEmail(email: str) -> UserData | None:
        with open(CSV_FILE, "r", newline="", encoding="utf-8") as archivo:
            reader = csv.DictReader(archivo)
            for row in reader:
                print(row)
                if row["email"] == email:
                    return {
                        "_id": row["_id"],
                        "usuario": row["usuario"],
                        "password": row["password"],
                        "name": row["name"],
                        "email": row["email"],
                    }
            return None


CSVHandler.initialize_csv()


@app.route("/")
def index():
    return redirect(url_for("login"))


@app.route("/registro", methods=["POST"])
def registro():
    try:
        data = request.get_json()
        user = Usuario(**data)
        return jsonify(
            {"msg": f"Hola {user.nombre}, tienes {user.edad} años, validado con amor uwu"}
        )
    except ValidationError as e:
        return jsonify(e.errors()), 400
    data: UserData = request.get_json()

    user: UserData = {
        "_id": str(len(open(CSV_FILE).readlines())),  # Simple ID generation
        "usuario": data["name"],  # data["usuario"],
        "password": data["password"],
        "name": data["name"],
        "email": data["email"],
    }
    if CSVHandler.getByEmail(data["email"]):
        return jsonify({"type": "error", "message": "El correo ya está registrado"}), 400
    CSVHandler.save(user)
    return jsonify(
        {"type": "success", "message": "Usuario registrado exitosamente", "data": user}
    ), 201


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        usuario = request.form["usuario"]
        clave = request.form["clave"]
        with open(CSV_FILE, "r", newline="", encoding="utf-8") as archivo:
            reader = csv.DictReader(archivo)
            for row in reader:
                if row["usuario"] == usuario and row["clave"] == clave:
                    return f"Bienvenido, {row['nombre']}!"
        return "Usuario o clave incorrectos", 401
    return "Loging en la clase de Python"


@app.route("/formulario", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        # Aquí manejarías la lógica para procesar el formulario
        nombre = request.form["nombre"]
        return f"Hola, {nombre}!, bienvenido a la clase"
    return render_template("formulario.html")


if __name__ == "__main__":
    app.run(debug=True)
