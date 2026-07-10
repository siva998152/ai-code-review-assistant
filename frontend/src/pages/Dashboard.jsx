import { useState } from "react";

import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/Navbar";
import AnalysisResults from "../components/AnalysisResults";

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-70px)] bg-slate-50 px-6 py-5">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="h-[calc(100vh-150px)] min-h-[520px]">
            <CodeEditor
              onAnalysisComplete={setAnalysis}
            />
          </div>

          <AnalysisResults analysis={analysis} />
        </div>
      </main>
    </>
  );
}

export default Dashboard;