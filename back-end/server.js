// Import required modules
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your-secret-key"; // Use .env for real projects

// Test for Resume Saver
const multer = require('multer');
const path = require('path');

// Initialize Express application
const app = express();

// Gemini API Key
const GEMINI_API_KEY = "AIzaSyD-QXNB8c8jiYNisBRSU33GcyP1txqhjt0";

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database("tratrabaho.db");

// ============================================================================
// GEMINI API ENDPOINT
// ============================================================================
// Route to handle Gemini API requests
app.post("/api/gemini", async (req, res) => {
  try {
    // Check if API key is set
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not defined" });
    }

    // Get prompt from frontend
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Call Gemini API
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

    // Safely extract Gemini text output
    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";

    // Send cleaned result to frontend
    res.json({ output });

  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Something went wrong with Gemini API" });
  }
});

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
    const token = jwt.sign({ id: user.user_id, email: user.email, role: user.role }, SECRET_KEY, 
      {expiresIn: "1h",});

     // Successful authentication → send user info (but omit sensitive data)
    return res.json({
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

// ============================================================================
// VERIFY TOKEN ENDPOINT
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
// Creates a new user account and stores hashed password securely.
app.post("/api/signup", async (req, res) => {
  const { firstname, lastname, birthday, gender, username, email, phone, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Email and password are required" });
  }

  const role = "job_seeker";

  try {
    // Hash password securely
    const password_hash = await bcrypt.hash(password, 10);

    // Prepare SQL statement
    const stmt = db.prepare(`
      INSERT INTO user (firstname, lastname, birthday, gender, username, email, phone, password_hash, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Execute the statement
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
          // Handle duplicate email or other DB errors
          if (err.message.includes("UNIQUE constraint")) {
            return res.status(400).json({ status: "error", message: "Email already exists" });
          }
          console.error("DB Error:", err);
          return res.status(500).json({ status: "error", message: "Database error" });
        }

        // Success response
        res.json({
          status: "success",
          message: "User registered successfully",
          userId: this.lastID,
        });
      }
    );

    stmt.finalize();
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
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
// JOB FETCH - Get all jobs
// ============================================================================
app.get("/api/jobs", (req, res) => {
  const query = `
    SELECT job_id, title, description, location, min_salary, max_salary, 
           vacantleft, company, type, posted, tags, remote 
    FROM job
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(rows);
  });
});

// ============================================================================
// JOB ADD - Create a new job
// ============================================================================
app.post("/api/jobs", (req, res) => {
  const { 
    title, 
    description, 
    location, 
    min_salary, 
    max_salary, 
    vacantleft, 
    company, 
    type, 
    tags, 
    remote 
  } = req.body;

  // Validate required fields
  if (!title || !description || !location || !min_salary || !max_salary || !vacantleft || !company || !type || !tags) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const posted = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const query = `
    INSERT INTO job (title, description, location, min_salary, max_salary, vacantleft, company, type, posted, tags, remote)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    title, 
    description, 
    location, 
    min_salary, 
    max_salary, 
    vacantleft, 
    company, 
    type, 
    posted, 
    tags, 
    remote || 0
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error inserting job:", err);
      return res.status(500).json({ message: "Database error while adding job." });
    }

    // Return the newly created job
    res.status(201).json({
      message: "Job added successfully.",
      job_id: this.lastID,
      title,
      description,
      location,
      min_salary,
      max_salary,
      vacantleft,
      company,
      type,
      posted,
      tags,
      remote: remote || 0
    });
  });
});

// ============================================================================
// JOB UPDATE - Update an existing job
// ============================================================================
app.put("/api/jobs/:job_id", (req, res) => {
  const { job_id } = req.params;
  const { 
    title, 
    description, 
    location, 
    min_salary, 
    max_salary, 
    vacantleft, 
    company, 
    type, 
    posted, 
    tags, 
    remote 
  } = req.body;

  // Validate required fields
  if (!title || !description || !location || !company || !type || !tags) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    UPDATE job 
    SET title = ?, description = ?, location = ?, min_salary = ?, max_salary = ?, 
        vacantleft = ?, company = ?, type = ?, posted = ?, tags = ?, remote = ?
    WHERE job_id = ?
  `;

  const params = [
    title, 
    description, 
    location, 
    min_salary, 
    max_salary, 
    vacantleft, 
    company, 
    type, 
    posted, 
    tags, 
    remote || 0, 
    job_id
  ];

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
// JOB DELETE - Delete a job
// ============================================================================
app.delete("/api/jobs/:job_id", (req, res) => {
  const { job_id } = req.params;

  const query = `DELETE FROM job WHERE job_id = ?`;

  db.run(query, [job_id], function (err) {
    if (err) {
      console.error("Error deleting job:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  });
});

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

  const query = `
    UPDATE user
    SET 
      firstname = ?, 
      lastname = ?,
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
// RESUME ENDPOINTS - Using SQLite
// ============================================================================

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  },
});

// Save resume to database
app.post('/api/resume/save', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId, resumeData } = req.body;
    const filename = req.file.originalname;
    const fileData = req.file.buffer;
    const createdAt = new Date().toISOString();

    // Insert resume into SQLite database
    const query = `
      INSERT INTO resume (user_id, filename, file_data, created_at) 
      VALUES (?, ?, ?, ?)
    `;

    db.run(query, [userId || null, filename, fileData, createdAt], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save resume to database' });
      }

      res.json({
        success: true,
        message: 'Resume saved successfully',
        resumeId: this.lastID,
        filename: filename,
      });
    });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

// Get user's resumes
app.get('/api/resume/user/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT resume_id, user_id, created_at, filename 
    FROM resume 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;

  db.all(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch resumes' });
    }

    res.json(results);
  });
});

// Download/retrieve resume
app.get('/api/resume/download/:resumeId', (req, res) => {
  const { resumeId } = req.params;

  const query = 'SELECT filename, file_data FROM resume WHERE resume_id = ?';

  db.get(query, [resumeId], (err, resume) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to retrieve resume' });
    }

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.filename}"`);
    res.send(resume.file_data);
  });
});

// Delete resume
app.delete('/api/resume/:resumeId', (req, res) => {
  const { resumeId } = req.params;

  const query = 'DELETE FROM resume WHERE resume_id = ?';

  db.run(query, [resumeId], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete resume' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ success: true, message: 'Resume deleted successfully' });
  });
});

// ============================================================================
// SERVER START
// ============================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));