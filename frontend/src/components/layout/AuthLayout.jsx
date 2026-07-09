import Logo from "./Logo";
import { CheckCircle2 } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 overflow-hidden">

      <div className="mx-auto h-full max-w-7xl px-12">

        <div className="grid h-full lg:grid-cols-2 items-center gap-24">

          {/* LEFT */}

          <div>

            <Logo />

            <div className="mt-12 space-y-5">

              <Feature text="Detect Bugs & Errors" />

              <Feature text="AI-Powered Code Review" />

              <Feature text="Security Analysis" />

              <Feature text="Performance Optimization" />

              <Feature text="Best Practices" />

            </div>

            <p className="mt-10 text-slate-500 italic">
              Trusted by developers to write cleaner, safer and faster JavaScript.
            </p>

          </div>

          {/* RIGHT */}

          <div className="flex justify-center">

            {children}

          </div>

        </div>

      </div>

    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-4">

      <CheckCircle2
        size={22}
        className="text-green-600"
      />

      <span className="text-xl font-medium text-slate-800">
        {text}
      </span>

    </div>
  );
}

export default AuthLayout;