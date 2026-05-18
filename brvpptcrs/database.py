from flask_sqlalchemy import SQLAlchemy

# Create SQLAlchemy instance
db = SQLAlchemy()


# Optional helper function
def init_database(app):

    app.config['SQLALCHEMY_DATABASE_URI'] = \
        "mysql+pymysql://root:@localhost/car_rental_system"

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()