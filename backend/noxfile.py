import nox
from nox import Session


@nox.session(venv_backend="uv")
def dev_setup(session: Session) -> None:
    """Configurar entorno de desarrollo"""
    session.install("pytest", "requests", "flask", "flask-cors", "pydantic", "jwt")
    session.run("echo", "Entorno configurado exitosamente", external=True)


@nox.session(venv_backend="uv")
def test_all(session: Session) -> None:
    """Ejecutar todos los tests (requiere servidor corriendo)"""
    session.install("pytest", "requests")
    session.run("pytest", "tests/test_api.py", "-v", external=True)


@nox.session(venv_backend="uv")
def test_api(session: Session) -> None:
    """Ejecutar tests de API completos (requiere servidor en puerto 5000)"""
    session.install("pytest", "requests")
    print("🚨 IMPORTANTE: Asegúrate de que el servidor esté corriendo en http://localhost:5000")
    print("   Ejecuta: nox -s start_server (en otra terminal)")
    session.run("pytest", "tests/test_api.py", "-v", "-s", external=True)


@nox.session(venv_backend="uv")
def start_server(session: Session) -> None:
    """Iniciar servidor Flask para testing"""
    session.install("flask", "flask-cors", "pydantic", "jwt")
    session.run("python", "app.py", external=True)


@nox.session(venv_backend="uv")
def lint(session: Session) -> None:
    """Linting del código"""
    session.install("flake8", "black", "isort")
    session.run("flake8", ".", external=True)
    session.run("black", "--check", ".", external=True)
    session.run("isort", "--check-only", ".", external=True)


@nox.session(venv_backend="uv")
def format(session: Session) -> None:
    """Formatear código automáticamente"""
    session.install("black", "isort")
    session.run("black", ".", external=True)
    session.run("isort", ".", external=True)


@nox.session(venv_backend="uv")
def clean(session: Session) -> None:
    """Limpiar archivos temporales"""
    import shutil
    import os

    # Limpiar __pycache__
    for root, dirs, files in os.walk("."):
        if "__pycache__" in dirs:
            pycache_path = os.path.join(root, "__pycache__")
            shutil.rmtree(pycache_path)
            print(f"Eliminado: {pycache_path}")

    # Limpiar archivos .pyc
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.endswith(".pyc"):
                pyc_path = os.path.join(root, file)
                os.remove(pyc_path)
                print(f"Eliminado: {pyc_path}")

    print("🧹 Limpieza completada")


@nox.session(venv_backend="uv")
def test_quick(session: Session) -> None:
    """Test rápido básico de conectividad (requiere servidor)"""
    session.install("requests")
    cmd = (
        "import requests; "
        "r = requests.get('http://localhost:5000/docs'); "
        "print(f'Status: {r.status_code}'); "
        "print(r.json())"
    )
    session.run("python", "-c", cmd, external=True)


# Sesión por defecto
nox.options.sessions = ["test_all"]
