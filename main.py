from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    redirect,
    url_for
)

from database import cursor, db

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/login")
def login_page():
    return render_template("login.html")


@app.route("/portal")
def portal():
    return render_template("portal.html")


@app.route("/tenant")
def tenant():
    return render_template("tenant.html")


@app.route("/admin")
def admin():
    return render_template("admin.html")


@app.route("/vehicle")
def vehicle():
    return render_template("vehicle.html")


@app.route("/chat")
def chat():
    return render_template("chat.html")


@app.route("/login-user", methods=["POST"])
def login_user():

    email = request.form["email"]
    password = request.form["password"]

    query = """
    SELECT *
    FROM users
    WHERE email=%s
    AND password=%s
    """

    cursor.execute(
        query,
        (email,password)
    )

    user = cursor.fetchone()

    if user:

        role = user["role"]

        if role == "admin":
            return redirect(
                url_for("admin")
            )

        elif role == "tenant_admin":
            return redirect(
                url_for("tenant")
            )

        else:
            return redirect(
                url_for("portal")
            )

    return "Invalid login"


@app.route("/vehicles")
def vehicles():

    cursor.execute(
        "SELECT * FROM vehicles"
    )

    data = cursor.fetchall()

    return jsonify(data)


if __name__=="__main__":
    app.run(debug=True)