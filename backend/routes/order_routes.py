from flask import Blueprint, request, jsonify
from extensions import db
from models.customer import Customer
from models.product import Product
from models.order import Order
from models.order_item import OrderItem
from flask_jwt_extended import jwt_required
from utils.role_required import role_required
from validators.order_validator import validate_order

order_bp = Blueprint(
    "orders",
    __name__,
    url_prefix="/api/orders"
)

@order_bp.route("", methods=["POST"])
@jwt_required()
def create_order():
    data = request.get_json()
    
    error = validate_order(data)
    if error:
        return jsonify({"error": error}), 400
    
    customer_id = data.get("customer_id")
    items = data.get("items")
    
    if not customer_id or not items:
        return jsonify({
            "error" : "Customer and items are required"
        }), 400
        
    customer = Customer.query.get(customer_id)
    
    if not customer:
        return jsonify({
            "error" : "Customer not found"
        }), 404
        
    total_amount = 0
    
    order = Order(customer_id = customer_id, total_amount = 0)
    db.session.add(order)
    db.session.flush()
    
    for item in items:
        print("ITEM:", item)
        print("TYPE:", type(item))
        product_id = item.get("product_id")
        quantity = item.get("quantity")
        
        product = Product.query.get(product_id)
        if not product:
            return jsonify({
                "error" : f"Product {product_id} not found"
            }), 404
            
        if quantity <= 0:
            return jsonify({
                "error" : "Quantity must be greater than zero"
            }), 400
            
        if product.quantity < quantity:
            return jsonify({
                "error" : f"Insufficient inventory for {product.name}"
            }), 400
            
        product.quantity -= quantity
        item_total = product.price * quantity
        total_amount +=item_total
        order_item = OrderItem(
            order_id = order.id,
            product_id = product.id,
            quantity = quantity,
            price_at_purchase = product.price
        )
        
        db.session.add(order_item)
        
    order.total_amount = total_amount
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
    return jsonify({
        "message" : "Order created successfully",
        "order_id" : order.id,
        "total_amount" : total_amount
    }), 201
    
    
@order_bp.route("", methods=["GET"])
@jwt_required()
def get_orders():
    orders = Order.query.all()
    result = []
    for order in orders:
        result.append({
            "id" : order.id,
            "customer_id" : order.customer_id,
            "customer_name" : order.customer.full_name,
            "total_amount" : order.total_amount,
            "items" : [
                {
                    "product_id" : item.product_id,
                    "product_name" : item.product.name,
                    "quantity" : item.quantity,
                    "price" : item.price_at_purchase
                }
                for item in order.items
            ]
        })
        
    return jsonify(result), 200


@order_bp.route("/<int:order_id>", methods=["GET"])
def get_order(order_id):
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({"error" : "Order not found"}), 404
    
    return jsonify({
        "id" : order.id,
        "customer" : {
            "id" : order.customer.id,
            "name" : order.customer.full_name,
            "email" : order.customer.email
        },
        "total_amount" : order.total_amount,
        "items" : [
            {
                "product": item.product.name,
                "quantity": item.quantity,
                "price": item.price_at_purchase
            }
            for item in order.items
        ]
    }), 200
    
    
@order_bp.route("/<int:order_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_order(order_id):
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    # restore stock
    for item in order.items:
        product = Product.query.get(item.product_id)
        product.quantity += item.quantity
        
    # delete order items first
    for item in order.items:
        db.session.delete(item)

    db.session.delete(order)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
    return jsonify({"message": "Order deleted and stock restored"}), 200