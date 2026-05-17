from flask import Flask, render_template
from database import db

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:@localhost/car_rental_system"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


@app.route("/")
@app.route("/index.html")
def home():
    return render_template("index.html")


@app.route("/login")
@app.route("/login.html")
def login():
    return render_template("login.html")


@app.route("/portal")
@app.route("/portal.html")
def portal():
    return render_template("portal.html")


@app.route("/drivelink")
@app.route("/Drivelink.html")
def drivelink():
    return render_template("Drivelink.html")


if __name__ == "__main__":
    app.run(debug=True)