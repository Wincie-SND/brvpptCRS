from flask import Flask, render_template, jsonify
from flask_cors import CORS
from database import db

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost/car_rental_system"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


@app.route("/")
@app.route("/index.html")
def index():
    return render_template("index.html")


@app.route("/login")
@app.route("/login.html")
def login():
    return render_template("login.html")


@app.route("/portal")
@app.route("/portal.html")
def portal():
    return render_template("portal.html")


@app.route("/tenant")
@app.route("/tenant.html")
def tenant():
    return render_template("tenant.html")


@app.route("/admin")
@app.route("/admin.html")
def admin():
    return render_template("admin.html")


@app.route("/drivelink")
@app.route("/Drivelink.html")
def drivelink():
    return render_template("Drivelink.html")


@app.route("/health")
def health():
    return jsonify({"status": "ok", "app": "DriveLink Flask frontend"})


if __name__ == "__main__":
    app.run(debug=True)