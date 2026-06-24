from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import jsonify

def role_required(required_role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()   # ✅ FIXED (CALL FUNCTION)

                claims = get_jwt()
                
                if not claims:
                    return jsonify({"error": "Invalid token"}), 401

                if claims.get("role") != required_role:
                    return jsonify({
                        "error": "Access denied"
                    }), 403
                    
            except Exception as e:
                return jsonify({"error": str(e)}), 401

            return fn(*args, **kwargs)

        return decorator
    return wrapper