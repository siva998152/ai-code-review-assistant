import { jsPDF } from "jspdf";

export const downloadReviewPDF = ({
  analysis,
  aiReview,
}) => {
  if (!analysis?.summary) {
    throw new Error("Static analysis data is required");
  }

  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const leftMargin = 15;
  const rightMargin = 15;
  const bottomMargin = 20;

  const contentWidth =
    pageWidth - leftMargin - rightMargin;

  let y = 20;

  const ensureSpace = (requiredHeight = 10) => {
    if (y + requiredHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = 20;
    }
  };

  const addHeading = (text, size = 15) => {
    ensureSpace(15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);

    doc.text(text, leftMargin, y);

    y += 10;

    doc.setFont("helvetica", "normal");
  };

  const addLine = (
    text,
    size = 11,
    lineHeight = 6,
    gapAfter = 3
  ) => {
    const safeText =
      text === null || text === undefined
        ? ""
        : String(text);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);

    const lines = doc.splitTextToSize(
      safeText,
      contentWidth
    );

    lines.forEach((line) => {
      ensureSpace(lineHeight);

      doc.text(line, leftMargin, y);

      y += lineHeight;
    });

    y += gapAfter;
  };

  // ==========================
  // Report Header
  // ==========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text(
    "AI Code Review Report",
    leftMargin,
    y
  );

  y += 12;

  addLine(
    `Generated: ${new Date().toLocaleString()}`,
    10
  );

  y += 3;

  // ==========================
  // Static Analysis Summary
  // ==========================

  addHeading("Static Analysis Summary");

  addLine(
    `Total Findings: ${
      analysis.summary.totalFindings ?? 0
    }`
  );

  addLine(
    `Errors: ${analysis.summary.errorCount ?? 0}`
  );

  addLine(
    `Warnings: ${
      analysis.summary.warningCount ?? 0
    }`
  );

  y += 3;

  // ==========================
  // Static Analysis Findings
  // ==========================

  addHeading("Static Analysis Findings");

  const findings = Array.isArray(analysis.findings)
    ? analysis.findings
    : [];

  if (findings.length === 0) {
    addLine("No static-analysis issues were detected.");
  } else {
    findings.forEach((finding, index) => {
      addLine(
        `${index + 1}. ${
          finding.ruleId || "Unknown Rule"
        } (${finding.severity || "unknown"})`,
        11,
        6,
        1
      );

      addLine(
        `Location: Line ${
          finding.line ?? "N/A"
        }, Column ${finding.column ?? "N/A"}`,
        9,
        5,
        1
      );

      addLine(
        `Message: ${
          finding.message || "No message available"
        }`,
        10,
        5,
        4
      );
    });
  }

  // ==========================
  // AI Review
  // ==========================

  if (aiReview) {
    y += 3;

    addHeading("AI Overview");

    addLine(
      aiReview.overview ||
        "No AI overview was generated."
    );

    // ==========================
    // AI Issues
    // ==========================

    addHeading("AI Issues");

    const issues = Array.isArray(aiReview.issues)
      ? aiReview.issues
      : [];

    if (issues.length === 0) {
      addLine(
        "No additional AI issues were identified."
      );
    } else {
      issues.forEach((issue, index) => {
        addLine(
          `${index + 1}. ${
            issue.title || "Untitled Issue"
          } (${issue.severity || "suggestion"})`,
          11,
          6,
          1
        );

        if (issue.line) {
          addLine(
            `Line: ${issue.line}`,
            9,
            5,
            1
          );
        }

        addLine(
          issue.explanation ||
            "No explanation available.",
          10,
          5,
          4
        );
      });
    }

    // ==========================
    // Suggestions
    // ==========================

    addHeading("AI Suggestions");

    const suggestions = Array.isArray(
      aiReview.suggestions
    )
      ? aiReview.suggestions
      : [];

    if (suggestions.length === 0) {
      addLine("No additional suggestions were generated.");
    } else {
      suggestions.forEach((suggestion, index) => {
        addLine(
          `${index + 1}. ${suggestion}`,
          10,
          5,
          3
        );
      });
    }

    // ==========================
    // Improved Code
    // ==========================

    addHeading("Improved Code");

    if (aiReview.improvedCode) {
      const codeLines = String(
        aiReview.improvedCode
      ).split("\n");

      doc.setFont("courier", "normal");
      doc.setFontSize(8);

      codeLines.forEach((codeLine) => {
        const wrappedLines = doc.splitTextToSize(
          codeLine || " ",
          contentWidth
        );

        wrappedLines.forEach((wrappedLine) => {
          ensureSpace(4.5);

          doc.setFont("courier", "normal");
          doc.setFontSize(8);

          doc.text(
            wrappedLine || " ",
            leftMargin,
            y
          );

          y += 4.5;
        });
      });

      y += 5;
    } else {
      addLine("No improved code was generated.");
    }
  } else {
    y += 3;

    addHeading("AI Review");

    addLine(
      "AI review was unavailable for this analysis."
    );
  }

  // ==========================
  // Page Numbers
  // ==========================

  const pageCount =
    doc.internal.getNumberOfPages();

  for (
    let pageNumber = 1;
    pageNumber <= pageCount;
    pageNumber += 1
  ) {
    doc.setPage(pageNumber);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      `Page ${pageNumber} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      {
        align: "center",
      }
    );
  }

  // ==========================
  // Download
  // ==========================

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

  doc.save(
    `AI-Code-Review-Report-${timestamp}.pdf`
  );
};