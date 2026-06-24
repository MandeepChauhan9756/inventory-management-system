from flask import Blueprint, request, jsonify
from extensions import db
from models.customer import Customer
from flask_jwt_extended import jwt_required
from utils.role_required import role_required
from validators.customer_validator import validate_customer

customer_bp = Blueprint(
    "customers",
    __name__,
    url_prefix= "/api/customers"
)

# Create Customer API
@customer_bp.route("", methods=["POST"])
@jwt_required()
@role_required("admin")
def create_customer():
    data = request.get_json()
    
    error = validate_customer(data)
    if error:
        return jsonify({"error": error}), 400
    
    full_name = data.get("full_name")
    email = data.get("email")
    phone = data.get("phone")
    
    if not full_name or not email or not phone:
        return jsonify({
            "error" : "All fields are required"
        }), 400
        
    existing_customer = Customer.query.filter_by( email = email).first()
    if existing_customer:
        return jsonify({
            "error" : "Email already exists"
        }), 409
        
    customer = Customer(
        full_name = full_name,
        email = email,
        phone = phone
    )
    
    db.session.add(customer)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
    return jsonify(
        customer.to_dict()
    ), 201
    
    
# Get All Customers
@customer_bp.route("", methods=["GET"])
def get_customers():
    customers = Customer.query.all()
    return jsonify([
        customer.to_dict()
        for customer in customers
    ]), 200
    

# Get Customer By ID
@customer_bp.route("/<int:customer_id>", methods=["GET"])
def get_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({
            "error" : "Customer not found"
        }), 404
        
    return jsonify(
        customer.to_dict()
    ), 200
    

# Delete Customer
@customer_bp.route("/<int:customer_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({
            "error" : "Customer not found"
        }), 404
        
    db.session.delete(customer)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
    return jsonify({
        "message" : "Customer deleted"
    }), 200
    
    
@customer_bp.route("/<int:customer_id>", methods=["PUT"])
@jwt_required()
@role_required("admin")
def update_customer(customer_id):
    customer = Customer.query.get(customer_id)
    
    if not customer:
        return jsonify({
            "error": "Customer not found"
        }), 404
        
    data = request.get_json()
    
    full_name = data.get("full_name")
    email = data.get("email")
    phone = data.get("phone")
    
    if not full_name or not email or not phone:
        return jsonify({
            "error" : "All fields are required"
        }), 400
        
        
    existing_customer = Customer.query.filter(
        Customer.email == email,
        Customer.id != customer_id
    ).first()
    
    if existing_customer:
        return jsonify({
            "error": "Email already exists"
        }), 409
        
        
    customer.full_name = full_name
    customer.email = email
    customer.phone = phone
    
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({
            "error": "Database error"
        }), 500
        
    return jsonify(
        customer.to_dict()
    ), 200