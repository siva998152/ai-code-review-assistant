import Logo from "./Logo";
import { CheckCircle2 } from "lucide-react";

function AuthLayout({ children }) {
  return (
   <div className="mt-12 space-y-8">

  <Feature
    title="Detect Bugs & Errors"
    description="Find syntax errors, runtime issues, and coding mistakes before deployment."
  />

  <Feature
    title="AI-Powered Code Review"
    description="Receive intelligent suggestions to improve code quality and maintainability."
  />

  <Feature
    title="Security Analysis"
    description="Identify insecure coding patterns and common JavaScript vulnerabilities."
  />

  <Feature
    title="Performance Optimization"
    description="Discover opportunities to improve execution speed and efficiency."
  />

  <Feature
    title="Best Practices"
    description="Follow clean coding standards and industry-recommended JavaScript conventions."
  />

    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="flex gap-4">

      <CheckCircle2
        className="text-green-600 mt-1 flex-shrink-0"
        size={22}
      />

      <div>

        <h3 className="font-semibold text-slate-800 text-lg">
          {title}
        </h3>

        <p className="text-slate-600 mt-1 leading-6">
          {description}
        </p>

      </div>

    </div>
  );
}

export default AuthLayout;