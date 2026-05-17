import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="car_rental_system"
)

cursor = db.cursor(dictionary=True)