class Booking:
    def __init__(self, booking_id, user_id, vehicle, days):
        self.booking_id = booking_id
        self.user_id = user_id
        self.vehicle = vehicle
        self.days = days
        self.total = vehicle.price_per_day * days
        self.status = "Pending"

bookings = []