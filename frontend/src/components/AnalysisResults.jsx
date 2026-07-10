import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ListChecks,
} from "lucide-react";

function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        {icon}
      </div>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function AnalysisResults({ analysis }) {
  if (!analysis) {
    return null;
  }

  const { summary, findings } = analysis;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-blue-600">
          Analysis Results
        </p>

        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Static Analysis Report
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review the issues detected in your JavaScript code.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Findings"
          value={summary.totalFindings}
          icon={<ListChecks size={20} className="text-blue-600" />}
        />

        <SummaryCard
          title="Errors"
          value={summary.errorCount}
          icon={<AlertCircle size={20} className="text-red-600" />}
        />

        <SummaryCard
          title="Warnings"
          value={summary.warningCount}
          icon={<AlertTriangle size={20} className="text-amber-600" />}
        />
      </div>

      <div className="mt-6">
        {findings.length === 0 ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={22}
                className="mt-0.5 flex-shrink-0 text-green-600"
              />

              <div>
                <h3 className="font-semibold text-green-900">
                  No issues detected
                </h3>

                <p className="mt-1 text-sm text-green-700">
                  The static analysis engine did not find any configured
                  JavaScript issues.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {findings.map((finding, index) => {
              const isError = finding.severity === "error";

              return (
                <article
                  key={`${finding.ruleId}-${finding.line}-${finding.column}-${index}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    {isError ? (
                      <AlertCircle
                        size={20}
                        className="mt-0.5 flex-shrink-0 text-red-600"
                      />
                    ) : (
                      <AlertTriangle
                        size={20}
                        className="mt-0.5 flex-shrink-0 text-amber-600"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isError
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {finding.severity}
                        </span>

                        <span className="text-sm font-semibold text-slate-800">
                          {finding.ruleId}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-700">
                        {finding.message}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        Line {finding.line}, Column {finding.column}
                      </p>
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

export default AnalysisResults;