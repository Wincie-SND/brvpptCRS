from flask import Flask, render_template,request,jsonify
from database import cursor,db

app=Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")


@app.route('/login',methods=['POST'])
def login():

    email=request.form['email']
    password=request.form['password']

    query="""
    SELECT * FROM users
    WHERE email=%s
    AND password=%s
    """

    cursor.execute(query,(email,password))

    user=cursor.fetchone()

    if user:
        return jsonify({
            "message":"Login Success"
        })

    return jsonify({
        "message":"Invalid Account"
    })


@app.route('/vehicles')
def vehicles():

    cursor.execute(
    "SELECT * FROM vehicles"
    )

    data=cursor.fetchall()

    return jsonify(data)


@app.route('/book',methods=['POST'])
def booking():

    renter=request.form['renter']
    vehicle=request.form['vehicle']

    sql="""
    INSERT INTO bookings
    (renter_id,vehicle_id,status)
    VALUES(%s,%s,%s)
    """

    cursor.execute(
    sql,
    (renter,vehicle,"Pending")
    )

    db.commit()

    return jsonify({
        "message":"Booking Successful"
    })


if __name__=="__main__":
    app.run(debug=True)