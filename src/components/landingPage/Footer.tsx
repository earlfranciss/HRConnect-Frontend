'use client';

import { Bot } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t bg-slate-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#44B997] to-[#4AADB9]">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#44B997] to-[#4AADB9] bg-clip-text text-transparent">
                  HRConnect
                </span>
              </div>
              <p className="text-sm text-slate-600">
                AI-powered HR assistance that transforms employee experience and reduces workload.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#44B997] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[#44B997] transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-[#44B997] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[#44B997] transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#44B997] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#44B997] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#44B997] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#44B997] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#44B997] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[#44B997] transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-[#44B997] transition-colors">Cookies</a></li>
                <li><a href="#" className="hover:text-[#44B997] transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2025 HRConnect. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-600 hover:text-[#44B997] transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-slate-600 hover:text-[#44B997] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
}