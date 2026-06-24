def validate_order(data):

    if not data.get("customer_id"):
        return "Customer ID is required"

    items = data.get("items")

    if not items:
        return "Order items are required"

    if not isinstance(items, list):
        return "Items must be a list"

    for item in items:

        if not item.get("product_id"):
            return "Product ID is required"

        quantity = item.get("quantity")

        if quantity is None:
            return "Quantity is required"

        if quantity <= 0:
            return "Quantity must be greater than zero"

    return None