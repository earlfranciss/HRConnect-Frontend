'use client';

import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, CheckCircle2, Star, Bot } from 'lucide-react';

export default function Benefits() {
    return (
        <section id="benefits" className="py-20 sm:py-32 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-[#44B997]/10 text-[#44B997] hover:bg-[#44B997]/10 border-[#44B997]/20">
                Benefits
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Why HR Teams Love HRConnect
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: TrendingUp,
                    title: 'Reduce HR Workload by 60%',
                    description: 'Automate repetitive queries and free your HR team to focus on strategic initiatives.'
                  },
                  {
                    icon: Clock,
                    title: 'Instant Response Times',
                    description: 'Employees get answers in seconds, not hours or days, improving satisfaction and productivity.'
                  },
                  {
                    icon: CheckCircle2,
                    title: 'Consistent Accuracy',
                    description: 'Eliminate human error with AI-powered responses based on your company policies and procedures.'
                  },
                  {
                    icon: Star,
                    title: 'Improved Employee Experience',
                    description: 'Self-service access to information empowers employees and enhances workplace satisfaction.'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#44B997] to-[#4AADB9]">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#44B997]/10 to-[#4AADB9]/10 p-8 shadow-2xl">
                <div className="h-full w-full rounded-xl bg-white shadow-xl p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#44B997] to-[#4AADB9] flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">HRConnect AIVA</div>
                      <div className="text-sm text-[#44B997] flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-[#44B997]"></div>
                        Online
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-2 justify-end">
                      <div className="bg-slate-100 rounded-2xl rounded-br-none p-3 max-w-[80%]">
                        <p className="text-sm text-slate-700">How many vacation days do I have left?</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-gradient-to-r from-[#44B997] to-[#4AADB9] text-white rounded-2xl rounded-bl-none p-3 max-w-[80%]">
                        <p className="text-sm">You have 12 vacation days remaining for this year. Would you like to submit a request?</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="bg-slate-100 rounded-2xl rounded-br-none p-3 max-w-[80%]">
                        <p className="text-sm text-slate-700">What's our parental leave policy?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}