from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
import os
from typing import List, Any, Tuple
from datetime import datetime
from libs.helpers import ResponseType

# Blueprint para subida de archivos
upload_bp: Blueprint = Blueprint("upload", __name__, url_prefix="/api/v1/upload")

# Extensiones de archivo permitidas
ALLOWED_EXTENSIONS: set[str] = {"png", "jpg", "jpeg", "gif", "mp4", "mov"}


def allowed_file(filename: str | None) -> bool:
    """Comprueba si la extensión del archivo es válida."""
    if filename is None:
        return False
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route("/", methods=["POST"])
def upload_file() -> Tuple[Any, int]:
    """
    Sube uno o varios archivos multimedia.
    ---
    tags:
      - Upload
    consumes:
      - multipart/form-data
    parameters:
      - in: formData
        name: files
        type: file
        required: true
        description: Archivo o archivos a subir. También acepta 'file' para un solo archivo.
    responses:
      201:
        description: Archivos subidos exitosamente.
        schema:
          type: object
          properties:
            type:
              type: string
              enum: ["success"]
            message:
              type: string
            data:
              type: object
              properties:
                urls:
                  type: array
                  items:
                    type: string
                count:
                  type: integer
      400:
        description: Error en la solicitud.
        schema:
          type: object
          properties:
            type:
              type: string
              enum: ["error"]
            message:
              type: string
    """
    print("Request received at /upload", request.files)

    # Obtener todos los archivos independientemente del nombre del campo
    all_files: List[FileStorage] = []
    for field_name in request.files:
        field_files: List[FileStorage] = request.files.getlist(field_name)
        all_files.extend(field_files)

    if not all_files:
        print("No files found in request")
        return jsonify(
            {"type": ResponseType.ERROR, "message": "No se encontraron archivos en la solicitud"}
        ), 400

    files: List[FileStorage] = all_files
    print(f"Files received: {files}")
    if not files or all(f.filename == "" for f in files):
        print("No files selected")
        return jsonify({"type": ResponseType.ERROR, "message": "No se seleccionaron archivos"}), 400

    uploaded_urls: List[str] = []
    for file in files:
        print(f"Processing file: {file.filename}")
        if file and file.filename and allowed_file(file.filename):
            print(f"File allowed: {file.filename}")
            original_filename: str = secure_filename(file.filename)

            # Generar timestamp para hacer el archivo único
            timestamp: str = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]  # Microsegundos

            # Separar nombre y extensión
            name_parts: list[str] = original_filename.rsplit(".", 1)
            if len(name_parts) == 2:
                base_name: str = name_parts[0]
                extension: str = name_parts[1]
                filename: str = f"{base_name}_{timestamp}.{extension}"
            else:
                # Si no tiene extensión (caso raro)
                filename: str = f"{original_filename}_{timestamp}"

            # Verificar que static_folder existe
            if current_app.static_folder is None:
                return jsonify(
                    {"type": ResponseType.ERROR, "message": "Carpeta estática no configurada"}
                ), 500

            # Asegurarse de que el directorio de subida existe
            upload_folder: str = os.path.join(current_app.static_folder, "media", "uploads")
            os.makedirs(upload_folder, exist_ok=True)

            file_path: str = os.path.join(upload_folder, filename)
            file.save(file_path)
            # La URL devuelta será relativa a la carpeta estática
            file_url: str = f"/static/media/uploads/{filename}"
            uploaded_urls.append(file_url)
        else:
            print(f"File not allowed: {file.filename}")

    if not uploaded_urls:
        print("No valid files to upload")
        return jsonify(
            {"type": ResponseType.ERROR, "message": "Ningún archivo válido para subir"}
        ), 400

    return (
        jsonify(
            {
                "type": ResponseType.SUCCESS,
                "message": "Archivos subidos exitosamente",
                "data": {"urls": uploaded_urls, "count": len(uploaded_urls)},
            }
        ),
        201,
    )


@upload_bp.route("/qr", methods=["GET"])
def generate_qr() -> Tuple[Any, int]:
    """
    Genera un código QR a partir de una URL.
    ---
    tags:
      - Upload
    parameters:
      - in: query
        name: url
        type: string
        required: true
        description: URL a codificar en el código QR.
    responses:
      200:
        description: Código QR generado exitosamente.
        content:
          image/png:
            schema:
              type: string
              format: binary
      400:
        description: Error en la solicitud.
        schema:
          type: object
          properties:
            type:
              type: string
              enum: ["error"]
            message:
              type: string
    """
    import qrcode
    from io import BytesIO
    from flask import send_file

    url: str | None = request.args.get("url")
    if not url:
        return jsonify({"type": ResponseType.ERROR, "message": "No se proporcionó una URL"}), 400

    # Generar el código QR
    qr: Any = qrcode.QRCode(
        version=1,
        error_correction=qrcode.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # El tipo de imagen PIL no es importado, así que usamos Any temporalmente
    img: Any = qr.make_image(fill_color="black", back_color="white")

    # Guardar la imagen en un buffer de bytes
    buf: BytesIO = BytesIO()
    img.save(buf, "PNG")
    buf.seek(0)

    return send_file(buf, mimetype="image/png"), 200
