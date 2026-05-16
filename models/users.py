class User:
    def __init__(self, username, password):
        self.username = username
        self.password = password

    def login(self):
        print(f"{self.username} logged in")


class Admin(User):
    def __init__(self, username, password):
        super().__init__(username, password)

    def manage_system(self):
        print("Admin managing system")


class Tenant(User):
    def __init__(self, username, password):
        super().__init__(username, password)

    def rent_vehicle(self):
        print("Tenant renting vehicle")