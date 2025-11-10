"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent page reload

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        // Set cookie
        document.cookie = `auth_token=${data.access_token}; Path=/; Secure; SameSite=Lax;`;

        router.push("/");
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="flex flex-col md:flex-row h-screen w-full bg-white">
      {/* Left Section (Form) */}
      <div className="flex flex-col justify-center items-center md:w-[40%] w-full px-6 sm:px-10 lg:px-20 py-10">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md flex flex-col items-center"
        >
          <div className="text-left w-full">
            <h1 className="text-3xl font-semibold text-black">Welcome To.</h1>
            <h2 className="text-5xl font-bold mt-1 bg-linear-to-r from-[#44B997] to-[#4AADB9] bg-clip-text text-transparent">
              HRConnect <span className="font-thin text-black">Aiva</span>
            </h2>
          </div>

          <div className="space-y-4 mt-10 w-full">
            <div>
              <label className="block mb-1 font-medium text-black text-sm">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full border rounded-lg px-3 py-2.5 focus:outline-none text-black border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black text-sm">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                className="w-full border rounded-lg px-3 py-2.5 focus:outline-none text-black border-gray-300"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white rounded-lg py-3 mt-6 cursor-pointer hover:bg-[#2c3e1a] transition-colors"
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
