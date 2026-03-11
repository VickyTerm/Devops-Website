const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "devops-portal",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`DevOps Portal running on port ${PORT}`);
});