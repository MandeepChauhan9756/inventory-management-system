from datetime import datetime
from extensions import db

class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(200), nullable = False)
    sku = db.Column(db.String(100), unique = True, nullable = False)
    price = db.Column(db.Float, nullable = False, default = 0)
    quantity = db.Column(db.Integer, nullable = False, default = 0)
    created_at = db.Column(db.DateTime, default = datetime.utcnow)
    
    def to_dict(self):
        return {
            "id" : self.id,
            "name" : self.name,
            "sku" : self.sku,
            "price" : self.price,
            "quantity" : self.quantity
        }