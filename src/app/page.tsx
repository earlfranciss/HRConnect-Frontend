import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Header from "@/components/landingPage/Header";
import Highlight from "@/components/landingPage/Highlight";
import { Feather } from "lucide-react";
import HowItWorks from "@/components/landingPage/HowItWorks";
import Features from "@/components/landingPage/Features";
import Footer from "@/components/landingPage/Footer";
import CTA from "@/components/landingPage/CTA";
import Benefits from "@/components/landingPage/Benefits";

export default async function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Header />
      <Highlight />
      <Features />
      <Benefits />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}