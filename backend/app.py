from factory import create_app

# Crear la aplicación usando el factory pattern
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
