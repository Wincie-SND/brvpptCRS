from database import connect_db

class User:

    def add_user(self, name, email, password, role):
        db = connect_db()
        cursor = db.cursor()

        try:
            # Check if user already exists
            cursor.execute(
                "SELECT id FROM users WHERE email = %s",
                (email,)
            )

            existing_user = cursor.fetchone()

            if existing_user:
                print("User already exists!")
                return

            sql = """
            INSERT INTO users
            (name, email, password, role)
            VALUES (%s, %s, %s, %s)
            """

            values = (
                name,
                email,
                password,
                role
            )

            cursor.execute(sql, values)
            db.commit()

            print("User added successfully!")

        except Exception as e:
            print("Error:", e)

        finally:
            cursor.close()
            db.close()

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


    def login_user(self, email):

        conn = connect_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        user = cursor.fetchone()

        cursor.close()
        conn.close()

        return user


    def get_user_profile(self, user_id):

        conn = connect_db()

        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM users WHERE id=%s",
            (user_id,)
        )

        profile = cursor.fetchone()

        cursor.close()
        conn.close()

        return profile


    def update_user_profile(
        self,
        user_id,
        name,
        phone,
        address
    ):

        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute(
        """
        UPDATE users
        SET
        name=%s,
        phone=%s,
        address=%s
        WHERE id=%s
        """,

        (
            name,
            phone,
            address,
            user_id
        )
        )

        conn.commit()
        

        cursor.close()
        conn.close()