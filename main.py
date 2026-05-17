from flask import Flask, render_template, request, jsonify, redirect, url_for
from database import cursor, db

app = Flask(__name__)


# ================= PAGE ROUTES =================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/login")
def login_page():
    return render_template("login.html")


@app.route("/portal")
def portal():
    return render_template("portal.html")


@app.route("/vehicle")
def vehicle():
    return render_template("vehicle.html")


@app.route("/chat")
def chat():
    return render_template("chat.html")


# ================= LOGIN API =================

@app.route("/login-user", methods=["POST"])
def login_user():
    email = request.form["email"]
    password = request.form["password"]

    query = """
    SELECT * FROM users
    WHERE email = %s
    AND password = %s
    """

    cursor.execute(query, (email, password))
    user = cursor.fetchone()

    if user:
        return redirect(url_for("portal"))

    return "Invalid email or password"


# ================= VEHICLE API =================

@app.route("/vehicles")
def vehicles():
    cursor.execute("SELECT * FROM vehicles")
    data = cursor.fetchall()

    return jsonify(data)


# ================= BOOKING API =================

@app.route("/book", methods=["POST"])
def book_vehicle():
    renter_id = request.form["renter_id"]
    vehicle_id = request.form["vehicle_id"]

    query = """
    INSERT INTO bookings
    (renter_id, vehicle_id, status)
    VALUES (%s, %s, %s)
    """

    cursor.execute(query, (renter_id, vehicle_id, "Pending"))
    db.commit()

    return jsonify({
        "message": "Booking successful"
    })


# ================= CHAT API =================

@app.route("/send-message", methods=["POST"])
def send_message():
    sender_id = request.form["sender_id"]
    receiver_id = request.form["receiver_id"]
    message = request.form["message"]

    query = """
    INSERT INTO chats
    (sender_id, receiver_id, message)
    VALUES (%s, %s, %s)
    """

    cursor.execute(query, (sender_id, receiver_id, message))
    db.commit()

    return jsonify({
        "message": "Message sent"
    })


@app.route("/messages")
def messages():
    cursor.execute("SELECT * FROM chats")
    data = cursor.fetchall()

    return jsonify(data)


# ================= RUN APP =================

if __name__ == "__main__":
    app.run(debug=True)