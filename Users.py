import Vehicle
import Booking

class User:
    def __init__(self, user_id, username, password, phone, role, tenant_id=None):
        self.user_id = user_id
        self.username = username
        self.password = password
        self.phone = phone
        self.role = role
        self.tenant_id = tenant_id

    def view_profile(self):
        print("\n--- PROFILE ---")
        print("ID:", self.user_id)
        print("Username:", self.username)
        print("Phone:", self.phone)
        print("Tenant:", self.tenant_id)



class Tenant:
    def __init__(self, tenant_id, name):
        self.tenant_id = tenant_id
        self.name = name
        self.vehicles = []



class Admin(User):
    def add_vehicle(self, tenants):
        print("\n-- Add Vehicle --")

        for t in tenants:
            print(t.tenant_id, t.name)

        tid = input("Tenant ID: ")

        tenant = next((t for t in tenants if t.tenant_id == tid), None)

        if not tenant:
            print("Tenant not found")
            return

        name = input("Vehicle Name: ")
        price = int(input("Price per day: "))

        vid = f"V{len(tenant.vehicles)+1:03}"
        vehicle = Vehicle(vid, name, price)

        tenant.vehicles.append(vehicle)

        print("Vehicle added")



class Customer(User):
    def view_vehicles(self, tenants):
        print("\n-- Vehicles Available --")

        for t in tenants:
            print("\nCompany:", t.name)
            for v in t.vehicles:
                if v.available:
                    print(v.vehicle_id, v.name, "₱", v.price_per_day)

    def book_vehicle(self, tenants, bookings):
        vid = input("Vehicle ID: ")

        vehicle = None

        for t in tenants:
            for v in t.vehicles:
                if v.vehicle_id == vid and v.available:
                    vehicle = v

        if not vehicle:
            print("Vehicle not found")
            return

        days = int(input("Days to rent: "))

        bid = f"B{len(bookings)+1:03}"

        booking = Booking(bid, self.user_id, vehicle, days)

        bookings.append(booking)

        vehicle.available = False

        print("Booking successful. Total:", booking.total)


