// ==========================
// IMPORTS AND SETUP
// ==========================
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fetch = require("node-fetch");

// Load .env variables
dotenv.config();

// Initialize Express
const app = express();

// ==========================
// ENVIRONMENT VARIABLES
// ==========================
const SECRET_KEY = process.env.SECRET_KEY || "fallback-secret";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; // now secure

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Serve static files if any (e.g., uploads, public)
app.use(express.static(path.join(__dirname, "public")));

// ==========================
// DATABASE SETUP
// ==========================
const db = new sqlite3.Database("tratrabaho.db", (err) => {
  if (err) {
    console.error("❌ Failed to connect to database:", err);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// ==========================
// GEMINI API ENDPOINT
// ==========================
app.post("/api/gemini", async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
    }

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";

    res.json({ output });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Gemini API error" });
  }
});

// ==========================
// AUTHENTICATION ENDPOINTS
// ==========================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const query = `SELECT * FROM user WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    });
  });
});

app.post("/api/verifyToken", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.json({ valid: false });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.json({ valid: false });
    res.json({ valid: true, user: decoded });
  });
});

app.post("/api/signup", async (req, res) => {
  const { firstname, lastname, birthday, gender, username, email, phone, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const role = "job_seeker";
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const stmt = db.prepare(`
      INSERT INTO user (firstname, lastname, birthday, gender, username, email, phone, password_hash, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      firstname,
      lastname,
      birthday,
      gender,
      username,
      email,
      phone,
      password_hash,
      role,
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint"))
            return res.status(400).json({ message: "Email already exists" });
          return res.status(500).json({ message: "Database error" });
        }
        res.json({ success: true, userId: this.lastID });
      }
    );
    stmt.finalize();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// OTHER ROUTES (Users, Jobs, Resume, Chat, etc.)
// ==========================
// ✅ You can keep all your other routes as-is.
// ✅ No need to change logic, just make sure fetch calls point to your deployed backend URL.

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
