from flask import jsonify

def validate_product(data):

    if not data.get("name"):
        return "Product name is required"

    if not data.get("sku"):
        return "SKU is required"

    price = data.get("price")

    if price is None:
        return "Price is required"

    if float(price) <= 0:
        return "Price must be greater than 0"

    quantity = data.get("quantity")

    if quantity is None:
        return "Quantity is required"

    if int(quantity) < 0:
        return "Quantity cannot be negative"

    return None