const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("tratrabaho.db");

app.use(cors());
app.use(bodyParser.json());

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM user WHERE email = ? AND password_hash = ?`;
  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    if (row) {
      return res.json({ success: true, message: "Login successful" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  });
});

// SIGNUP endpoint
app.post("/api/signup", (req, res) => {
  const { firstname, lastname, birthday, gender, username, email, phone, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Email and password are required" });
  }

  const fullName = `${firstname} ${lastname}`;
  const role = "job_seeker"; // default role

  const stmt = db.prepare(
    `INSERT INTO user (name, birthday, gender, username, email, phone, password_hash, role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  stmt.run(fullName, birthday, gender, username, email, phone, password, role, function(err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint")) {
        return res.status(400).json({ status: "error", message: "Email already exists" });
      }
      console.error("DB Error:", err);
      return res.status(500).json({ status: "error", message: "Database error" });
    }
    res.json({ status: "success", message: "User registered successfully", userId: this.lastID });
  });

  stmt.finalize();
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
