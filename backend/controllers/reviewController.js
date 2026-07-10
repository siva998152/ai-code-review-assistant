const {
  analyzeJavaScript,
} = require("../services/staticAnalysisService");

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

    return res.status(200).json({
      success: true,
      message: "Static analysis completed successfully",
      analysis,
    });
  } catch (error) {
    console.error("Static analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze JavaScript code",
    });
  }
};

module.exports = {
  analyzeCode,
};