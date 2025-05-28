const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { poolConnect, sql, pool } = require("./db");

async function testConnection() {
  try {
    await poolConnect; // ensures pool has connected
    const result = await pool.request().query("SELECT 1 AS result");
    console.log("Database connection successful:", result.recordset);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}
testConnection();

// Load environment variables
dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
