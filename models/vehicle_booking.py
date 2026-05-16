class Vehicle:
    def __init__(self, brand, model, price):
        self.brand = brand
        self.model = model
        self.price = price

    def __str__(self):
        return f"{self.brand} {self.model} - ₱{self.price}"


class Booking:
    def __init__(self, tenant, vehicle):
        self.tenant = tenant
        self.vehicle = vehicle

    def show_booking(self):
        print(f"{self.tenant.username} booked {self.vehicle.brand}")