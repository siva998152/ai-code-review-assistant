import { Sparkles } from "lucide-react";

function WelcomeCard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 17) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm px-7 py-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-2">
            Code Review Workspace
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            {getGreeting()}, {user?.name || "Developer"}
          </h2>

          <p className="mt-2 text-slate-600 max-w-2xl leading-6">
            Submit your JavaScript code and receive static analysis and
            AI-powered recommendations to improve code quality, security,
            performance, and maintainability.
          </p>
        </div>

        <div className="hidden sm:flex w-11 h-11 rounded-xl bg-blue-50 items-center justify-center flex-shrink-0">
          <Sparkles size={21} className="text-blue-600" />
        </div>
      </div>
    </section>
  );
}

export default WelcomeCard;