from flask import Flask, send_from_directory
import os
from dataclasses import dataclass

dist_sin_resolver = os.path.join(os.path.dirname(__file__), "../dist")
# hacer un resolve
dist = os.path.abspath(dist_sin_resolver)
print(f"Directorio de distribución: {dist}")
if os.path.exists(dist):
    # listar de archivos en el directorio
    files = os.listdir(dist)
    print(f"Archivos en '{dist}': {files}")

if not os.path.exists(dist):
    raise FileNotFoundError(f"Directory '{dist}' does not exist. Please build the frontend first.")


@dataclass
class Usuario:
    nombre: str
    edad: int


usuarios: list[Usuario] = []
#
app = Flask(__name__, static_folder="../dist", static_url_path="")


@app.route("/")
def index():
    if app.static_folder is None:
        raise ValueError("Static folder is not configured")
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def static_proxy(path: str):
    if app.static_folder is None:
        raise ValueError("Static folder is not configured")
    return send_from_directory(app.static_folder, path)


#
if __name__ == "__main__":
    app.run(debug=True)
