"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const validateInputs = () => {
    let valid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError("Password is required.");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const data = await api.login({ email, password });

      if (data?.access_token) {
        // Clear any existing token first
        document.cookie = "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        
        // Set new cookie with proper options
        document.cookie = `auth_token=${data.access_token}; Path=/; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;

        router.push("/dashboard");
        router.refresh(); // Force refresh to trigger middleware
      } else {
        setLoginError("Invalid email or password.");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific error messages
      const errorDetail = error?.body?.detail || error?.message || "Something went wrong. Try again.";
      
      if (errorDetail.includes("Another device") || errorDetail.includes("Session expired")) {
        setLoginError("This account is now logged in on this device. Any other active sessions have been terminated.");
      } else {
        setLoginError(errorDetail);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row h-screen w-full bg-white">
      <div className="flex flex-col justify-center items-center md:w-[40%] w-full px-6 sm:px-10 lg:px-20 py-10">
        <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col items-center">
          <div className="text-left w-full">
            <h1 className="text-3xl font-semibold text-black">Welcome To.</h1>
            <h2 className="text-5xl font-bold mt-1 bg-linear-to-r from-[#44B997] to-[#4AADB9] bg-clip-text text-transparent">
              HRConnect <span className="font-thin text-black">Aiva</span>
            </h2>
          </div>

          {/* EMAIL FIELD */}
          <div className="space-y-4 mt-10 w-full">
            <div>
              <label className="block mb-1 font-medium text-black text-sm">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none text-black border-gray-300 ${emailError ? "border-red-500" : ""
                  }`}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-red-500 mt-1 h-4">{emailError}</p>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block mb-1 font-medium text-black text-sm">Password:</label>
              <input
                type="password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*****"
                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none text-black border-gray-300 ${passwordError ? "border-red-500" : ""
                  }`}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-red-500 mt-1 h-4">{passwordError}</p>
            </div>
          </div>

          {/* LOGIN ERROR */}
          {loginError && (
            <p className="text-red-500 text-xs mt-1 text-center">{loginError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white rounded-lg py-3 mt-6 cursor-pointer hover:bg-[#2c3e1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="text-sm mt-6 text-gray-500">Don't have an account?
          <Link
            href="/register"
            className="m-2 text-green-600">
            Register
          </Link>
        </p>
      </div>

      <div className="relative hidden md:block md:w-[60%] h-full">
        <Image
          src="/img/login.jpg"
          alt="Login Illustration"
          fill
          className="object-cover"
          priority
        />
      </div>
    </main>
  );
}