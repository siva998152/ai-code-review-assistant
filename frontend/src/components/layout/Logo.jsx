import { Code2 } from "lucide-react";

function Logo() {
  return (
    <div className="flex flex-col items-center lg:items-start">
      <div className="bg-blue-600 p-4 rounded-2xl shadow-lg">
        <Code2 className="w-10 h-10 text-white" />
      </div>

      <h1 className="mt-5 text-5xl font-extrabold text-slate-900 text-center lg:text-left">
        AI Code Review Assistant
      </h1>

      <p className="mt-5 text-lg text-slate-600 leading-8 max-w-lg text-center lg:text-left">
        Review JavaScript code with AI-powered insights, static analysis,
        security checks, performance optimization, and clean coding
        recommendations.
      </p>
    </div>
  );
}

export default Logo;