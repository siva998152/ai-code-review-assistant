const express = require("express");

const router = express.Router();

const {
  analyzeCode,
} = require("../controllers/reviewController");

const authenticateUser = require("../middleware/authMiddleware");

router.post("/analyze", authenticateUser, analyzeCode);

module.exports = router;