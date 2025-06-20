import { useState } from "react";
import { Button } from "../components/ui/Button";
import { InputBox } from "../components/ui/Input";
import axios from "axios";
import { URL } from "../config";
import { validateInput } from "../utils";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const [username, setUserName] = useState("");
  const [userPassword, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    const err = validateInput(username, userPassword);
    if (err) {
      setError(err);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.post(`${URL}/signup`, {
        username,
        password: userPassword,
      });

      if (response.status === 200) {
        setSuccess("Account created successfully! Redirecting to login...");
        setUserName("");
        setPassword("");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response?.data?.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-300 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              className="w-12 h-12" 
              src="/logo/brainLogo.png" 
              alt="Brain Vault Logo"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-blue-100">Get started with your Brain Vault</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">
              {success}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <InputBox
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeHolder="Choose your username"
                className="w-full px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <InputBox
                value={userPassword}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeHolder="Create a password"
                className="w-full px-4 py-3"
              />
            </div>

            <Button
              title={isLoading ? "Creating Account..." : "Sign Up"}
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 font-medium"
            />
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-blue-600 font-medium hover:text-blue-800 focus:outline-none"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}