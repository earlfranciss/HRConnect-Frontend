"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in:", formData);
    // call your API or authentication logic here
  };

  return (
    <main className="flex flex-col md:flex-row h-screen w-full bg-white">
      {/* Left Section (Form) */}
      <div className="flex flex-col justify-center items-center md:w-[40%] w-full px-6 sm:px-10 lg:px-20 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col items-center"
        >
          <div className="text-left w-full">
            <h1 className="text-3xl font-semibold text-black">Welcome To.</h1>
            <h2 className="text-5xl font-bold mt-1 text-[#435334]">
              HRConnect <span className="font-thin">Aiva</span>
            </h2>
          </div>

          <div className="space-y-4 mt-10 w-full">
            <div>
              <label className="block mb-1 font-medium text-black text-sm">
                Email:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@email.com"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none text-black border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black text-sm">
                Password:
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none text-black border-gray-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#435334] text-white rounded-lg py-3 mt-6 cursor-pointer hover:bg-[#2c3e1a] transition-colors"
          >
            Login
          </button>
        </form>
      </div>

      {/* Right Section (Image) */}
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
