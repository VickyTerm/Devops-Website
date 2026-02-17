const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("🚀 DevOps Website Backend is Running");
});

app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
