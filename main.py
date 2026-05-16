from models.user import User
from models.vehicle import Vehicle
from models.booking import Booking


user = User()
vehicle = Vehicle()
booking = Booking()


# =========================
# ADD USERS
# =========================

user.add_user(
    "Juan Dela Cruz",
    "juan123",
    "12345",
    "tenant"
)

user.add_user(
    "Admin User",
    "admin",
    "admin123",
    "admin"
)


# =========================
# ADD VEHICLES
# =========================

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


# =========================
# VIEW USERS
# =========================

print("\nUSERS")
user.view_users()


# =========================
# VIEW VEHICLES
# =========================

print("\nVEHICLES")
vehicle.view_vehicles()


# =========================
# CREATE BOOKING
# =========================

booking.create_booking(
    1,
    1,
    "2026-05-16",
    "2026-05-20"
)


# =========================
# VIEW BOOKINGS
# =========================

print("\nBOOKINGS")
booking.view_bookings()