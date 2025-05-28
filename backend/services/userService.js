const { poolConnect, pool } = require("../db");

async function getAllUsers() {
  try {
    await poolConnect; // wait for DB connection
    const result = await pool.request().query("SELECT id, username, email FROM Users");
    return result.recordset;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
}

module.exports = { getAllUsers };
