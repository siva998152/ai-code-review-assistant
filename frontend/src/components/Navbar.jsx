import { Code2, LayoutDashboard, User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <nav className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 text-left"
        >
          <div className="rounded-lg bg-blue-600 p-2">
            <Code2 size={22} className="text-white" />
          </div>

          <div>
            <h1 className="text-lg font-semibold leading-tight text-white">
              AI Code Review Assistant
            </h1>

            <p className="text-xs text-slate-400">
              JavaScript Review Platform
            </p>
          </div>
        </button>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <NavLink
            to="/dashboard"
            className={navLinkClass}
          >
            <LayoutDashboard size={17} />
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            className={navLinkClass}
          >
            <User size={17} />
            Profile
          </NavLink>

          <div className="mx-2 hidden h-8 w-px bg-slate-700 md:block" />

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">
              {user?.name || "Developer"}
            </p>

            <p className="text-xs text-slate-400">
              {user?.email || ""}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;