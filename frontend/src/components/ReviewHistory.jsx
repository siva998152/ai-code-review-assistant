import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  History,
  Loader2,
  Trash2,
} from "lucide-react";

function ReviewHistory({
  reviews,
  loading,
  selectedReviewId,
  deletingReviewId,
  onViewReview,
  onDeleteReview,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <History size={20} className="text-blue-600" />
          </div>

          <div>
            <p className="text-sm font-medium text-blue-600">
              Saved Reviews
            </p>

            <h2 className="text-xl font-bold text-slate-900">
              Review History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Open or delete your previously analyzed JavaScript reviews.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex min-h-40 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 size={18} className="animate-spin" />
              Loading review history...
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <History
              size={32}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-3 font-semibold text-slate-800">
              No saved reviews yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Analyze JavaScript code and your saved reviews will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => {
              const isSelected = selectedReviewId === review.id;
              const isDeleting = deletingReviewId === review.id;

              return (
                <article
                  key={review.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    isSelected
                      ? "border-blue-300 bg-blue-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          Review #{review.id}
                        </span>

                        {review.error_count > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                            <AlertCircle size={13} />
                            {review.error_count} Errors
                          </span>
                        ) : review.warning_count > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            <AlertTriangle size={13} />
                            {review.warning_count} Warnings
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            <CheckCircle2 size={13} />
                            No Issues
                          </span>
                        )}

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {review.total_findings} Findings
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <Clock3 size={14} />

                        {new Date(review.created_at).toLocaleString()}
                      </div>

                      <p className="mt-3 max-w-3xl truncate font-mono text-xs text-slate-500">
                        {review.code}
                      </p>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewReview(review.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteReview(review.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDeleting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}

                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewHistory;