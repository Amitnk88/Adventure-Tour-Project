create database location_;
use location_;
CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rating DECIMAL(2, 1),
    image_url VARCHAR(255)
);
select * from bookings;