from flask import Flask, render_template, request, jsonify
from database import cursor, db

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/signin")
def signin_page():
    return render_template("login.html")


@app.route("/portal")
def portal_page():
    return render_template("portal.html")


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or request.form
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    query = """
        SELECT id, tenant_id, fullname, email, role
        FROM users
        WHERE email = %s AND password = %s
    """
    cursor.execute(query, (email, password))
    user = cursor.fetchone()

    if user:
        return jsonify({"success": True, "message": "Login Success", "user": user})

    return jsonify({"success": False, "message": "Invalid Account"}), 401


@app.route("/api/vehicles", methods=["GET"])
def vehicles():
    tenant_id = request.args.get("tenant_id")

    if tenant_id:
        cursor.execute("SELECT * FROM vehicles WHERE tenant_id = %s", (tenant_id,))
    else:
        cursor.execute("SELECT * FROM vehicles")

    return jsonify(cursor.fetchall())


@app.route("/api/bookings", methods=["GET", "POST"])
def bookings():
    if request.method == "GET":
        cursor.execute("""
            SELECT b.booking_id, b.status, u.fullname AS renter_name,
                   v.vehicle_name, v.price
            FROM bookings b
            JOIN users u ON b.renter_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.vehicle_id
            ORDER BY b.booking_id DESC
        """)
        return jsonify(cursor.fetchall())

    data = request.get_json(silent=True) or request.form
    renter_id = data.get("renter_id")
    vehicle_id = data.get("vehicle_id")

    if not renter_id or not vehicle_id:
        return jsonify({"success": False, "message": "renter_id and vehicle_id are required"}), 400

    cursor.execute(
        "INSERT INTO bookings (renter_id, vehicle_id, status) VALUES (%s, %s, %s)",
        (renter_id, vehicle_id, "Pending")
    )
    db.commit()

    return jsonify({"success": True, "message": "Booking Successful"})


@app.route("/api/chats", methods=["GET", "POST"])
def chats():
    if request.method == "GET":
        cursor.execute("""
            SELECT c.chat_id, c.sender_id, c.receiver_id, c.message,
                   s.fullname AS sender_name, r.fullname AS receiver_name
            FROM chats c
            JOIN users s ON c.sender_id = s.id
            JOIN users r ON c.receiver_id = r.id
            ORDER BY c.chat_id ASC
        """)
        return jsonify(cursor.fetchall())

    data = request.get_json(silent=True) or request.form
    sender_id = data.get("sender_id")
    receiver_id = data.get("receiver_id")
    message = data.get("message")

    if not sender_id or not receiver_id or not message:
        return jsonify({"success": False, "message": "sender_id, receiver_id, and message are required"}), 400

    cursor.execute(
        "INSERT INTO chats (sender_id, receiver_id, message) VALUES (%s, %s, %s)",
        (sender_id, receiver_id, message)
    )
    db.commit()

    return jsonify({"success": True, "message": "Message sent"})


if __name__ == "__main__":
    app.run(debug=True)
