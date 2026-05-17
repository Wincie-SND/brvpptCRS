from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
import mysql.connector

def connect_db():

    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="car_rental_system"
    )

    return connection   