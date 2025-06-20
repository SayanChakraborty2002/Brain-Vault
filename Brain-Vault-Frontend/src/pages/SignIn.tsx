import { useState } from "react";
import { Button } from "../components/ui/Button";
import { InputBox } from "../components/ui/Input";
import { validateInput } from "../utils";
import axios from "axios";
import { URL } from "../config";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const [username, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleChange() {
    const err = validateInput(username, userPassword);
    if (err) {
      setError(err);
      return;
    }
    try {
      setError("");
      setIsloading(true);
      setSuccess("");

      const response = await axios.post(URL + "/signin", {
        username: username,
        password: userPassword,
      });

      if (response.status === 200) {
        const jwt = response.data.authorization;
        localStorage.setItem("Authorization", jwt);
        setSuccess(response.data.message);
        setUserName("");
        setUserPassword("");
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsloading(false);
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
          <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-blue-100">Sign in to access your Brain Vault</p>
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
                type="text"
                onChange={(e) => setUserName(e.target.value)}
                placeHolder="Enter your username"
                className="w-full px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <InputBox
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeHolder="Enter your password"
                className="w-full px-4 py-3"
              />
            </div>

            <Button
              title={isLoading ? "Signing In..." : "Sign In"}
              variant="primary"
              size="lg"
              onClick={handleChange}
              disabled={isLoading}
              className="w-full py-3 font-medium"
            />
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 font-medium hover:text-blue-800 focus:outline-none"
            >
              Create one
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}