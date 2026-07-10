import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";

import Card from "../ui/Card";
import Input from "../ui/Input";
import PasswordInput from "../ui/PasswordInput";
import Button from "../ui/Button";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill in all fields");
    return;
  }

  try {
    setLoading(true);

    const response = await loginUser({
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    toast.success(response.data.message);

    navigate("/dashboard");

  } catch (error) {

    toast.error(
      error.response?.data?.message || "Login failed"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Welcome Back
      </h2>

      <p className="text-center text-slate-500 mb-6">
  Sign in to continue reviewing your JavaScript projects.
</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end mb-5">
          <Link
  to="/forgot-password"
  className="text-blue-600 hover:underline text-sm"
>
  Forgot your password?
</Link>
        </div>

<Button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
>
  {loading ? "Signing In..." : "Sign In"}
</Button>

        <p className="text-center mt-6 text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
  to="/register"
  className="text-blue-600 hover:underline font-medium"
>
  Create Account
</Link>
        </p>
      </form>
    </Card>
  );
}

export default LoginForm;