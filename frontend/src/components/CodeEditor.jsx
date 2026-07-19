import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { analyzeCode } from "../services/reviewService";

import {
  ClipboardPaste,
  Upload,
  FileCode2,
  Trash2,
  Play,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";

const DEFAULT_CODE = `// Paste your JavaScript code here

function hello() {
  console.log("Hello World");
}
`;

function CodeEditor({
  onAnalysisComplete,
  selectedCode,
}) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [inputMode, setInputMode] = useState("paste");
  const [fileName, setFileName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const fileInputRef = useRef(null);

  // Load saved review code into Monaco Editor
  // when View is clicked in Review History.
  useEffect(() => {
    if (typeof selectedCode === "string") {
      setCode(selectedCode);
      setFileName("");
      setInputMode("paste");
      setShowEditor(true);
    }
  }, [selectedCode]);

  const handleModeChange = (mode) => {
    setInputMode(mode);
    setShowEditor(true);

    if (mode === "paste") {
      setFileName("");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".js")) {
      toast.error("Only JavaScript (.js) files are supported");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const fileContent = loadEvent.target?.result;

      if (typeof fileContent !== "string") {
        toast.error("Unable to read the selected file");
        return;
      }

      setCode(fileContent);
      setFileName(file.name);
      setShowEditor(true);

      // Clear previous static and AI results.
      onAnalysisComplete?.(null);

      toast.success(`${file.name} loaded successfully`);
    };

    reader.onerror = () => {
      toast.error("Failed to read the selected file");
    };

    reader.readAsText(file);
  };

  const handleClearCode = () => {
    setCode("");
    setFileName("");

    // Clear previous static and AI results.
    onAnalysisComplete?.(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.success("Code editor cleared");
  };

  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      toast.error("Please paste or upload JavaScript code");
      return;
    }

    try {
      setAnalyzing(true);

      // Clear old results while new analysis is running.
      onAnalysisComplete?.(null);

      // Wait for backend response before using response.
      const response = await analyzeCode({
        code,
      });

      console.log("Analysis response:", response.data);

      // Send static analysis and Gemini AI review
      // together to Dashboard.
      onAnalysisComplete?.({
        analysis: response.data.analysis,
        aiReview: response.data.aiReview,
      });

      toast.success(response.data.message);
    } catch (error) {
      console.error("Analysis failed:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to analyze JavaScript code"
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <section className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Code Input
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              JavaScript Code Editor
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Paste JavaScript code directly or upload a .js file for review.
            </p>
          </div>
        </div>
      </div>

      {!showEditor ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={() => handleModeChange("paste")}
              className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:border-blue-500 hover:shadow-lg"
            >
              <ClipboardPaste
                size={42}
                className="mb-5 text-blue-600"
              />

              <h3 className="text-xl font-semibold text-slate-900">
                Open Editor
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Open the Monaco editor and paste or type your JavaScript code.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setInputMode("upload");
                fileInputRef.current?.click();
              }}
              className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:border-blue-500 hover:shadow-lg"
            >
              <Upload
                size={42}
                className="mb-5 text-blue-600"
              />

              <h3 className="text-xl font-semibold text-slate-900">
                Upload JavaScript File (.js)
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Select a JavaScript (.js) file to load it into the Monaco editor.
              </p>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".js"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
            <div className="flex items-center gap-2">
              <FileCode2
                size={18}
                className="text-blue-600"
              />

              <span className="text-sm font-medium text-slate-700">
                {fileName || "Untitled JavaScript"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
            >
              <Upload size={16} />
              Upload JS File
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".js"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="min-h-0 flex-1 border-b border-slate-200">
            <Editor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => {
                setCode(value ?? "");

                // Clear results when user edits code.
                onAnalysisComplete?.(null);
              }}
              options={{
                minimap: {
                  enabled: true,
                },
                fontSize: 14,
                lineHeight: 22,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                tabSize: 2,
              }}
            />
          </div>

          <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearCode}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={17} />
                Clear Code
              </button>

              {fileName && (
                <span className="max-w-xs truncate text-sm text-slate-500">
                  Loaded: {fileName}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAnalyzeCode}
              disabled={analyzing}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {analyzing ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Play size={17} />
              )}

              {analyzing ? "Analyzing..." : "Analyze Code"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default CodeEditor;