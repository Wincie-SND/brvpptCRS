from database import connect_db


class Booking:

    def create_booking(self,
                       user_id,
                       vehicle_id,
                       booking_date,
                       return_date):

        conn = connect_db()

        cursor = conn.cursor()

        sql = """
        INSERT INTO bookings
        (user_id,
        vehicle_id,
        booking_date,
        return_date)

        VALUES (%s, %s, %s, %s)
        """

        values = (
            user_id,
            vehicle_id,
            booking_date,
            return_date
        )

        cursor.execute(sql, values)

        update_sql = """
        UPDATE vehicles
        SET status = 'Rented'
        WHERE id = %s
        """

        cursor.execute(update_sql, (vehicle_id,))

        conn.commit()

        print("Booking successful!")

        cursor.close()
        conn.close()

    def view_bookings(self):

        conn = connect_db()

        cursor = conn.cursor()

        sql = """
        SELECT
            bookings.id,
            users.fullname,
            vehicles.brand,
            vehicles.model,
            bookings.booking_date,
            bookings.return_date

        FROM bookings

        JOIN users
        ON bookings.user_id = users.id

        JOIN vehicles
        ON bookings.vehicle_id = vehicles.id
        """

        cursor.execute(sql)

        results = cursor.fetchall()

        for row in results:
            print(row)

        cursor.close()
        conn.close()

    def return_vehicle(self, vehicle_id):

        conn = connect_db()

        cursor = conn.cursor()

        sql = """
        UPDATE vehicles
        SET status = 'Available'
        WHERE id = %s
        """

        cursor.execute(sql, (vehicle_id,))

        conn.commit()

        print("Vehicle returned!")

        cursor.close()
        conn.close()