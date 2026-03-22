from Users import Admin
from Users import Tenant

def init_data():
    admins = [Admin("A001", "admin", "admin", "09123456789", "admin")]
    tenants = [
        Tenant("T001", "Wincie Jade Breva", "customer1", "pass123", "09171234567"),
        Tenant("T002", "Angela Pepito", "customer2", "pass321", "09182345678")
    ]

    bookings = []
    messages = []
    return admins, tenants, bookings, messages