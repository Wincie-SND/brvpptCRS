from Users import Admin, Tenant
from ChatSystem import ChatSystem
from data import init_data

admins, tenants, bookings, messages = init_data()

def main_menu():
    print("\n--- MAIN MENU ---")
    print("1 Login Tenant")
    print("2 Login Admin") 
    print("3 Exit")
    return input("Choice: ")

def tenant_menu():
    print("\n--- Tenant Menu ---")
    print("1 View Vehicles")
    print("2 Book Vehicle")
    print("3 Chat with Admin")
    print("4 View Messages")
    print("5 Logout")
    return input("Choice: ")

def admin_menu():
    print("\n--- Admin Menu ---")
    print("1 Add Vehicle")
    print("2 View Messages")
    print("3 Reply Chat")
    print("4 Logout")
    return input("Choice: ")

print("Car Rental System - Modular (Tenant in user.py)")

while True:
    choice = main_menu()
    
    if choice == "1":  # Tenant login
        uname = input("Username: ")
        pwd = input("Password: ")
        tenant = next((t for t in tenants if t.username == uname and t.password == pwd), None)
        if not tenant:
            print("Login failed")
            continue
        
        while True:
            c = tenant_menu()
            if c == "1":
                tenant.view_vehicles()
            elif c == "2":
                tenant.book_vehicle(bookings)
            elif c == "3":
                ChatSystem.send_message(messages, tenant.username, "admin")
            elif c == "4":
                ChatSystem.view_messages(messages, tenant.username)
            elif c == "5":
                break
    
    elif choice == "2":  # Admin login
        uname = input("Admin username: ")
        pwd = input("Password: ")
        admin = next((a for a in admins if a.username == uname and a.password == pwd), None)
        if not admin:
            print("Login failed")
            continue
        
        while True:
            a = admin_menu()
            if a == "1":
                admin.add_vehicle(tenants)
            elif a == "2":
                ChatSystem.view_messages(messages, "admin")
            elif a == "3":
                receiver = input("Reply to tenant username: ")
                ChatSystem.send_message(messages, "admin", receiver)
            elif a == "4":
                break
    
    elif choice == "3":
        print("Goodbye!")
        break