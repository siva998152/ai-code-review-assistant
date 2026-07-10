const {
  analyzeJavaScript,
} = require("../services/staticAnalysisService");

const {
  createReview,
  getReviewsByUserId,
  getReviewById,
  deleteReviewById,
} = require("../models/reviewModel");

// Analyze JavaScript code and save the review
const analyzeCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "JavaScript code is required",
      });
    }

    const analysis = await analyzeJavaScript(code);

    const savedReview = await createReview(
      req.user.id,
      code,
      analysis
    );

    return res.status(201).json({
      success: true,
      message: "Code analyzed and review saved successfully",
      review: savedReview,
      analysis,
    });
  } catch (error) {
    console.error("Review analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze and save JavaScript code",
    });
  }
};

// Get all reviews belonging to logged-in user
const getReviewHistory = async (req, res) => {
  try {
    const reviews = await getReviewsByUserId(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Review history retrieved successfully",
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Review history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve review history",
    });
  }
};

// Get one review belonging to logged-in user
const getReviewDetails = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);

    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await getReviewById(
      reviewId,
      req.user.id
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      review,
    });
  } catch (error) {
    console.error("Review details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve review",
    });
  }
};

// Delete one review belonging to logged-in user
const deleteReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);

    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const deletedReview = await deleteReviewById(
      reviewId,
      req.user.id
    );

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      deletedReviewId: deletedReview.id,
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

module.exports = {
  analyzeCode,
  getReviewHistory,
  getReviewDetails,
  deleteReview,
};