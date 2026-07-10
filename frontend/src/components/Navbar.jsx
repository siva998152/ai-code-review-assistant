import { Code2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Code2 size={22} className="text-white" />
          </div>

          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">
              AI Code Review Assistant
            </h1>

            <p className="text-slate-400 text-xs">
              JavaScript Review Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden sm:block text-right">
            <p className="text-white text-sm font-medium">
              {user?.name || "Developer"}
            </p>

            <p className="text-slate-400 text-xs">
              {user?.email || ""}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
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