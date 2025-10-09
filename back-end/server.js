// Import required modules
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

// Initialize Express application
const app = express();

// Connect to SQLite database
const db = new sqlite3.Database("tratrabaho.db");

// Middleware configuration
app.use(cors());               // Enable CORS for cross-origin requests
app.use(bodyParser.json());    // Parse incoming JSON payloads

// ============================================================================
// LOGIN ENDPOINT
// ============================================================================
// Verifies user credentials against stored data in the database.
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Retrieve user record based on email
  const query = `SELECT * FROM user WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Handle case where no user matches the provided email
    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    // Compare provided password with the hashed password in the database
    const match = await bcrypt.compare(password, user.password_hash);

    // Handle invalid password case
    if (!match) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

     // Successful authentication → send user info (but omit sensitive data)
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        role: user.role
      },
    });
  });
});

// ============================================================================
// SIGNUP ENDPOINT
// ============================================================================
// Creates a new user account and stores hashed password securely.
app.post("/api/signup", async (req, res) => {
  const { firstname, lastname, birthday, gender, username, email, phone, password } = req.body;

  // Ensure required fields are provided
  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Email and password are required" });
  }

  // Prepare data for insertion
  const fullName = `${firstname} ${lastname}`;
  const role = "job_seeker";

  // Hash password before storing in the database
  const password_hash = await bcrypt.hash(password, 10);

  // Insert new user into the database
  const stmt = db.prepare(
    `INSERT INTO user (name, birthday, gender, username, email, phone, password_hash, role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  stmt.run(fullName, birthday, gender, username, email, phone, password_hash, role, function (err) {
    if (err) {
      // Handle unique constraint (duplicate email)
      if (err.message.includes("UNIQUE constraint")) {
        return res.status(400).json({ status: "error", message: "Email already exists" });
      }

      // Handle other database errors
      console.error("DB Error:", err);
      return res.status(500).json({ status: "error", message: "Database error" });
    }

    // Successful user registration
    res.json({
      status: "success",
      message: "User registered successfully",
      userId: this.lastID,
    });
  });

  stmt.finalize(); // Finalize statement to release resources
});

// ============================================================================
// SERVER START
// ============================================================================
// Start Express server on port 5000
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
