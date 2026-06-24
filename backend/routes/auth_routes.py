from flask import Blueprint
from flask import request
from flask import jsonify
from extensions import db, bcrypt

from flask_jwt_extended import ( create_access_token, jwt_required, get_jwt_identity )
from models.user import User

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    if not username or not email or not password:
        return jsonify({
            "error" : "All fields are required"
        }),400
        
    existing_user = User.query.filter_by(
        email = email
    ).first()
    
    if existing_user:
        return jsonify({
            "error": "Email already exists"
        }), 409
        
    hashed_password = bcrypt.generate_password_hash(
        password
    ).decode("utf-8")
    
    user = User(
        username = username,
        email = email,
        password_hash = hashed_password,
        role = "staff"
    )
    
    db.session.add(user)
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
    return jsonify({
        "message" : "User registered successfully"
    }), 201
    
    
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    user = User.query.filter_by( email = email ).first()
    
    if not user:
        return jsonify({
            "error" : "Invalid credentials"
        }), 401
        
    valid_password = bcrypt.check_password_hash(
        user.password_hash,
        password
    )
    
    if not valid_password:
        return jsonify({
            "error" : "Invalid credentials"
        }), 401
        
    token = create_access_token(
        identity = str(user.id),
        additional_claims = { "role": user.role }
    )
    
    return jsonify({
        "token" : token,
        "user" : user.to_dict()
    }), 200
    
    
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    user_id = get_jwt_identity()

    user = User.query.get(int(user_id))

    if not user:
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify(user.to_dict()), 200