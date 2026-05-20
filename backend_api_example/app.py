from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector  
from werkzeug.security import check_password_hash

app = Flask(__name__)
CORS(app)

def db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="car_rental_system"
    )

@app.get("/api/vehicles")
def vehicles():
    con = db()
    cur = con.cursor(dictionary=True)
    cur.execute("""
        SELECT v.*, t.company_name AS tenant_name
        FROM vehicles v
        LEFT JOIN tenants t ON t.tenant_id = v.tenant_id
        WHERE v.status = 'available'
    """)
    rows = cur.fetchall()
    cur.close()
    con.close()
    return jsonify(rows)

@app.post("/api/login")
def login():
    data = request.json or {}
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")
    tenant_key = data.get("tenant_key", "").upper().strip()

    con = db()
    cur = con.cursor(dictionary=True)
    cur.execute("""
        SELECT u.*, t.tenant_key, t.company_name
        FROM users u
        LEFT JOIN tenants t ON t.tenant_id = u.tenant_id
        WHERE u.email = %s
        LIMIT 1
    """, (email,))
    user = cur.fetchone()
    cur.close()
    con.close()

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Replace this temporary plain check with check_password_hash once passwords are hashed.
    if user.get("password") != password:
        return jsonify({"error": "Invalid email or password"}), 401

    if user["role"] in ("tenant_admin", "tenant_staff") and user.get("tenant_key") != tenant_key:
        return jsonify({"error": "Invalid tenant key"}), 401

    user.pop("password", None)
    return jsonify({"user": user})

@app.get("/api/users/<int:user_id>/chats")
def user_chats(user_id):
    con = db()
    cur = con.cursor(dictionary=True)
    cur.execute("""
        SELECT c.chat_id, c.tenant_id, t.company_name AS tenant_name, c.created_at
        FROM chats c
        LEFT JOIN tenants t ON t.tenant_id = c.tenant_id
        WHERE c.customer_id = %s
        ORDER BY c.created_at DESC
    """, (user_id,))
    chats = cur.fetchall()

    for chat in chats:
        cur.execute("""
            SELECT message_id, sender_id, message, created_at
            FROM messages
            WHERE chat_id = %s
            ORDER BY created_at ASC
        """, (chat["chat_id"],))
        chat["messages"] = cur.fetchall()

    cur.close()
    con.close()
    return jsonify(chats)

@app.patch("/api/users/<int:user_id>")
def update_user(user_id):
    data = request.json or {}
    con = db()
    cur = con.cursor(dictionary=True)
    cur.execute("""
        UPDATE users
        SET fullname=%s, email=%s, phone=%s, address=%s
        WHERE user_id=%s
    """, (
        data.get("fullname"),
        data.get("email"),
        data.get("phone"),
        data.get("address"),
        user_id
    ))
    con.commit()
    cur.close()
    con.close()
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True)
