import { useState } from "react";

import Card from "../ui/Card";
import Input from "../ui/Input";
import PasswordInput from "../ui/PasswordInput";
import Button from "../ui/Button";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Welcome Back
      </h2>

      <p className="text-center text-slate-500 mb-8">
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

        <div className="flex justify-end mb-6">
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit">
          Sign In
        </Button>

        <p className="text-center mt-6 text-sm text-slate-600">
          Don't have an account?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Create Account
          </span>
        </p>
      </form>
    </Card>
  );
}

export default LoginForm;