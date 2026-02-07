'use client';

import Link from 'next/link';
import { Sparkles, Wand2, Zap, Rocket, ArrowRight, Palette, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  const tools = [
    { href: '/ai/text-to-image', icon: Sparkles, title: 'AI Image Generator', credits: '2' },
    { href: '/ai/background-remove', icon: Palette, title: 'Remove Background', credits: '1' },
    { href: '/ai/upscale', icon: Zap, title: 'Upscale Image', credits: '2' },
    { href: '/ai/expand', icon: ImageIcon, title: 'Expand Canvas', credits: '3' },
    { href: '/ai/prompt-edit', icon: Wand2, title: 'Prompt Edit', credits: '2' },
    { href: '/ai/generative-fill', icon: Sparkles, title: 'Generative Fill', credits: '2' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl text-center">
          <h1 className="mb-6 text-5xl font-bold sm:text-6xl">
            AI Image Editing Studio
          </h1>
          <p className="mb-8 text-lg text-muted-foreground mx-auto max-w-2xl">
            Generate, edit, enhance images with AI. Start free with 10 credits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2">
                Get Started <Rocket className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold">Powerful AI Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.href} href={tool.href}>
                  <div className="glass rounded-lg p-6 cursor-pointer hover:bg-white/15 transition">
                    <Icon className="h-8 w-8 text-blue-400 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tool.credits} credits</p>
                    <Button size="sm" variant="outline">Try Now</Button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold">Simple Pricing</h2>
          <p className="mb-12 text-muted-foreground">Choose your plan</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Free', credits: '10', price: 'Free' },
              { name: 'Starter', credits: '300', price: '₹199/mo' },
              { name: 'Pro', credits: '1000', price: '₹499/mo' },
            ].map((plan) => (
              <div key={plan.name} className="glass rounded-lg p-6 text-left">
                <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold mb-4">{plan.price}</p>
                <p className="text-muted-foreground mb-4">{plan.credits} credits/month</p>
                <Link href="/pricing">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PixelMind AI Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
