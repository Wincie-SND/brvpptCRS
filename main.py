from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from database import cursor, db

app = Flask(__name__)
app.secret_key = "drivelink_secret_key"


# ================= PAGE ROUTES =================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/login")
@app.route("/login.html")
def login_page():
    return render_template("login.html")


@app.route("/portal")
@app.route("/portal.html")
def portal():
    return render_template("portal.html")


@app.route("/tenant")
@app.route("/tenant.html")
def tenant():
    if session.get("role") not in ["tenant_admin", "tenant_staff"]:
        return redirect(url_for("login_page"))

    return render_template("tenant.html")


@app.route("/admin")
@app.route("/admin.html")
def admin():
    if session.get("role") not in ["admin", "super_admin"]:
        return redirect(url_for("login_page"))

    return render_template("admin.html")


@app.route("/vehicle")
@app.route("/vehicle.html")
def vehicle():
    return render_template("vehicle.html")


@app.route("/chat")
@app.route("/chat.html")
def chat():
    if not session.get("user_id"):
        return redirect(url_for("login_page"))

    return render_template("chat.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))


# ================= AUTH API =================

@app.route("/login-user", methods=["POST"])
def login_user():
    email = request.form.get("email", "").strip()
    password = request.form.get("password", "").strip()

    query = """
    SELECT id, tenant_id, fullname, email, role
    FROM users
    WHERE email = %s
    AND password = %s
    LIMIT 1
    """

    cursor.execute(query, (email, password))
    user = cursor.fetchone()

    if not user:
        return "Invalid email or password"

    session["user_id"] = user["id"]
    session["tenant_id"] = user["tenant_id"]
    session["fullname"] = user["fullname"]
    session["email"] = user["email"]
    session["role"] = user["role"]

    role = user["role"]

    if role in ["admin", "super_admin"]:
        return redirect(url_for("admin"))

    if role in ["tenant_admin", "tenant_staff"]:
        return redirect(url_for("tenant"))

    return redirect(url_for("portal"))


@app.route("/me")
def me():
    if not session.get("user_id"):
        return jsonify({"logged_in": False}), 401

    return jsonify({
        "logged_in": True,
        "user_id": session.get("user_id"),
        "tenant_id": session.get("tenant_id"),
        "fullname": session.get("fullname"),
        "email": session.get("email"),
        "role": session.get("role")
    })


# ================= ADMIN API =================

@app.route("/admin/users")
def admin_users():
    if session.get("role") not in ["admin", "super_admin"]:
        return jsonify({"message": "Admin access required"}), 403

    cursor.execute("""
    SELECT users.id, users.fullname, users.email, users.role,
           tenants.business_name
    FROM users
    LEFT JOIN tenants ON users.tenant_id = tenants.tenant_id
    ORDER BY users.id ASC
    """)

    return jsonify(cursor.fetchall())


@app.route("/admin/tenants")
def admin_tenants():
    if session.get("role") not in ["admin", "super_admin"]:
        return jsonify({"message": "Admin access required"}), 403

    cursor.execute("SELECT * FROM tenants ORDER BY tenant_id ASC")
    return jsonify(cursor.fetchall())


# ================= VEHICLE API =================

@app.route("/vehicles")
def vehicles():
    tenant_id = session.get("tenant_id")

    if tenant_id:
        cursor.execute("SELECT * FROM vehicles WHERE tenant_id = %s", (tenant_id,))
    else:
        cursor.execute("SELECT * FROM vehicles")

    return jsonify(cursor.fetchall())


# ================= BOOKING API =================

@app.route("/book", methods=["POST"])
def book_vehicle():
    renter_id = session.get("user_id") or request.form.get("renter_id")
    vehicle_id = request.form.get("vehicle_id")

    if not renter_id:
        return jsonify({"message": "Please log in before booking"}), 401

    query = """
    INSERT INTO bookings (renter_id, vehicle_id, status)
    VALUES (%s, %s, %s)
    """

    cursor.execute(query, (renter_id, vehicle_id, "Pending"))
    db.commit()

    return jsonify({"message": "Booking successful"})


@app.route("/bookings")
def bookings():
    tenant_id = session.get("tenant_id")

    if tenant_id:
        cursor.execute("""
        SELECT bookings.booking_id, bookings.status, bookings.booking_date,
               users.fullname AS renter_name,
               vehicles.vehicle_name
        FROM bookings
        JOIN users ON bookings.renter_id = users.id
        JOIN vehicles ON bookings.vehicle_id = vehicles.vehicle_id
        WHERE vehicles.tenant_id = %s
        ORDER BY bookings.booking_date DESC
        """, (tenant_id,))
    else:
        cursor.execute("""
        SELECT bookings.booking_id, bookings.status, bookings.booking_date,
               users.fullname AS renter_name,
               vehicles.vehicle_name
        FROM bookings
        JOIN users ON bookings.renter_id = users.id
        JOIN vehicles ON bookings.vehicle_id = vehicles.vehicle_id
        ORDER BY bookings.booking_date DESC
        """)

    return jsonify(cursor.fetchall())


# ================= CHAT API =================

@app.route("/send-message", methods=["POST"])
def send_message():
    # IMPORTANT FIX:
    # The sender must come from the logged-in session, not from JavaScript.
    # This prevents tenant messages from being saved as customer messages.
    sender_id = session.get("user_id")
    receiver_id = request.form.get("receiver_id")
    message = request.form.get("message", "").strip()

    if not sender_id:
        return jsonify({"message": "Please log in before sending a message"}), 401

    if not receiver_id or not message:
        return jsonify({"message": "Receiver and message are required"}), 400

    query = """
    INSERT INTO chats (sender_id, receiver_id, message)
    VALUES (%s, %s, %s)
    """

    cursor.execute(query, (sender_id, receiver_id, message))
    db.commit()

    return jsonify({
        "message": "Message sent",
        "sender_id": sender_id,
        "receiver_id": receiver_id
    })


@app.route("/messages")
def messages():
    current_user_id = session.get("user_id")
    other_user_id = request.args.get("user_id")

    if not current_user_id:
        return jsonify({"message": "Please log in first"}), 401

    if other_user_id:
        cursor.execute("""
        SELECT chats.chat_id, chats.sender_id, chats.receiver_id, chats.message,
               chats.sent_at, sender.fullname AS sender_name,
               receiver.fullname AS receiver_name
        FROM chats
        JOIN users AS sender ON chats.sender_id = sender.id
        JOIN users AS receiver ON chats.receiver_id = receiver.id
        WHERE (chats.sender_id = %s AND chats.receiver_id = %s)
           OR (chats.sender_id = %s AND chats.receiver_id = %s)
        ORDER BY chats.sent_at ASC
        """, (current_user_id, other_user_id, other_user_id, current_user_id))
    else:
        cursor.execute("""
        SELECT chats.chat_id, chats.sender_id, chats.receiver_id, chats.message,
               chats.sent_at, sender.fullname AS sender_name,
               receiver.fullname AS receiver_name
        FROM chats
        JOIN users AS sender ON chats.sender_id = sender.id
        JOIN users AS receiver ON chats.receiver_id = receiver.id
        WHERE chats.sender_id = %s OR chats.receiver_id = %s
        ORDER BY chats.sent_at ASC
        """, (current_user_id, current_user_id))

    return jsonify(cursor.fetchall())


# ================= RUN APP =================

if __name__ == "__main__":
    app.run(debug=True)
