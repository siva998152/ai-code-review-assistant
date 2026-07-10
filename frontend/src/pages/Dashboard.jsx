import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto px-6 py-4">
        <CodeEditor />
      </main>
    </div>
  );
}

export default Dashboard;