'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export function PricingSection() {
  const { isAuthenticated } = useAuth();

  const plans = [
    {
      name: 'Free',
      price: '0',
      credits: '10',
      description: 'Perfect for trying out',
      features: [
        '10 monthly credits',
        'Basic image editing',
        'Standard processing',
        'Community support',
      ],
      highlighted: false,
    },
    {
      name: 'Starter',
      price: '199',
      credits: '300',
      description: 'For regular creators',
      features: [
        '300 monthly credits',
        'Advanced editing tools',
        'Priority processing',
        'Email support',
        'Batch processing',
      ],
      highlighted: true,
    },
    {
      name: 'Pro',
      price: '499',
      credits: '1000',
      description: 'For professionals',
      features: [
        '1000 monthly credits',
        'All advanced tools',
        'Fast processing',
        'Priority support',
        'API access',
        'Custom models',
      ],
      highlighted: false,
    },
    {
      name: 'Studio',
      price: '999',
      credits: 'Unlimited',
      description: 'For enterprises',
      features: [
        'Unlimited credits',
        'All features included',
        'Fastest processing',
        '24/7 dedicated support',
        'Team collaboration',
        'Custom integrations',
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8 border-b border-border">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Credits reset monthly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-lg overflow-hidden smooth-transition ${
                plan.highlighted
                  ? 'ring-2 ring-blue-400 scale-105 md:scale-100'
                  : 'glass'
              }`}
            >
              <div className="p-6 md:p-8">
                {plan.highlighted && (
                  <div className="badge-premium mb-4">Most Popular</div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  {plan.price !== '0' && <span className="text-sm text-muted-foreground">/month</span>}
                </div>

                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{plan.credits}</strong> credits
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={isAuthenticated ? '/dashboard' : '/auth/signup'} className="block w-full">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {isAuthenticated ? 'Upgrade' : 'Get Started'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 glass rounded-lg text-center">
          <p className="text-muted-foreground mb-2">
            All prices are in Indian Rupees (₹). Billing via Razorpay.
          </p>
          <p className="text-sm text-muted-foreground">
            Subscriptions auto-renew monthly. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
