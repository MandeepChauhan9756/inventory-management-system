import re

def validate_customer(data):

    if not data.get("full_name"):
        return "Full name is required"

    email = data.get("email")

    if not email:
        return "Email is required"

    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'

    if not re.match(pattern, email):
        return "Invalid email format"

    if not data.get("phone"):
        return "Phone number is required"

    return None