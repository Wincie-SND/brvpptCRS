from database import connect_db


class User:

    def add_user(self, name,
                 password,
                 role):

        conn = connect_db()

        cursor = conn.cursor()

        sql = """
        INSERT INTO users
        (name, password, role)
        VALUES (%s, %s, %s)
        """

        values = (
            name,
            password,
            role
        )

        cursor.execute(sql, values)

        conn.commit()

        print("User added successfully!")

        cursor.close()
        conn.close()

    def view_users(self):

        conn = connect_db()

        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users")

        results = cursor.fetchall()

        for row in results:
            print(row)

        cursor.close()
        conn.close()

    def delete_user(self, user_id):

        conn = connect_db()

        cursor = conn.cursor()

        sql = "DELETE FROM users WHERE id = %s"

        cursor.execute(sql, (user_id,))

        conn.commit()

        print("User deleted!")

        cursor.close()
        conn.close()