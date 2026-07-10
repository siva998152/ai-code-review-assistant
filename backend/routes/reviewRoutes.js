const express = require("express");

const router = express.Router();

const {
  analyzeCode,
  getReviewHistory,
  getReviewDetails,
  deleteReview,
} = require("../controllers/reviewController");

const authenticateUser = require("../middleware/authMiddleware");

router.get("/", authenticateUser, getReviewHistory);

router.get("/:id", authenticateUser, getReviewDetails);

router.post("/analyze", authenticateUser, analyzeCode);

router.delete("/:id", authenticateUser, deleteReview);

module.exports = router;