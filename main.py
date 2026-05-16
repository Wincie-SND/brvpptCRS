from models.users import Admin, Tenant
from models.vehicle_booking import Vehicle, Booking
from systems.chat_system import ChatSystem
from data.init_data import init_data

admins, tenants, vehicles, bookings = init_data()

chat_system = ChatSystem()

def main_menu():
    while True:
        print("\n==== TERMINAL SYSTEM ====")
        print("1. View Vehicles")
        print("2. Chat")
        print("3. Exit")

        choice = input("Enter choice: ")

        if choice == "1":
            for vehicle in vehicles:
                print(vehicle)

        elif choice == "2":
            sender = input("Sender: ")
            message = input("Message: ")

            chat_system.send_message(sender, message)
            chat_system.display_messages()

        elif choice == "3":
            print("Exiting...")
            break

        else:
            print("Invalid choice")


main_menu()