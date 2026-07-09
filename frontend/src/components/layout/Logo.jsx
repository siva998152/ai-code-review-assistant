import { Code2 } from "lucide-react";

function Logo() {
  return (
    <div className="flex flex-col items-start">

      <div className="bg-blue-600 p-5 rounded-2xl shadow-lg">
        <Code2 className="w-11 h-11 text-white" />
      </div>

      <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900">
        AI Code Review Assistant
      </h1>

      <p className="mt-3 text-xl text-slate-600">
        AI-powered JavaScript Review Platform
      </p>

    </div>
  );
}

export default Logo;