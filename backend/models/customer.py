from datetime import datetime
from extensions import db

class Customer(db.Model):
    __tablename__ = "customers"
    
    id = db.Column(db.Integer, primary_key = True)
    full_name = db.Column(db.String(200), nullable = False)
    email = db.Column(db.String(150), unique = True, nullable = False)
    phone = db.Column(db.String(20), nullable = False)
    created_at = db.Column(db.DateTime, default = datetime.utcnow)
    
    def to_dict(self):
        return {
            "id" : self.id,
            "full_name" : self.full_name,
            "email" : self.email,
            "phone" : self.phone
        }