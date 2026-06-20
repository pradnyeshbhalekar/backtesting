from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Create all tables on startup
    from app.config.db import init_db
    init_db()

    # Register blueprints
    from app.routes.health import health_bp
    from app.routes.data import data_bp
    app.register_blueprint(health_bp)
    app.register_blueprint(data_bp)

    return app
