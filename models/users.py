from database import connect_db

class User:

    def add_user(self, fullname, username, password, role):

        conn = connect_db()
        cursor = conn.cursor()

        sql = """
        INSERT INTO users(fullname, username, password, role)
        VALUES (%s, %s, %s, %s)
        """

        values = (fullname, username, password, role)

        cursor.execute(sql, values)

        conn.commit()

        print("User added successfully!")

        cursor.close()
        conn.close()

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