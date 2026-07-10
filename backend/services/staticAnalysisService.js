const { ESLint } = require("eslint");

const analyzeJavaScript = async (code) => {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("JavaScript code is required");
  }

  const eslint = new ESLint({
    overrideConfigFile: true,

    overrideConfig: {
      languageOptions: {
  ecmaVersion: "latest",
  sourceType: "module",

  globals: {
    console: "readonly",
    window: "readonly",
    document: "readonly",
    localStorage: "readonly",
    sessionStorage: "readonly",
    fetch: "readonly",

    process: "readonly",
    Buffer: "readonly",
    __dirname: "readonly",
    __filename: "readonly",
    require: "readonly",
    module: "readonly",
    exports: "readonly",

    setTimeout: "readonly",
    clearTimeout: "readonly",
    setInterval: "readonly",
    clearInterval: "readonly",
  },
      },

      rules: {
        "no-unused-vars": "warn",
        "no-undef": "error",
        "no-unreachable": "error",
        "no-constant-condition": "warn",
        "no-debugger": "warn",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-self-assign": "warn",
        "no-unmodified-loop-condition": "warn",
        "eqeqeq": "warn",
        "no-var": "warn",
        "prefer-const": "warn",
      },
    },
  });

  const results = await eslint.lintText(code, {
    filePath: "input.js",
  });

  const result = results[0];

  const findings = result.messages.map((message) => ({
    ruleId: message.ruleId || "parsing-error",
    severity: message.severity === 2 ? "error" : "warning",
    message: message.message,
    line: message.line,
    column: message.column,
    endLine: message.endLine || message.line,
    endColumn: message.endColumn || message.column,
  }));

  return {
    summary: {
      errorCount: result.errorCount,
      warningCount: result.warningCount,
      totalFindings: findings.length,
    },

    findings,
  };
};

module.exports = {
  analyzeJavaScript,
};