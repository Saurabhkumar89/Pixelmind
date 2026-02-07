'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan: string) => {
    if (!token) {
      window.location.href = '/auth/signup';
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (data.success) {
        // Razorpay integration would go here
        alert('Order created. Razorpay integration would open here.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '0',
      credits: 10,
      description: 'Perfect for trying out',
      features: [
        '10 monthly credits',
        'Basic tools access',
        'Email support',
        'Download results',
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Starter',
      price: '199',
      credits: 300,
      description: 'For regular users',
      features: [
        '300 monthly credits',
        'All tools',
        'Priority support',
        'Batch processing',
        'Edit history',
      ],
      cta: 'Upgrade Now',
      popular: true,
    },
    {
      name: 'Pro',
      price: '499',
      credits: 1000,
      description: 'For professionals',
      features: [
        '1000 monthly credits',
        'All tools',
        '24/7 support',
        'Batch processing',
        'API access',
        'Custom models',
      ],
      cta: 'Upgrade Now',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">Choose the plan that fits your needs</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass rounded-lg p-8 relative ${
                  plan.popular ? 'ring-2 ring-blue-400 lg:scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="badge-premium">Most Popular</span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>

                <div className="mb-8 p-4 bg-white/5 rounded-lg">
                  <p className="font-semibold text-lg">{plan.credits} Credits</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>

                <Button
                  onClick={() => handleUpgrade(plan.name.toLowerCase())}
                  disabled={loading}
                  className="w-full mb-8"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Can I change plans anytime?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'What happens if I run out of credits?',
                  a: 'Your tools will be blocked until you upgrade. You can purchase additional credits as needed.',
                },
                {
                  q: 'Do unused credits roll over?',
                  a: 'Credits are reset monthly. Unused credits do not carry over to the next month.',
                },
                {
                  q: 'Is there a free trial?',
                  a: 'Yes! You get 10 free credits when you sign up. No credit card required.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="glass rounded-lg p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
