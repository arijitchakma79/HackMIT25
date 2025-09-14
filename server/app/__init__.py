from flask import Flask
from flask_cors import CORS
from .routes import suna
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Import and register routes
    app.register_blueprint(suna, url_prefix="/api")

    return app
