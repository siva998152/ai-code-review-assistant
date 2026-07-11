import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ClipboardList,
  SearchCode,
} from "lucide-react";
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
  getReviewStats,
} from "../services/reviewService";

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [aiReview, setAiReview] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [stats, setStats] = useState({
    totalReviews: 0,
    totalErrors: 0,
    totalWarnings: 0,
    totalFindings: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

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

  const fetchReviewStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      const response = await getReviewStats();

      const reviewStats = response.data.stats ?? {};

      setStats({
        totalReviews: Number(reviewStats.totalReviews ?? 0),
        totalErrors: Number(reviewStats.totalErrors ?? 0),
        totalWarnings: Number(reviewStats.totalWarnings ?? 0),
        totalFindings: Number(reviewStats.totalFindings ?? 0),
      });
    } catch (error) {
      console.error("Failed to load review statistics:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load review statistics"
      );
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const refreshDashboardData = useCallback(async () => {
    await Promise.all([
      fetchReviewHistory(),
      fetchReviewStats(),
    ]);
  }, [fetchReviewHistory, fetchReviewStats]);

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  const handleAnalysisComplete = async (result) => {
    if (!result) {
      setAnalysis(null);
      setAiReview(null);
      return;
    }

    if (result.analysis) {
      setAnalysis(result.analysis);
      setAiReview(result.aiReview ?? null);
    } else if (
      result.summary &&
      Array.isArray(result.findings)
    ) {
      setAnalysis(result);
      setAiReview(null);
    } else {
      console.error("Unexpected analysis result:", result);

      setAnalysis(null);
      setAiReview(null);

      toast.error("Invalid analysis response");

      return;
    }

    setSelectedReviewId(null);
    setSelectedCode(null);

    await refreshDashboardData();
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

      await refreshDashboardData();
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

  const statisticCards = [
    {
      label: "Total Reviews",
      value: stats.totalReviews,
      icon: ClipboardList,
      iconContainerClass: "bg-blue-100",
      iconClass: "text-blue-600",
    },
    {
      label: "Total Findings",
      value: stats.totalFindings,
      icon: SearchCode,
      iconContainerClass: "bg-violet-100",
      iconClass: "text-violet-600",
    },
    {
      label: "Errors",
      value: stats.totalErrors,
      icon: AlertCircle,
      iconContainerClass: "bg-red-100",
      iconClass: "text-red-600",
    },
    {
      label: "Warnings",
      value: stats.totalWarnings,
      icon: AlertTriangle,
      iconContainerClass: "bg-amber-100",
      iconClass: "text-amber-600",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-6 py-5">
        <div className="mx-auto max-w-7xl space-y-5">
          <section>
            <div className="mb-4">
              <p className="text-sm font-medium text-blue-600">
                Review Analytics
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Dashboard Overview
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track your JavaScript code reviews and static-analysis
                findings.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statisticCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {card.label}
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                          {statsLoading ? "—" : card.value}
                        </p>
                      </div>

                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${card.iconContainerClass}`}
                      >
                        <Icon
                          size={23}
                          className={card.iconClass}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

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