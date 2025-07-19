def main():
    from flask import Flask
    from routes.events import events_bp

    app = Flask(__name__)

    # Register the events blueprint
    app.register_blueprint(events_bp)

    @app.route("/")
    def index():
        return "Welcome to the Events API!"

    # Run the application
    app.run(debug=True)


if __name__ == "__main__":
    main()
