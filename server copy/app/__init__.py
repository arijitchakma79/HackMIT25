from flask import Flask
from flask_cors import CORS
from .routes import suna

def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Import and register routes
    app.register_blueprint(suna, url_prefix="/api")

    return app
