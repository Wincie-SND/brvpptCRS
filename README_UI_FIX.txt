DriveLink UI fix

This zip keeps the original DriveX interface and only renames it to DriveLink.
It restores the original static/js/app.js and full template UI, while keeping the Flask backend routes for /login, /tenant, and /admin.

Run:
1. Start XAMPP Apache and MySQL.
2. Import sql/car_rental_system.sql in phpMyAdmin.
3. pip install -r requirements.txt
4. python main.py
5. Open http://127.0.0.1:5000

Admin test:
admin@drivelink.io / superadmin999

Tenant test:
carlos@horizon.com / horizon123
