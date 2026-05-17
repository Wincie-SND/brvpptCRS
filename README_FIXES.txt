DriveLink fixes added:

1. Admin login fixed
- main.py now stores logged-in user in Flask session.
- role "admin" and "super_admin" both redirect to /admin.
- /admin is protected, so only admin users can open it.

Admin test account:
Email: admin@drivelink.io
Password: superadmin999

2. Tenant chat sender fixed
- /send-message no longer trusts sender_id from JavaScript.
- sender_id now comes from session["user_id"].
- This prevents tenant messages from being saved as customer messages.

Tenant test account:
Email: carlos@horizon.com
Password: horizon123

Customer test account:
Email: customer@drivelink.io
Password: customer123

3. Database updated
- sql/car_rental_system.sql recreates the database with admin, tenant, staff, customer, vehicles, booking, and sample chat.

Run steps:
1. Start XAMPP Apache and MySQL.
2. Open phpMyAdmin.
3. Import sql/car_rental_system.sql.
4. In VS Code terminal, run: pip install flask mysql-connector-python
5. Run: python main.py
6. Open: http://127.0.0.1:5000/login
