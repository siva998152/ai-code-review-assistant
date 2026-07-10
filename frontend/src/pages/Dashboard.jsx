import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/Navbar";
import AnalysisResults from "../components/AnalysisResults";
import ReviewHistory from "../components/ReviewHistory";

import {
  getReviewHistory,
  getReviewById,
  deleteReviewById,
} from "../services/reviewService";

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const fetchReviewHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);

      const response = await getReviewHistory();

      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Failed to load review history:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load review history"
      );
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviewHistory();
  }, [fetchReviewHistory]);

  // Receives analysis after new code is analyzed
  const handleAnalysisComplete = async (newAnalysis) => {
    setAnalysis(newAnalysis);

    // A successful new analysis means we are no longer
    // viewing an old saved review.
    if (newAnalysis) {
      setSelectedReviewId(null);
      setSelectedCode(null);

      await fetchReviewHistory();
    }
  };

  // Load a saved review
  const handleViewReview = async (reviewId) => {
    try {
      const response = await getReviewById(reviewId);

      const review = response.data.review;

      // Mark this history item as selected
      setSelectedReviewId(review.id);

      // Send saved code to Monaco Editor
      setSelectedCode(review.code);

      // Display saved static analysis results
      setAnalysis({
        summary: {
          errorCount: review.error_count,
          warningCount: review.warning_count,
          totalFindings: review.total_findings,
        },
        findings: review.findings,
      });

      toast.success(`Review #${review.id} loaded`);
    } catch (error) {
      console.error("Failed to load review:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load review"
      );
    }
  };

  // Delete a saved review
  const handleDeleteReview = async (reviewId) => {
    const shouldDelete = window.confirm(
      `Delete Review #${reviewId}? This action cannot be undone.`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingReviewId(reviewId);

      await deleteReviewById(reviewId);

      // Clear editor/results if the deleted review
      // is currently selected.
      if (selectedReviewId === reviewId) {
        setSelectedReviewId(null);
        setSelectedCode(null);
        setAnalysis(null);
      }

      toast.success("Review deleted successfully");

      await fetchReviewHistory();
    } catch (error) {
      console.error("Failed to delete review:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete review"
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-70px)] bg-slate-50 px-6 py-5">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="h-[calc(100vh-150px)] min-h-[520px]">
            <CodeEditor
              onAnalysisComplete={handleAnalysisComplete}
              selectedCode={selectedCode}
            />
          </div>

          <AnalysisResults analysis={analysis} />

          <ReviewHistory
            reviews={reviews}
            loading={historyLoading}
            selectedReviewId={selectedReviewId}
            deletingReviewId={deletingReviewId}
            onViewReview={handleViewReview}
            onDeleteReview={handleDeleteReview}
          />
        </div>
      </main>
    </>
  );
}

export default Dashboard;