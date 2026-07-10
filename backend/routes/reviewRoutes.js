const express = require("express");

const router = express.Router();

const {
  analyzeCode,
  getReviewHistory,
  getReviewDetails,
  deleteReview,
  getReviewStats,
} = require("../controllers/reviewController");

const authenticateUser = require("../middleware/authMiddleware");

router.post("/analyze", authenticateUser, analyzeCode);

router.get("/", authenticateUser, getReviewHistory);

router.get("/stats", authenticateUser, getReviewStats);

router.get("/:id", authenticateUser, getReviewDetails);

router.delete("/:id", authenticateUser, deleteReview);

module.exports = router;