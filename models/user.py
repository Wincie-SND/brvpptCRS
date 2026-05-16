from database import connect_db


class User:

    def add_user(self, fullname,
                 username,
                 password,
                 role):

        conn = connect_db()

        cursor = conn.cursor()

        sql = """
        INSERT INTO users
        (fullname, username, password, role)
        VALUES (%s, %s, %s, %s)
        """

        values = (
            fullname,
            username,
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