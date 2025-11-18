import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  // Check for auth token on the server
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // If user is authenticated, redirect to dashboard
  if (token) {
    redirect("/dashboard");
  }

  // If not authenticated, show landing page
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#44B997] to-[#4AADB9]">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            HRConnect <span className="font-thin">Aiva</span>
          </h1>
          <p className="text-xl text-white/90 mb-12">
            Your AI-powered HR Assistant
          </p>
          
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-[#44B997] rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}