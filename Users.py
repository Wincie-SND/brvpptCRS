class User:
    def __init__(self, user_id, username, password, phone, role):
        self.user_id = user_id
        self.username = username
        self.password = password
        self.phone = phone
        self.role = role

    def view_profile(self):
        print("\n--- PROFILE ---")
        print("ID:", self.user_id)
        print("Username:", self.username)
        print("Phone:", self.phone)



class Admin(User):
    def __init__(self, user_id, username, password, phone):
        super().__init__(user_id, username, password, phone, "admin")

    def add_vehicle(self, tenants):
        print("\n-- Add Vehicle --")
        for t in tenants:
            print(t.user_id, t.name)
        tid = input("Tenant ID: ")
        tenant = next((t for t in tenants if t.user_id == tid), None)
        if not tenant:
            print("Tenant not found")
            return
        name = input("Vehicle Name: ")
        price = int(input("Price per day: "))
        from VehicleAndBooking import Vehicle
        vid = f"V{len(tenant.vehicles)+1:03}"
        vehicle = Vehicle(vid, name, price)
        tenant.vehicles.append(vehicle)
        print("Vehicle added")



class Tenant(User):
    def __init__(self, tenant_id, name, username, password, phone):
        super().__init__(tenant_id, username, password, phone, "tenant")
        self.name = name
        self.vehicles = []

    def view_vehicles(self):
        print("\n-- Vehicles Available --")
        print("\nYour Company:", self.name)
        found = False
        for v in self.vehicles:
            if v.available:
                print(v.vehicle_id, v.name, "₱", v.price_per_day)
                found = True
        if not found:
            print("No vehicles available")

    def book_vehicle(self, bookings):
        from VehicleAndBooking import Booking
        vid = input("Vehicle ID: ")
        vehicle = None
        for v in self.vehicles:
            if v.vehicle_id == vid and v.available:
                vehicle = v
        if not vehicle:
            print("Vehicle not found or unavailable")
            return
        days = int(input("Days to rent: "))
        bid = f"B{len(bookings)+1:03}"
        booking = Booking(bid, self.user_id, vehicle, days)
        bookings.append(booking)
        vehicle.available = False
        print("Booking successful. Total: ₱", booking.total)