import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { forgotPassword } from "../../services/authService";

import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword({
        email,
      });

      sessionStorage.setItem(
        "resetToken",
        response.data.resetToken
      );

      toast.success(response.data.message);

      navigate("/reset-password");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Password reset request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-3 text-center">
        Forgot Password?
      </h2>

      <p className="text-center text-slate-500 mb-6">
        Enter your registered email address to reset your password.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" loading={loading}>
          {loading ? "Verifying Email..." : "Continue"}
        </Button>

        <p className="text-center mt-6 text-sm text-slate-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Card>
  );
}

export default ForgotPasswordForm;