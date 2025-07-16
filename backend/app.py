from flask import Flask, render_template, request
from dataclasses import dataclass


@dataclass
class Usuario:
    nombre: str
    edad: int


usuarios: list[Usuario] = []
#
app = Flask(__name__)


@app.route("/")
def index():
    return {"mensaje": "¡Hola, mundo!"}
    return render_template("index.html", mensaje="Este es un mensaje de prueba")


#
if __name__ == "__main__":
    app.run(debug=True)
