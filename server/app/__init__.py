from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Import and register routes
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    return app
