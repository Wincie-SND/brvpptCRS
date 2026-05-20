from models.user import User
from models.vehicle import Vehicle
from models.booking import Booking


user = User()
vehicle = Vehicle()
booking = Booking()



user.add_user(
    "Juan Dela Cruz",
    "juan@gmail.com",
    "12345",
    "tenant"
)

user.add_user(
    "Admin User",
    "admin@gmail.com",
    "admin123",
    "admin"
)



vehicle.add_vehicle(
    "Toyota",
    "Vios",
    1500,
    "Available"
)

vehicle.add_vehicle(
    "Honda",
    "Civic",
    2500,
    "Available"
)


print("\nUSERS")
user.view_users()



print("\nVEHICLES")
vehicle.view_vehicles()


booking.create_booking(
    1,
    1,
    "2026-05-16",
    "2026-05-20"
)


print("\nBOOKINGS")
booking.view_bookings()