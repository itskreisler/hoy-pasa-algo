import nox


# Configuración para usar uv venv
nox.options.sessions = ["lint", "test_orm", "test_api", "test_soft_delete", "test_all"]


@nox.session(venv_backend="uv")
def lint(session):
    """Ejecutar linting y formateo de código"""
    session.install("flake8", "black", "isort")
    
    # Formatear código
    session.run("black", ".", "--check")
    session.run("isort", ".", "--check-only")
    
    # Linting
    session.run("flake8", ".", "--max-line-length=100", "--extend-ignore=E203,W503")


@nox.session(venv_backend="uv")
def format(session):
    """Formatear código automáticamente"""
    session.install("black", "isort")
    
    session.run("black", ".")
    session.run("isort", ".")


@nox.session(venv_backend="uv")
def test_orm(session):
    """Test completo del ORM con verificación de IDs y relaciones"""
    session.install("-e", ".")
    session.install("pytest", "requests")
    
    # Ejecutar test del ORM
    session.run("python", "test_orm_final.py")


@nox.session(venv_backend="uv")
def test_api(session):
    """Test completo del flujo de la API (requiere servidor corriendo)"""
    session.install("-e", ".")
    session.install("pytest", "requests")
    
    session.notify("start_server")  # Notificar que se necesita servidor
    
    # Ejecutar test completo de API
    session.run("python", "test_api_complete.py")


@nox.session(venv_backend="uv")
def test_soft_delete(session):
    """Test específico del sistema de soft delete"""
    session.install("-e", ".")
    session.install("pytest", "requests")
    
    session.notify("start_server")  # Notificar que se necesita servidor
    
    # Ejecutar test de soft delete
    session.run("python", "test_soft_delete.py")


@nox.session(venv_backend="uv")
def start_server(session):
    """Iniciar servidor Flask para tests de API"""
    session.install("-e", ".")
    session.install("flask", "pydantic")
    
    print("🚀 Iniciando servidor Flask en puerto 5000...")
    print("📋 Asegúrate de que el puerto 5000 esté libre")
    print("🔄 El servidor se iniciará en modo debug")
    
    # Iniciar servidor
    session.run("python", "main.py")


@nox.session(venv_backend="uv")
def test_all(session):
    """Ejecutar todos los tests (ORM + API + Soft Delete)"""
    session.install("-e", ".")
    session.install("pytest", "requests")
    
    print("🧪 EJECUTANDO TODOS LOS TESTS")
    print("=" * 50)
    
    # 1. Test ORM (no requiere servidor)
    print("\n🔧 1. Testing ORM...")
    try:
        session.run("python", "test_orm_final.py")
        print("✅ Test ORM: PASSED")
    except Exception as e:
        print(f"❌ Test ORM: FAILED - {e}")
        
    # 2. Test API (requiere servidor manual)
    print("\n📡 2. Testing API...")
    print("⚠️  NOTA: Este test requiere que el servidor esté corriendo")
    print("   Ejecuta en otra terminal: nox -s start_server")
    print("   Luego presiona Enter para continuar...")
    input()
    
    try:
        session.run("python", "test_api_complete.py")
        print("✅ Test API: PASSED")
    except Exception as e:
        print(f"❌ Test API: FAILED - {e}")
        
    # 3. Test Soft Delete
    print("\n🗑️  3. Testing Soft Delete...")
    try:
        session.run("python", "test_soft_delete.py")
        print("✅ Test Soft Delete: PASSED")
    except Exception as e:
        print(f"❌ Test Soft Delete: FAILED - {e}")
    
    print("\n🏁 TODOS LOS TESTS COMPLETADOS")


@nox.session(venv_backend="uv")
def dev_setup(session):
    """Configurar entorno de desarrollo"""
    session.install("-e", ".")
    session.install(
        "flask", "pydantic", "requests", 
        "black", "isort", "flake8", 
        "pytest"
    )
    
    print("✅ Entorno de desarrollo configurado")
    print("📋 Comandos disponibles:")
    print("   nox -s lint        # Linting")
    print("   nox -s format      # Formatear código")
    print("   nox -s test_orm    # Test ORM")
    print("   nox -s test_api    # Test API")
    print("   nox -s test_all    # Todos los tests")
    print("   nox -s start_server # Iniciar servidor")


@nox.session(venv_backend="uv")
def clean(session):
    """Limpiar archivos temporales y cache"""
    import os
    import shutil
    
    # Limpiar __pycache__
    for root, dirs, files in os.walk("."):
        for dir_name in dirs:
            if dir_name == "__pycache__":
                cache_path = os.path.join(root, dir_name)
                print(f"🗑️  Eliminando: {cache_path}")
                shutil.rmtree(cache_path)
    
    # Limpiar archivos CSV de test
    test_files = [
        "db/data/test_usuarios.csv",
        "db/data/test_eventos.csv", 
        "db/data/test_categories.csv",
        "db/data/test_favorites.csv"
    ]
    
    for file_path in test_files:
        if os.path.exists(file_path):
            print(f"🗑️  Eliminando: {file_path}")
            os.remove(file_path)
    
    print("✅ Limpieza completada")
