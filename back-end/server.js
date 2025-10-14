// Import required modules
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key"; // Use .env for real projects

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


    // Create JWT (expires in 1 hour) 
    const token = jwt.sign({ id: user.user_id, email: user.email }, SECRET_KEY, 
      {expiresIn: "1h",});

     // Successful authentication → send user info (but omit sensitive data)
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        role: user.role,
      },
    });
  });
});

app.post("/api/verifyToken", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.json({ valid: false });

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) return res.json({ valid: false });
    res.json({ valid: true, user: decoded });
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
// FETCH ALL USERS
// ============================================================================
app.get("/api/users", (req, res) => {
  const query = `SELECT user_id, username, email, role, status FROM user`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(rows);
  });
});

// ============================================================================
// UPDATE USER STATUS
// ============================================================================
app.put("/api/users/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { status } = req.body;

  const query = `UPDATE user SET status = ? WHERE user_id = ?`;
  db.run(query, [status, user_id], function (err) {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User status updated successfully" });
  });
});

// ============================================================================
// JOB FETCH
// ============================================================================
app.get("/api/jobs", (req, res) => {
  const query = `SELECT job_id, title, description, location, min_salary, max_salary, availability FROM job`
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching jobs", err);
      return res.status(500).json({ message: "Database Error"});
    }
    res.json(rows);
  })
})

// ============================================================================
// JOB UPDATE
// ============================================================================
app.put("/api/job/:job_id", (req, res) => {
  const { job_id } = req.params;
  const { title, location, min_salary, max_salary, description, availability  } = req.body;

  const query = `
    UPDATE job SET title = ?, location = ?, min_salary = ?, max_salary = ?, description = ?, availability = ? WHERE job_id = ?;
  `;

   const params = [title, location, min_salary, max_salary, description, availability, job_id];
  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating job:", err);
      return res.status(500).json({ message: "Database erro"});
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Job nor found"});
    }

    res.json({ message: "Job updated successfully"})
  })
})

// ============================================================================
// FETCH PROFILE
// ============================================================================
app.get("/api/profile/:email", (req, res) => {
  const { email } = req.params;
  const query = `SELECT * FROM user WHERE email = ?`;

  db.get(query, [email], (err, user) => {
    if (err) {
      console.error("Error fetching profile:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  });
});

// ============================================================================
// UPDATE PROFILE
// ============================================================================
app.put("/api/profile/:email", (req, res) => {
  const { email } = req.params;
  const {
    firstname,
    lastname,
    gender,
    birthday,
    address,
    phone,
    bio,
    certification,
    seniorHigh,
    undergraduate,
    postgraduate,
  } = req.body;

  const fullName = `${firstname} ${lastname}`.trim();

  const query = `
    UPDATE user
    SET 
      name = ?, 
      gender = ?, 
      birthday = ?, 
      address = ?, 
      phone = ?, 
      bio = ?, 
      certification = ?, 
      seniorHigh = ?, 
      undergraduate = ?, 
      postgraduate = ?
    WHERE email = ?;
  `;

  const params = [
    fullName,
    gender,
    birthday,
    address,
    phone,
    bio,
    certification,
    seniorHigh,
    undergraduate,
    postgraduate,
    email,
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully" });
  });
});



// ============================================================================
// SERVER START
// ============================================================================
// Start Express server on port 5000
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
