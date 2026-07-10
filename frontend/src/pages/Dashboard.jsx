import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/Navbar";
import AnalysisResults from "../components/AnalysisResults";
import AIReviewResults from "../components/AIReviewResults";
import ReviewHistory from "../components/ReviewHistory";

import {
  getReviewHistory,
  getReviewById,
  deleteReviewById,
} from "../services/reviewService";

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [aiReview, setAiReview] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const fetchReviewHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);

      const response = await getReviewHistory();

      setReviews(response.data.reviews ?? []);
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

  const handleAnalysisComplete = async (result) => {
    if (!result) {
      setAnalysis(null);
      setAiReview(null);
      return;
    }

    /*
      New CodeEditor format:

      {
        analysis: {
          summary: {...},
          findings: [...]
        },
        aiReview: {...}
      }
    */
    if (result.analysis) {
      setAnalysis(result.analysis);
      setAiReview(result.aiReview ?? null);
    } else if (result.summary && Array.isArray(result.findings)) {
      /*
        Compatibility with old CodeEditor format:

        {
          summary: {...},
          findings: [...]
        }
      */
      setAnalysis(result);
      setAiReview(null);
    } else {
      console.error(
        "Unexpected analysis result:",
        result
      );

      setAnalysis(null);
      setAiReview(null);

      toast.error("Invalid analysis response");

      return;
    }

    setSelectedReviewId(null);
    setSelectedCode(null);

    await fetchReviewHistory();
  };

  const handleViewReview = async (reviewId) => {
    try {
      const response = await getReviewById(reviewId);

      const review = response.data.review;

      setSelectedReviewId(review.id);

      setSelectedCode(review.code);

      setAnalysis({
        summary: {
          errorCount: review.error_count ?? 0,
          warningCount: review.warning_count ?? 0,
          totalFindings: review.total_findings ?? 0,
        },

        findings: Array.isArray(review.findings)
          ? review.findings
          : [],
      });

      setAiReview(review.ai_review ?? null);

      toast.success(`Review #${review.id} loaded`);
    } catch (error) {
      console.error("Failed to load review:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load review"
      );
    }
  };

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

      if (selectedReviewId === reviewId) {
        setSelectedReviewId(null);
        setSelectedCode(null);
        setAnalysis(null);
        setAiReview(null);
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

          {analysis?.summary && (
            <AnalysisResults analysis={analysis} />
          )}

          {aiReview && (
            <AIReviewResults
  analysis={analysis}
  aiReview={aiReview}
/>
          )}

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