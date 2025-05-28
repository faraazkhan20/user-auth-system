const express = require("express");
const cors = require("cors");
const { getAllUsers } = require("./services/userService");
const authRoutes = require("./routes/auth");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/api/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
