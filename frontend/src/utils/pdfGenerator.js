import { jsPDF } from "jspdf";

export const downloadReviewPDF = ({
  analysis,
  aiReview,
}) => {
  const doc = new jsPDF();

  let y = 20;

  const addLine = (text, size = 11, gap = 8) => {
    doc.setFontSize(size);

    const lines = doc.splitTextToSize(text, 180);

    doc.text(lines, 15, y);

    y += lines.length * gap;

    // New page if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  doc.setFontSize(20);
  doc.text("AI Code Review Report", 15, y);

  y += 15;

  addLine(
    `Generated: ${new Date().toLocaleString()}`
  );

  y += 5;

  doc.setFontSize(15);
  doc.text("Static Analysis Summary", 15, y);

  y += 10;

  addLine(
    `Total Findings : ${analysis.summary.totalFindings}`
  );

  addLine(
    `Errors : ${analysis.summary.errorCount}`
  );

  addLine(
    `Warnings : ${analysis.summary.warningCount}`
  );

  y += 6;

  doc.setFontSize(15);
  doc.text("Findings", 15, y);

  y += 10;

  if (analysis.findings.length === 0) {
    addLine("No issues found.");
  } else {
    analysis.findings.forEach((finding, index) => {
      addLine(
        `${index + 1}. ${finding.ruleId} (${finding.severity})`
      );

      addLine(
        `Line ${finding.line}: ${finding.message}`,
        10
      );

      y += 2;
    });
  }

  if (aiReview) {
    y += 6;

    doc.setFontSize(15);
    doc.text("AI Overview", 15, y);

    y += 10;

    addLine(aiReview.overview);

    y += 4;

    doc.setFontSize(15);
    doc.text("Suggestions", 15, y);

    y += 10;

    aiReview.suggestions.forEach((item, index) => {
      addLine(`${index + 1}. ${item}`);
    });

    y += 6;

    doc.setFontSize(15);
    doc.text("Improved Code", 15, y);

    y += 10;

    addLine(aiReview.improvedCode, 9, 5);
  }

  doc.save("AI-Code-Review-Report.pdf");
};