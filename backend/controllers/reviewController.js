const {
  analyzeJavaScript,
} = require("../services/staticAnalysisService");

const {
  reviewCodeWithAI,
} = require("../services/aiReviewService");

const {
  createReview,
  getReviewsByUserId,
  getReviewById,
  deleteReviewById,
  getReviewStatistics,
} = require("../models/reviewModel");

// Analyze JavaScript code, attempt AI review, and save review
const analyzeCode = async (req, res) => {
  try {
    const { code } = req.body;

    // Validate code input
    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "JavaScript code is required",
      });
    }

    // Step 1: Run ESLint static analysis
    const analysis = await analyzeJavaScript(code);

    // Step 2: Attempt Gemini AI review separately.
    // Gemini failure must not break static analysis.
    let aiReview = null;
    let aiReviewError = null;

    try {
      aiReview = await reviewCodeWithAI(
        code,
        analysis
      );
    } catch (error) {
      console.error("AI review error:", error);

      if (error.status === 503) {
        aiReviewError =
          "AI review is temporarily unavailable due to high demand. Please try again later.";
      } else if (error.status === 429) {
        aiReviewError =
          "AI review request limit reached. Please try again later.";
      } else {
        aiReviewError =
          "AI review could not be generated.";
      }
    }

    // Step 3: Save review to PostgreSQL.
    // aiReview may be null when Gemini fails.
    const savedReview = await createReview(
      req.user.id,
      code,
      analysis,
      aiReview
    );

    // Step 4: Return static analysis even when Gemini fails
    return res.status(201).json({
      success: true,

      message: aiReview
        ? "Code analyzed, AI review generated, and review saved successfully"
        : "Static analysis completed and review saved. AI review is temporarily unavailable.",

      review: savedReview,

      analysis,

      aiReview,

      aiReviewError,
    });
  } catch (error) {
    console.error("Review analysis error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to analyze and save JavaScript code",
    });
  }
};

// Get all reviews belonging to logged-in user
const getReviewHistory = async (req, res) => {
  try {
    const reviews = await getReviewsByUserId(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Review history retrieved successfully",
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Review history error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve review history",
    });
  }
};

// Get one review belonging to logged-in user
const getReviewDetails = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);

    if (
      !Number.isInteger(reviewId) ||
      reviewId <= 0
    ) {
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

    if (
      !Number.isInteger(reviewId) ||
      reviewId <= 0
    ) {
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

// Get review statistics for logged-in user
const getReviewStats = async (req, res) => {
  try {
    const stats = await getReviewStatistics(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Review statistics retrieved successfully",
      stats,
    });
  } catch (error) {
    console.error("Review statistics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve review statistics",
    });
  }
};

module.exports = {
  analyzeCode,
  getReviewHistory,
  getReviewDetails,
  deleteReview,
  getReviewStats,
};