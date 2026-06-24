from datetime import datetime
from extensions import db

class Order(db.Model):
    __tablename__ = "orders"
    
    id = db.Column(db.Integer, primary_key = True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable = False)
    total_amount = db.Column(db.Float, nullable = False)
    created_at = db.Column(db.DateTime, default = datetime.utcnow)
    customer = db.relationship("Customer", backref = "orders")
    
    def to_dict(self):
        return {
            "id" : self.id,
            "customer_id" : self.customer_id,
            "total_amount" : self.total_amount
        }