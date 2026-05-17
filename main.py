from flask import Flask,render_template
from database import db

app=Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI']="mysql+pymysql://root:@localhost/car_rental_system"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False

db.init_app(app)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/portal")
def portal():
    return render_template("portal.html")


@app.route("/drivelink")
def drivelink():
    return render_template("Drivelink.html")


if __name__=="__main__":
    app.run(debug=True)