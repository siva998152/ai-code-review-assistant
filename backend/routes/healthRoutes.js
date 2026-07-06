const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Code Review Assistant API is healthy",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;