const express = require("express");
const router = express.Router();
const { poolConnect, pool } = require("../db");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

router.post("/register", [body("username").trim().notEmpty().withMessage("Username is required"), body("email").isEmail().withMessage("Valid email is required"), body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")], async (req, res) => {
  const { email, username, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await poolConnect;

    // Check if email already exists
    const userCheck = await pool.request().input("email", email).input("username", username).query("SELECT id FROM Users WHERE email = @email OR username = @username");

    if (userCheck.recordset.length > 0) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.request().input("username", username).input("email", email).input("passwordHash", passwordHash).query("INSERT INTO Users (username, email, passwordHash) VALUES (@username, @email, @passwordHash)");

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    await poolConnect;

    const result = await pool.request().input("email", email).query("SELECT * FROM Users WHERE email = @email");

    const user = result.recordset[0];
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    // Generate JWT token here
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
