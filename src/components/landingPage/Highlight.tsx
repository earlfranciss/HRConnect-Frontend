'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export default function Highlight() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-[#44B997]/10 text-[#44B997] hover:bg-[#44B997]/10 border-[#44B997]/20">
            <Sparkles className="mr-1 h-3 w-3" />
            AI-Powered HR Assistant
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Transform Your HR with{' '}
            <span className="bg-gradient-to-r from-[#44B997] to-[#4AADB9] bg-clip-text text-transparent">
              Intelligent AI
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            HRConnect's AI chatbot revolutionizes employee support with instant, accurate answers to HR queries 24/7. Reduce workload, increase satisfaction, and streamline your HR operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="text-lg px-8 border-[#44B997] text-[#44B997] hover:bg-[#44B997]/10">
              <Link
                href="/login">
                Sign-in
              </Link>
            </Button>
            <Button size="lg" className="bg-gradient-to-r from-[#44B997] to-[#4AADB9] hover:from-[#3da888] hover:to-[#429ca8] text-lg px-8">
              <Link
                href="/login">
                Get Started
              </Link>
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#44B997]" />
              <span>Easy to use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#44B997]" />
              <span>Works out of the box</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#44B997]" />
              <span>No setup headaches</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}