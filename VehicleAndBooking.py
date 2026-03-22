class Vehicle:
    def __init__(self, vehicle_id, name, price_per_day):
        self.vehicle_id = vehicle_id
        self.name = name
        self.price_per_day = price_per_day
        self.available = True



class Booking:
    def __init__(self, booking_id, user_id, vehicle, days):
        self.booking_id = booking_id
        self.user_id = user_id
        self.vehicle = vehicle
        self.days = days
        self.total = vehicle.price_per_day * days
        self.status = "Pending"