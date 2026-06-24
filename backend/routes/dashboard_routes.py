from flask import Blueprint, jsonify
from models.product import Product
from models.customer import Customer
from models.order import Order
from flask_jwt_extended import jwt_required
from models.order import Order
from extensions import db

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")

@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    
    total_products = Product.query.count()
    total_customers = Customer.query.count()
    total_orders = Order.query.count()
    
    low_stock = Product.query.filter(Product.quantity < 5).all()
    total_revenue = db.session.query(
        db.func.sum(Order.total_amount)
    ).scalar() or 0
    return jsonify({
        "total_products" : total_products,
        "total_customers" : total_customers,
        "total_orders" : total_orders,
        "total_revenue" : total_revenue,
        "low_stock" : [p.to_dict() for p in low_stock]
    }), 200