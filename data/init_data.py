from models.users import Admin, Tenant
from models.vehicle_booking import Vehicle


def init_data():
    admins = [
        Admin("admin1", "123")
    ]

    tenants = [
        Tenant("tenant1", "123")
    ]

    vehicles = [
        Vehicle("Toyota", "Vios", 1500),
        Vehicle("Honda", "Civic", 2000)
    ]

    bookings = []

    return admins, tenants, vehicles, bookings