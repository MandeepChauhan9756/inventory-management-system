from flask import Flask
from config import Config
from extensions import (db, migrate, jwt, bcrypt)
from routes.auth_routes import auth_bp
from models.user import User
from models.product import Product
from routes.product_routes import product_bp
from models.customer import Customer
from routes.customer_routes import customer_bp
from models.order import Order
from models.order_item import OrderItem
from routes.order_routes import order_bp
from utils.error_handlers import register_error_handlers
from flask_cors import CORS
from routes.dashboard_routes import dashboard_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    # CORS(app,
    #     resources={r"/*": {"origins": "*"}},
    #     allow_headers=["Content-type", "Authorization"],
    #     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    # )
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # CORS(app)
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(customer_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(dashboard_bp)
    
    
    @app.route("/")
    def home():
        return { "message": "Inventory Management API Running"}
    return app

app = create_app()

register_error_handlers(app)

if __name__ == "__main__":
    # with app.app_context():
    #     from extensions import db

    #     db.engine.connect()
    #     print("DATABASE CONNECTED")
    app.run(host="0.0.0.0",
            port=5000,
            debug=True)