const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const https = require('https');



const app = express();
const port = https:github.com/Naveen-109/tour-project;

// Middleware to parse JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Session middleware
app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set `secure: true` if using HTTPS
}));

// Serve static files (HTML, CSS)
app.use(express.static(path.join(__dirname, ''))); // Assuming your HTML files are in the root folder

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'naveen@123', // replace with your MySQL password
    database: 'travel_booking', // replace with your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database.');
});

// Route to handle user signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Check if the username already exists
    const checkUserQuery = `SELECT * FROM users WHERE username = ?`;
    db.query(checkUserQuery, [username], async (err, results) => {
        if (err) {
            console.error('Error querying user:', err.message);
            return res.status(500).send('Error signing up.');
        }
        if (results.length > 0) {
            return res.status(400).send('Username already exists.');
        }

        // Hash the password before storing
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertUserQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;

            db.query(insertUserQuery, [username, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err.message);
                    return res.status(500).send('Error signing up.');
                }
                res.redirect('/index.html');
            });
        } catch (err) {
            console.error('Error hashing password:', err.message);
            res.status(500).send('Error signing up.');
        }
    });
});

// Route to handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ?`;
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error querying user:', err.message);
            return res.status(500).send('Error logging in.');
        }
        if (results.length === 0) {
            return res.status(401).send('Invalid credentials');
        }

        const user = results[0];
        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id; // Store user ID in session
                res.redirect('/HomePage.html'); // Redirect to home page on successful login
            } else {
                res.status(401).send('Invalid credentials');
            }
        } catch (err) {
            console.error('Error comparing password:', err.message);
            res.status(500).send('Error logging in.');
        }
    });
});

// Route to handle form submission for bookings
// Endpoint to handle booking insertion
app.post('/book', (req, res) => {
    const {
        firstname,
        lastname,
        email,
        phone,
        Location,
        Guide,
        check_in_date,
        check_out_date,
        accommodation_type,
        number_of_rooms,
        room_type,
        additional_requests
    } = req.body;

    //based on location
    let totalAmt = 0;

    // Location cost
    switch (Location) {
        case "Mysore":
        case "Bangalore":
        case "Hampi":
            totalAmt += 3000;
            break;
        case "Uttar kannada":
            totalAmt += 4000;
            break;
        default:
            console.log("Invalid location");
    }
    
    // Guide cost
    switch (Guide) {
        case "with":
            totalAmt += 1000;
            break;
        case "without":
            totalAmt += 0;
            break;
        default:
            console.log("Invalid guide option");
    }
    
    // Room count base cost
    switch (parseInt(number_of_rooms)) {
        case 1:
            totalAmt += 1000;
            break;
        case 2:
            totalAmt += 2000;
            break;
        case 3:
            totalAmt += 3000;
            break;
        case 4:
            totalAmt += 4000;
            break;
        default:
            console.log("Invalid number of rooms");
    }
    
    // Room type cost
    switch (room_type) {
        case "Single Room":
            totalAmt += 1000;
            break;
        case "Double Room":
            totalAmt += 1500;
            break;
        case "Triple Room":
            totalAmt += 2000;
            break;
        case "Quad Bedroom":
            totalAmt += 3000;
            break;
        default:
            console.log("Invalid room type");
    }
    
    console.log("Total Amount:", totalAmt);
    
    

    const bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const query = `INSERT INTO bookings (first_name, last_name, email, phone_number, Location, Guide, check_in_date, check_out_date, accommodation_type, number_of_rooms, room_type, additional_requests, code, totalAmt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

db.query(query, [firstname, lastname, email, phone, Location, Guide, check_in_date, check_out_date, accommodation_type, number_of_rooms, room_type, additional_requests, bookingCode, totalAmt], (err, result) => {
    if (err) {
        console.error('Error inserting booking data:', err.message);
        return res.status(500).send('Error processing your booking.');
    }
    
    // Redirect to copy.html with the booking code as a query parameter
    res.redirect(`/copy.html?code=${encodeURIComponent(bookingCode)}`);
});

});


app.get('/confirm-ticket', (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ success: false, message: 'Ticket code is required.' });
    }

    const query = 'SELECT * FROM bookings WHERE code = ?';

    db.query(query, [code], (err, results) => {
        if (err) {
            console.error('Error retrieving ticket data:', err.message);
            return res.status(500).json({ success: false, message: 'Error processing your request.' });
        }

        if (results.length > 0) {
            res.json({ success: true, ticket: results[0] });
        } else {
            res.status(404).json({ success: false, message: 'Ticket not found.' });
        }
    });
});



// Endpoint to get all bookings
app.get('/bookings', (req, res) => {
    let d= new Date();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    const fullDate = `${year}-${month}-${date}`;
    
    const query = `SELECT * FROM bookings where check_out_date != "${fullDate}"`; // to filter based on the check out date
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, bookings: results });
    });
});

app.get('/allbookings', (req, res) => {
    const query = `SELECT * FROM bookings`; // to filter based on the check out date
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, bookings: results });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${https://github.com/Naveen-109/tour-project}`);
});

