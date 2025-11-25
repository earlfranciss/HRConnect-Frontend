"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [registerError, setRegisterError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const validateInputs = () => {
        let valid = true;

        // Reset errors
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setRegisterError("");

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
        } else if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
            valid = false;
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one uppercase letter.");
            valid = false;
        } else if (!/[a-z]/.test(password)) {
            setPasswordError("Password must contain at least one lowercase letter.");
            valid = false;
        } else if (!/[0-9]/.test(password)) {
            setPasswordError("Password must contain at least one number.");
            valid = false;
        } else if (!/[!/@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            setPasswordError("Password must contain at least one special character (!/@#$%^&* etc.).");
            valid = false;
        }

        // Confirm Password validation
        if (confirmPassword.trim() !== password.trim()) {
            setConfirmPasswordError("Passwords don't match.");
            valid = false;
        }

        return valid;
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateInputs()) return;

        setIsLoading(true);

        try {
            const data = await api.register({ email, password });

            if (data) {
                router.push("/login");
                router.refresh();
            }

        } catch (error: any) {
            console.error("Register error:", error);

            const message = error?.body?.detail || "Something went wrong. Try again.";

            setRegisterError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex flex-col md:flex-row h-screen w-full bg-white">
            <div className="flex flex-col justify-center items-center md:w-[40%] w-full px-6 sm:px-10 lg:px-20 py-10">
                <form onSubmit={handleRegister} className="w-full max-w-md flex flex-col items-center">
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

                        {/* CONFIRM PASSWORD FIELD */}
                        <div>
                            <label className="block mb-1  font-medium text-black text-sm">Confirm Password:</label>
                            <input
                                type="password"
                                aria-label="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="*****"
                                className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none text-black border-gray-300 ${confirmPasswordError ? "border-red-500" : ""
                                    }`}
                                required
                                disabled={isLoading}
                            />
                            <p className="text-xs text-red-500 mt-1 h-4">{confirmPasswordError}</p>
                        </div>
                    </div>

                    {/* REGISTER ERROR */}
                    {registerError && (
                        <p className="text-red-500 text-xs mt-1">{registerError}</p>
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
                                Registering...
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>

                <p className="text-sm mt-6 text-gray-500">Already have an account?
                    <Link
                        href="/login"
                        className="m-2 text-green-600">
                        Login
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