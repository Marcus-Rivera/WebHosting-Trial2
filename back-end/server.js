const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const db = new sqlite3.Database("tratrabaho.db");

app.use(cors());
app.use(bodyParser.json());

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Basic input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // 2️⃣ Query the database for user
  const query = `SELECT * FROM user WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // 3️⃣ Check if user exists
    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    // 4️⃣ Compare password with hashed password
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    } else {
      return res.json({success: true, message: "Login Successful"})
    }
  });
});


// SIGNUP endpoint
app.post("/api/signup",async (req, res) => {
  const { firstname, lastname, birthday, gender, username, email, phone, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Email and password are required" });
  }

  const fullName = `${firstname} ${lastname}`;
  const role = "job_seeker";
  const password_hash = await bcrypt.hash(password,10);

  const stmt = db.prepare(
    `INSERT INTO user (name, birthday, gender, username, email, phone, password_hash, role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  stmt.run(fullName, birthday, gender, username, email, phone, password_hash, role, function(err) {
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
