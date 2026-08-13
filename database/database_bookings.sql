-- Create a database
CREATE DATABASE travel_booking;

-- Switch to the new database
USE travel_booking;

-- Create a table to store the bookings
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    accommodation_type VARCHAR(20) NOT NULL,
    Locations varchar(20) NOT NULL,
    number_of_rooms INT NOT NULL,
    room_type VARCHAR(20) NOT NULL,
    additional_requests TEXT
);

select * from bookings;
