from database import connect_db


class Vehicle:

    def add_vehicle(
        self,
        brand,
        model,
        price_per_day,
        status
    ):

        conn = connect_db()
        cursor = conn.cursor()

        sql = """
        INSERT INTO vehicles
        (brand, model, price_per_day, status)
        VALUES (%s,%s,%s,%s)
        """

        values = (
            brand,
            model,
            price_per_day,
            status
        )

        cursor.execute(sql, values)

        conn.commit()

        print("Vehicle added!")

        cursor.close()
        conn.close()


    def view_vehicles(self):

        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT * FROM vehicles"
        )

        results = cursor.fetchall()

        for row in results:
            print(row)

        cursor.close()
        conn.close()


    def update_vehicle_status(
        self,
        vehicle_id,
        new_status
    ):

        conn = connect_db()
        cursor = conn.cursor()

        sql = """
        UPDATE vehicles
        SET status=%s
        WHERE id=%s
        """

        values = (
            new_status,
            vehicle_id
        )

        cursor.execute(
            sql,
            values
        )

        conn.commit()

        print(
            "Vehicle status updated!"
        )

        cursor.close()
        conn.close()


    def delete_vehicle(
        self,
        vehicle_id
    ):

        conn = connect_db()

        cursor = conn.cursor()

        sql = """
        DELETE FROM vehicles
        WHERE id=%s
        """

        cursor.execute(
            sql,
            (vehicle_id,)
        )

        conn.commit()

        print(
            "Vehicle deleted!"
        )

        cursor.close()
        conn.close()


    def get_vehicle_by_id(
        self,
        vehicle_id
    ):

        conn = connect_db()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT *
            FROM vehicles
            WHERE id=%s
            """,

            (vehicle_id,)
        )

        vehicle = cursor.fetchone()

        cursor.close()
        conn.close()

        return vehicle


    def show_available_vehicles(self):

        conn = connect_db()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT *
            FROM vehicles
            WHERE status='Available'
            """
        )

        vehicles = cursor.fetchall()

        cursor.close()
        conn.close()

        return vehicles