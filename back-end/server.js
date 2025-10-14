// Import required modules
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key"; // Use .env for production

// Initialize Express app
const app = express();
const db = new sqlite3.Database("tratrabaho.db");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ============================================================================
// LOGIN ENDPOINT
// ============================================================================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const query = `SELECT * FROM user WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        role: user.role,
      },
    });
  });
});

// ============================================================================
// TOKEN VERIFICATION ENDPOINT
// ============================================================================
app.post("/api/verifyToken", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.json({ valid: false });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.json({ valid: false });
    res.json({ valid: true, user: decoded });
  });
});

// ============================================================================
// SIGNUP ENDPOINT
// ============================================================================
app.post("/api/signup", async (req, res) => {
  const { firstname, lastname, birthday, gender, username, email, phone, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ status: "error", message: "Email and password are required" });

  const fullName = `${firstname} ${lastname}`;
  const role = "job_seeker";
  const password_hash = await bcrypt.hash(password, 10);

  const stmt = db.prepare(
    `INSERT INTO user (name, birthday, gender, username, email, phone, password_hash, role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
  );

  stmt.run(
    fullName,
    birthday,
    gender,
    username,
    email,
    phone,
    password_hash,
    role,
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint")) {
          return res
            .status(400)
            .json({ status: "error", message: "Email already exists" });
        }
        console.error("DB Error:", err);
        return res.status(500).json({ status: "error", message: "Database error" });
      }

      res.json({
        status: "success",
        message: "User registered successfully",
        userId: this.lastID,
      });
    }
  );

  stmt.finalize();
});

// ============================================================================
// FETCH ALL USERS
// ============================================================================
app.get("/api/users", (req, res) => {
  const query = `SELECT user_id, username, email, role, status FROM user;`;
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

  const query = `UPDATE user SET status = ? WHERE user_id = ?;`;
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
// JOB ENDPOINTS
// ============================================================================

// Job Fetch
app.get("/api/jobs", (req, res) => {
  const query = `SELECT job_id, title, description, location, min_salary, max_salary, availability FROM job;`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(rows);
  });
});

// Job Update
app.put("/api/job/:job_id", (req, res) => {
  const { job_id } = req.params;
  const { title, location, min_salary, max_salary, description, availability } = req.body;

  if (!title || !location || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    UPDATE job 
    SET title = ?, location = ?, min_salary = ?, max_salary = ?, description = ?, availability = ?
    WHERE job_id = ?;
  `;

  const params = [title, location, min_salary, max_salary, description, availability, job_id];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating job:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job updated successfully" });
  });
});

// ============================================================================
// JOB UPDATE
// ============================================================================
app.put("/api/job/:job_id", (req, res) => {
  const { job_id } = req.params;
  const { title, location, min_salary, max_salary, description, availability } = req.body;

  const query = `
    UPDATE job 
    SET title = ?, location = ?, min_salary = ?, max_salary = ?, description = ?, availability = ?
    WHERE job_id = ?;
  `;

  const params = [title, location, min_salary, max_salary, description, availability, job_id];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error updating job:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job updated successfully" });
  });
});

// ============================================================================
// SERVER START
// ============================================================================
app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
