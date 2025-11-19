'use client';

import { ChevronRight, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#44B997] to-[#4AADB9] px-8 py-16 text-center shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of companies using HRConnect to automate HR support and delight employees
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#44B997] hover:bg-slate-50 text-lg px-8">
              <Link
                href="/login">
                Sign-in
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-[#44B997] hover:bg-white/10 text-lg px-8">
              <Link
                href="/register">
                Get Started
              </Link>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}