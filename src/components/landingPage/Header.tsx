'use client';

import { useState } from 'react';
import Link from "next/link";
import {
    Menu,
    X,
    Bot,
} from 'lucide-react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#44B997] to-[#4AADB9]">
                        <Bot className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#44B997] to-[#4AADB9] bg-clip-text text-transparent">
                        HRConnect
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <a href="#features" className="text-sm font-medium text-slate-700 hover:text-[#44B997] transition-colors">
                        Features
                    </a>
                    <a href="#benefits" className="text-sm font-medium text-slate-700 hover:text-[#44B997] transition-colors">
                        Benefits
                    </a>
                    <a href="#how-it-works" className="text-sm font-medium text-slate-700 hover:text-[#44B997] transition-colors">
                        How It Works
                    </a>
                    <Link
                        href="/login" className="bg-gradient-to-r from-[#44B997] to-[#4AADB9] hover:from-[#3da888] hover:to-[#429ca8] border border-gray-300 px-2 p-1 rounded-sm">
                        Get Started
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden py-4 border-t">
                    <nav className="flex flex-col gap-4">
                        <a href="#features" className="text-sm font-medium text-slate-700 hover:text-[#44B997] transition-colors">
                            Features
                        </a>
                        <a href="#benefits" className="text-sm font-medium text-slate-700 hover:text-[#44B997] transition-colors">
                            Benefits
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-700 hover:text-[#44B997] transition-colors">
                            How It Works
                        </a>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/login" className="bg-gradient-to-r from-[#44B997] to-[#4AADB9]  border border-gray-300 px-2 p-1 rounded-sm">
                                Get Started
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    </header>
}