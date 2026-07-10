import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { resetPassword } from "../../services/authService";

import Card from "../ui/Card";
import PasswordInput from "../ui/PasswordInput";
import Button from "../ui/Button";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const resetToken = sessionStorage.getItem("resetToken");

    if (!resetToken) {
      toast.error("Password reset session is missing or expired");
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        resetToken,
        password,
      });

      sessionStorage.removeItem("resetToken");

      toast.success(response.data.message);

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-3 text-center">
        Reset Password
      </h2>

      <p className="text-center text-slate-500 mb-6">
        Create a new password for your account.
      </p>

      <form onSubmit={handleSubmit}>
        <PasswordInput
          label="New Password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" loading={loading}>
          {loading ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>
    </Card>
  );
}

export default ResetPasswordForm;