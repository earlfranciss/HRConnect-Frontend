'use client';

import { Badge } from '@/components/ui/badge';

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-[#44B997]/10 text-[#44B997] hover:bg-[#44B997]/10 border-[#44B997]/20">
                        How It Works
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Get Started in Three Simple Steps
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Launch your AI HR assistant in minutes, not months
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        {
                            step: '01',
                            title: 'Connect Your Systems',
                            description: 'Integrate HRConnect with your existing HRIS, knowledge base, and communication tools with one-click setup.'
                        },
                        {
                            step: '02',
                            title: 'Train Your AI',
                            description: 'Upload your HR policies and documents. Our AI learns your company-specific information automatically.'
                        },
                        {
                            step: '03',
                            title: 'Launch & Scale',
                            description: 'Deploy to your team via web. The AI improves continuously through machine learning.'
                        }
                    ].map((step, index) => (
                        <div key={index} className="relative">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#44B997] to-[#4AADB9] text-white text-2xl font-bold mb-4">
                                    {step.step}
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-slate-600">
                                    {step.description}
                                </p>
                            </div>
                            {index < 2 && (
                                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-[#44B997]/30"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}