from database import db

class Tenant(db.Model):
    __tablename__ = "tenants"

    tenant_id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    status = db.Column(db.String(20))
    tenant_key = db.Column(db.String(50))
