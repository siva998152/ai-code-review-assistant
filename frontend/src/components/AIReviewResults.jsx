import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { downloadReviewPDF } from "../utils/pdfGenerator";

function AIReviewResults({
  analysis,
  aiReview,
}) {
  if (!aiReview) {
    return null;
  }

  const {
    overview = "",
    issues = [],
    suggestions = [],
    improvedCode = "",
  } = aiReview;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(improvedCode);
      toast.success("Improved code copied");
    } catch (error) {
      console.error("Failed to copy improved code:", error);
      toast.error("Failed to copy improved code");
    }
  };

  const handleDownloadPDF = () => {
  downloadReviewPDF({
    analysis,
    aiReview,
  });

  toast.success("PDF downloaded");
};

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100">
          <Sparkles size={20} className="text-violet-600" />
        </div>

        <div>
          <p className="text-sm font-medium text-violet-600">
            AI-Powered Review
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Gemini Code Review
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            AI-generated explanations, recommendations, and improved code.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-5">
        <h3 className="font-semibold text-slate-900">
          Overview
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-700">
          {overview}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-900">
          Issues Explained
        </h3>

        <div className="mt-3">
          {issues.length === 0 ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={22}
                  className="mt-0.5 flex-shrink-0 text-green-600"
                />

                <div>
                  <h4 className="font-semibold text-green-900">
                    No additional issues identified
                  </h4>

                  <p className="mt-1 text-sm text-green-700">
                    The AI review did not identify additional issues requiring
                    explanation.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((issue, index) => {
                const isError = issue.severity === "error";
                const isWarning = issue.severity === "warning";

                return (
                  <article
                    key={`${issue.title}-${issue.line}-${index}`}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start gap-3">
                      {isError ? (
                        <AlertCircle
                          size={20}
                          className="mt-0.5 flex-shrink-0 text-red-600"
                        />
                      ) : isWarning ? (
                        <AlertTriangle
                          size={20}
                          className="mt-0.5 flex-shrink-0 text-amber-600"
                        />
                      ) : (
                        <Lightbulb
                          size={20}
                          className="mt-0.5 flex-shrink-0 text-blue-600"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              isError
                                ? "bg-red-100 text-red-700"
                                : isWarning
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {issue.severity}
                          </span>

                          <span className="text-sm font-semibold text-slate-800">
                            {issue.title}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {issue.explanation}
                        </p>

                        {issue.line && (
                          <p className="mt-2 text-xs text-slate-500">
                            Line {issue.line}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-2">
          <Lightbulb size={20} className="text-blue-600" />

          <h3 className="text-lg font-bold text-slate-900">
            Suggestions
          </h3>
        </div>

        {suggestions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No additional suggestions were generated.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion}-${index}`}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {index + 1}
                </span>

                <p className="text-sm leading-6 text-slate-700">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Code2 size={19} className="text-violet-600" />

            <h3 className="font-semibold text-slate-900">
              Improved Code
            </h3>
          </div>

          <div className="flex gap-2">
  <button
    type="button"
    onClick={handleDownloadPDF}
    className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
  >
    <Download size={16} />
    Download PDF
  </button>

  <button
    type="button"
    onClick={handleCopyCode}
    disabled={!improvedCode}
    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
  >
    <Copy size={16} />
    Copy Code
  </button>
</div>
        </div>

        <pre className="max-h-[500px] overflow-auto bg-slate-950 p-5 text-sm leading-6 text-slate-100">
          <code>{improvedCode}</code>
        </pre>
      </div>
    </section>
  );
}

export default AIReviewResults;