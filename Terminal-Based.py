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


class ChatMessage:
    def __init__(self, sender, receiver, message):
        self.sender = sender
        self.receiver = receiver
        self.message = message


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


class ChatSystem:
    @staticmethod
    def send_message(messages, sender, receiver):
        msg = input("Message: ")
        messages.append(ChatMessage(sender, receiver, msg))

    @staticmethod
    def view_messages(messages, user):
        print("\n--- CHAT ---")

        for m in messages:
            if m.receiver == user or m.sender == user:
                print(f"{m.sender} -> {m.receiver}: {m.message}")

admins = [Admin("A001", "admin", "admin", "09123456789", "admin")]
customers = []
tenants = [
    Tenant("T001", "City Car Rentals"),
    Tenant("T002", "Leyte Auto Hire")
]

bookings = []
messages = []


tenants[0].vehicles.append(Vehicle("V001", "Toyota Vios", 1500))
tenants[0].vehicles.append(Vehicle("V002", "Honda City", 1700))
tenants[1].vehicles.append(Vehicle("V003", "Toyota Fortuner", 3500))



while True:

    print("\n--- Car Rental System ---")
    print("1 Register")
    print("2 Login Customer")
    print("3 Login Admin")
    print("4 Exit")

    choice = input("Choice: ")

    if choice == "1":

        uname = input("Username: ")
        pwd = input("Password: ")
        phone = input("Phone: ")

        uid = f"C{len(customers)+1:03}"

        customers.append(Customer(uid, uname, pwd, phone, "customer"))

        print("Account created")


    elif choice == "2":

        uname = input("Username: ")
        pwd = input("Password: ")

        user = next((u for u in customers if u.username == uname and u.password == pwd), None)

        if not user:
            print("Login failed")
            continue

        while True:

            print("\n--- Customer Menu ---")
            print("1 View Vehicles")
            print("2 Book Vehicle")
            print("3 Chat with Admin")
            print("4 View Messages")
            print("5 Logout")

            c = input("Choice: ")

            if c == "1":
                user.view_vehicles(tenants)

            elif c == "2":
                user.book_vehicle(tenants, bookings)

            elif c == "3":
                ChatSystem.send_message(messages, user.username, "admin")

            elif c == "4":
                ChatSystem.view_messages(messages, user.username)

            elif c == "5":
                break


    elif choice == "3":

        uname = input("Admin username: ")
        pwd = input("Password: ")

        admin = next((a for a in admins if a.username == uname and a.password == pwd), None)

        if not admin:
            print("Login failed")
            continue

        while True:

            print("\n--- Admin Menu ---")
            print("1 Add Vehicle")
            print("2 View Messages")
            print("3 Reply Chat")
            print("4 Logout")

            a = input("Choice: ")

            if a == "1":
                admin.add_vehicle(tenants)

            elif a == "2":
                ChatSystem.view_messages(messages, "admin")

            elif a == "3":
                receiver = input("Reply to username: ")
                ChatSystem.send_message(messages, "admin", receiver)

            elif a == "4":
                break

    elif choice == "4":
        break