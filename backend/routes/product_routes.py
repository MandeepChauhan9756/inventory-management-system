from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db
from models.product import Product
from utils.decorators import admin_required
from utils.role_required import role_required
from validators.product_validator import validate_product

product_bp = Blueprint(
    "products",
    __name__,
    url_prefix="/api/products"
)

# Create Product by Admin
@product_bp.route("", methods=["POST"])
@jwt_required()
@role_required("admin")
# @admin_required
def create_product():
    data = request.get_json()
    
    error = validate_product(data)
    if error:
        return jsonify({"error": error}), 400
    
    name = data.get("name")
    sku = data.get("sku")
    price = float(data.get("price")) if data.get("price") is not None else None
    quantity = int(data.get("quantity")) if data.get("quantity") is not None else None
    
    if not all([name, sku]) or price is None or quantity is None:
        return jsonify({
            "error" : "All fields are required"
        }), 400
        
    existing_product = Product.query.filter_by(sku = sku).first()
    if existing_product:
        return jsonify({
            "error": "SKU already exists"
        }), 409
        
    if quantity < 0:
        return jsonify({
            "error" : "Quantity cannot be negative"
        }), 400
        
    if price <= 0:
        return jsonify({
            "error" : "Price must be greater than zero"
        }), 400
        
    product = Product(
        name = name,
        sku = sku,
        price = price,
        quantity = quantity
    )
    
    db.session.add(product)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
    return jsonify(
        product.to_dict()
    ), 201
    
    
# GET Product
@product_bp.route("", methods=["GET"])
def get_products():
    products = Product.query.all()
    
    return jsonify([
        product.to_dict()
        for product in products
    ]), 200
    
# GET Product by ID
@product_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({
            "error" : "Product not found"
        }), 404
        
    return jsonify(
        product.to_dict()
    ), 200
    

# UPDATE Product by ID
@product_bp.route("/<int:product_id>", methods=["PUT"])
@jwt_required()
@role_required("admin")
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({
            "error" : "Product not found"
        }), 404
        
    data = request.get_json()
    print("Incoming Data:", data)
    
    if "price" in data and float(data["price"]) <= 0:
        return jsonify({
            "error" : "Price must be greater than 0"
        }), 400
        
    if "quantity" in data and int(data["quantity"]) < 0:
        return jsonify({
            "error": "Quantity cannot be negative"
        }), 400

    if "name" in data:
        product.name = data["name"]

    if "price" in data:
        product.price = float(data["price"])

    if "quantity" in data:
        product.quantity = int(data["quantity"])
        
    print("After:", product.to_dict())
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
    return jsonify(product.to_dict()), 200

# DELETE product By ID
@product_bp.route("/<int:product_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({
            "error" : "Product not found"
        }), 404
        
    db.session.delete(product)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
    return jsonify({"message" : "Product deleted"}), 200