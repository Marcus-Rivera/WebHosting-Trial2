const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("./tratrabaho.sqlite");

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

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
