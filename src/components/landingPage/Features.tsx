'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Zap,
  Shield,
  Users,
  BarChart3,
  Brain,
} from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#44B997]/10 text-[#44B997] hover:bg-[#44B997]/10 border-[#44B997]/20">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Powerful AI Features for Modern HR
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to automate HR support and empower your employees
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: 'Intelligent AI Responses',
              description: 'Natural language processing understands context and provides accurate, personalized answers to complex HR questions.',
              color: 'text-[#44B997]'
            },
            {
              icon: MessageSquare,
              title: '24/7 Instant Support',
              description: 'Employees get immediate answers anytime, anywhere, eliminating wait times and reducing HR ticket volume.',
              color: 'text-[#4AADB9]'
            },
            {
              icon: Shield,
              title: 'Secure & Compliant',
              description: 'Enterprise-grade security compliance. Your data is encrypted and protected.',
              color: 'text-emerald-600'
            },
            {
              icon: Zap,
              title: 'Quick Integration',
              description: 'Seamlessly integrates with your existing HRIS and other workplace tools in minutes.',
              color: 'text-amber-600'
            },
            {
              icon: BarChart3,
              title: 'Analytics Dashboard',
              description: 'Track queries, identify trends, and gain insights into employee concerns with comprehensive analytics.',
              color: 'text-purple-600'
            },
            {
              icon: Users,
              title: 'Employee Self-Service',
              description: 'Let employees file leave, update profiles, and access HR info without assistance.',
              color: 'text-blue-600'
            }

          ].map((feature, index) => (
            <Card key={index} className="border-2 hover:border-[#44B997]/50 transition-all hover:shadow-lg group">
              <CardContent className="pt-6">
                <div className={`inline-flex p-3 rounded-lg bg-slate-50 mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}