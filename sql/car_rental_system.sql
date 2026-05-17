DROP DATABASE IF EXISTS car_rental_system;
CREATE DATABASE car_rental_system;
USE car_rental_system;

CREATE TABLE tenants (
    tenant_id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(100) NOT NULL,
    tenant_key VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','super_admin','tenant_admin','tenant_staff','customer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
);

CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT,
    vehicle_name VARCHAR(100),
    brand VARCHAR(100),
    price DECIMAL(10,2),
    availability BOOLEAN DEFAULT TRUE,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    renter_id INT,
    vehicle_id INT,
    status ENUM('Pending','Approved','Cancelled') DEFAULT 'Pending',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (renter_id) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

CREATE TABLE chats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

INSERT INTO tenants (tenant_id, business_name, tenant_key) VALUES
(1, 'Horizon Car Rental', 'HORIZON'),
(2, 'Metro Glide Rentals', 'METROGLIDE');

INSERT INTO users (id, tenant_id, fullname, email, password, role) VALUES
(1, NULL, 'DriveLink System Admin', 'admin@drivelink.io', 'superadmin999', 'admin'),
(2, 1, 'Carlos Horizon', 'carlos@horizon.com', 'horizon123', 'tenant_admin'),
(3, 2, 'Ryan Metro', 'ryan@metroglide.com', 'metro123', 'tenant_admin'),
(4, 1, 'Juan Customer', 'customer@drivelink.io', 'customer123', 'customer'),
(5, 1, 'Horizon Staff', 'staff@horizon.com', 'staff123', 'tenant_staff');

INSERT INTO vehicles (tenant_id, vehicle_name, brand, price, availability) VALUES
(1, 'Toyota Vios', 'Toyota', 1500.00, TRUE),
(1, 'Honda Civic', 'Honda', 2200.00, TRUE),
(2, 'Fortuner', 'Toyota', 3500.00, TRUE);

INSERT INTO bookings (renter_id, vehicle_id, status) VALUES
(4, 1, 'Pending');

INSERT INTO chats (sender_id, receiver_id, message) VALUES
(4, 2, 'Hello, is the Toyota Vios available?'),
(2, 4, 'Yes, it is available. How can we help you?');
