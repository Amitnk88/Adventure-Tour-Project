# 🧭 Adventure Tourism Booking System

> A full-stack travel booking web application for exploring, planning, and booking adventure tourism packages across Karnataka.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## Overview

The **Adventure Tourism Booking System** is a travel booking website that lets users browse adventure tourism destinations, view curated travel packages, and submit accommodation bookings for locations across Karnataka (e.g., Mysore, Bangalore, Hampi, Uttar Kannada). It also includes a lightweight admin-facing panel for viewing submitted bookings and customer records.

**Problem it solves:** Small/regional tourism providers often lack an online way for travelers to browse destinations and register a booking request without manual, in-person coordination. This system digitizes that flow with a simple booking form, automatic price calculation, and a bookable ticket/confirmation code.

**Target users:**
- Travelers looking to explore adventure tourism packages in Karnataka and register a booking.
- A tour operator/admin who needs a simple internal view of incoming bookings and customer details.

---

## Key Features

- **User Signup & Login** — Account creation and authentication backed by Express sessions, with passwords hashed using `bcryptjs` before being stored in MySQL.
- **Destination & Package Browsing** — Static pages (`locations.html`, `package.html`, `info.html`) showcasing travel destinations and package details with imagery.
- **Booking Form with Dynamic Pricing** — `booking.html` submits guest details, dates, accommodation type, location, guide preference, room count, and room type; the backend (`server.js`) computes a total price based on the selected location, guide option, number of rooms, and room type.
- **Booking Confirmation with Unique Code** — Each successful booking generates a randomly-generated alphanumeric booking code, and the user is redirected to a confirmation page (`copy.html`) displaying it.
- **Ticket Lookup** — `confirm.html` and `intern.html` let a user/admin retrieve a booking record by its confirmation code via the `/confirm-ticket` endpoint.
- **Admin Views** — `admin.html` and `allCustomerPage.html` display active and all submitted bookings respectively, pulled live from the MySQL database.
- **Simple Admin Login Page** — `adminlog.html` provides a front-end login gate to the admin section.
- **Contact & About Pages** — Static informational pages (`contact.html`, `info.html`).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript (`fetch` API) |
| Backend | Node.js, Express.js |
| Database | MySQL (via `mysql2`) |
| Auth & Security | `bcryptjs` (password hashing), `express-session` (session-based auth) |
| Middleware | `body-parser`, `cors` |
| Package Manager | npm |

> `jsonwebtoken` and `mongoose` are listed in `package.json` as dependencies but are not currently used anywhere in `server.js` — the implemented auth flow uses `express-session`, and the implemented database layer uses MySQL, not MongoDB.

---

## Project Structure

```
tour-project-main/
├── assets/
│   ├── css/                # Stylesheets (auth, booking, location, package, register, global)
│   └── files/               # Destination images/videos used across the site
├── database/
│   ├── database_bookings.sql   # Creates travel_booking DB and bookings table
│   ├── location.sql            # Creates location_ DB and destinations table
│   └── login.sql               # Creates tour_package_db DB and users table
├── index.html                # Login landing page
├── signup.html                # User signup page
├── HomePage.html              # Main landing page after login
├── locations.html             # Browse travel destinations
├── package.html                # Travel package details
├── booking.html                # Booking form
├── copy.html                   # Booking confirmation (shows booking code)
├── confirm.html                 # Ticket lookup by booking code
├── info.html                   # About us
├── contact.html                # Contact page
├── adminlog.html               # Admin login page
├── admin.html                   # Admin: active bookings view
├── allCustomerPage.html        # Admin: all bookings view
├── intern.html                  # Customer/ticket lookup utility
├── server.js                    # Express server, routes, and MySQL queries
├── package.json                 # Node.js dependencies and project metadata
└── LICENSE                      # MIT License
```

---

## How It Works

1. A user lands on `index.html` and either logs in or signs up (`signup.html`).
2. On signup, the server hashes the password with `bcryptjs` and inserts a new row into the `users` table.
3. On login, the server compares the submitted password against the stored hash; on success, a session (`express-session`) is created and the user is redirected to `HomePage.html`.
4. The user browses destinations (`locations.html`) and packages (`package.html`), then proceeds to `booking.html` to submit a booking request (guest details, dates, accommodation type, location, guide option, and room details).
5. `POST /book` in `server.js` calculates the total booking amount from selected location, guide, room count, and room type, generates a random booking code, and inserts the record into the `bookings` table.
6. The user is redirected to `copy.html`, which displays the generated booking code.
7. The booking code can later be looked up via `confirm.html`/`intern.html`, which call `GET /confirm-ticket?code=...` to retrieve the booking details.
8. Admin-facing pages (`admin.html`, `allCustomerPage.html`) call `GET /bookings` and `GET /allbookings` respectively to list current or all booking records from the database.

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MySQL Server](https://dev.mysql.com/downloads/) running locally

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Amitnk88/Adventure-Tour-Project.git
cd Adventure-Tour-Project

# 2. Install dependencies
npm install

# 3. Set up the MySQL database
# Run the SQL scripts in the database/ folder against your local MySQL server, e.g.:
mysql -u root -p < database/database_bookings.sql
mysql -u root -p < database/login.sql
mysql -u root -p < database/location.sql

# 4. Configure your database credentials (see Configuration section below)

# 5. Start the server
node server.js
```

The app serves static files directly from the project root, so once the server is running, the site is accessible at:

```
http://localhost:<PORT>/index.html
```

---

## Configuration

`server.js` currently connects to MySQL using **hardcoded credentials** defined directly in the file (host, user, password, database name), and defines the server port and session secret as inline values rather than environment variables.

To run this project safely on your own machine:

- Open `server.js` and update the `mysql.createConnection({...})` block with **your own** MySQL `host`, `user`, `password`, and `database` name.
- Update the `session({ secret: ... })` value to a strong, unique secret of your own.
- Set a valid numeric port for the server to listen on.

**Recommended improvement:** move these values into a `.env` file (using a package like `dotenv`) instead of hardcoding them in `server.js`, and add `.env` to `.gitignore` so credentials are never committed.

---

## Usage

1. Sign up for a new account or log in with existing credentials.
2. Browse destinations and travel packages from the home page.
3. Fill out the booking form with trip details (dates, location, accommodation, guide preference, room type/count).
4. Submit the form to receive a unique booking confirmation code.
5. Use the confirmation code on the ticket lookup page at any time to retrieve your booking details.
6. (Admin) Log in via the admin login page to view active or all submitted bookings.

---

## Database

The project uses **MySQL**, with schema defined across three SQL scripts in `database/`:

**`users` table** (`login.sql`) — stores account credentials for signup/login:
| Column | Type |
|---|---|
| id | INT, AUTO_INCREMENT, PRIMARY KEY |
| username | VARCHAR(50/255), UNIQUE |
| password | VARCHAR(255) |

**`bookings` table** (`database_bookings.sql`) — stores submitted booking requests:
| Column | Type |
|---|---|
| id | INT, AUTO_INCREMENT, PRIMARY KEY |
| first_name, last_name | VARCHAR(50) |
| email | VARCHAR(100) |
| phone_number | VARCHAR(15) |
| check_in_date, check_out_date | DATE |
| accommodation_type | VARCHAR(20) |
| Location, Guide | VARCHAR |
| number_of_rooms | INT |
| room_type | VARCHAR(20) |
| additional_requests | TEXT |
| code, totalAmt | generated at booking time in `server.js` |

**`destinations` table** (`location.sql`) — a table for destination listings (id, name, description, rating, image_url).

> ⚠️ The column names/tables referenced by `server.js` queries (e.g. `bookings.Location`, `bookings.code`, `bookings.totalAmt`) are not fully identical to the columns defined in `database_bookings.sql`. If setting this up locally, you may need to align the SQL schema with the fields used in `server.js` (`code` and `totalAmt` columns in particular) before booking inserts will succeed.

---

## API Documentation

All endpoints are defined in `server.js` and served from the Express app.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/signup` | Create a new user account (hashes password, inserts into `users`) |
| `POST` | `/login` | Authenticate a user and start a session |
| `POST` | `/book` | Submit a booking; calculates total price and inserts into `bookings` |
| `GET` | `/confirm-ticket?code=<code>` | Retrieve a single booking by its confirmation code |
| `GET` | `/bookings` | Retrieve all bookings excluding those checking out today |
| `GET` | `/allbookings` | Retrieve every booking record |

**Example — booking lookup:**
```
GET /confirm-ticket?code=AB12CD
```
```json
{
  "success": true,
  "ticket": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "code": "AB12CD",
    "totalAmt": 5000
  }
}
```

---

## Future Enhancements

> These are suggested improvements based on the current implementation — none of the below are already built.

- Move database credentials, session secret, and server port to environment variables (`.env`) instead of hardcoding them in `server.js`.
- Replace the client-side hardcoded admin login (`adminlog.html`) with a proper server-side authenticated admin route.
- Add server-side input validation and sanitization for the booking and signup forms.
- Reconcile the `database/*.sql` schema files with the actual columns used in `server.js` (e.g., add `code` and `totalAmt` to the `bookings` table definition).
- Add a payment gateway integration for real bookings (not currently implemented).
- Add automated tests (currently `npm test` is a placeholder with no tests configured).
- Deploy the app to a hosting platform and add a live demo link.

---

## Challenges & Learning Outcomes

- Implementing session-based authentication with `express-session` and secure password storage using `bcryptjs`.
- Designing a dynamic pricing calculation on the backend based on multiple independent booking selections (location, guide, room count, room type).
- Structuring a multi-page static frontend that communicates with a single Express backend through `fetch` calls and traditional HTML form submissions.
- Working with MySQL via `mysql2` for CRUD-style operations, and iterating on schema design across multiple SQL files as booking requirements evolved.

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to your branch and open a Pull Request.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## Author

**Amit B Naik**
GitHub: [github.com/Amitnk88](https://github.com/Amitnk88)
LinkedIn: [linkedin.com/in/amitbnaik](https://linkedin.com/in/amitbnaik)
