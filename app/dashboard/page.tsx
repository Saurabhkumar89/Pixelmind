'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Palette, Zap, Maximize2, Wand2, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { NotificationCenter, Gift, Settings, ArrowRight } from '@/components/Icons'; // Added imports

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) return null;

  const tools = [
    { icon: Sparkles, title: 'AI Image Generator', href: '/ai/text-to-image', credits: 2 },
    { icon: Palette, title: 'Remove Background', href: '/ai/background-remove', credits: 1 },
    { icon: Zap, title: 'Upscale Image', href: '/ai/upscale', credits: 2 },
    { icon: Maximize2, title: 'Expand Canvas', href: '/ai/expand', credits: 3 },
    { icon: Wand2, title: 'Prompt Edit', href: '/ai/prompt-edit', credits: 2 },
    { icon: Sparkles, title: 'Generative Fill', href: '/ai/generative-fill', credits: 2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user.fullName}!</h1>
              <p className="text-muted-foreground">Plan: {user.plan.toUpperCase()}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Credits Card */}
          <div className="mb-12 glass rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Available Credits</p>
                <p className="text-5xl font-bold text-blue-400">{user.credits}</p>
              </div>
              <Link href="/pricing">
                <Button>Get More Credits</Button>
              </Link>
            </div>
          </div>

          {/* Tools Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-6">AI Tools</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const canUse = user.credits >= tool.credits;
                return (
                  <Link key={tool.href} href={canUse ? tool.href : '#'}>
                    <div className={`glass rounded-lg p-6 transition ${canUse ? 'hover:bg-white/15 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                      <Icon className="h-8 w-8 text-blue-400 mb-4" />
                      <h3 className="font-semibold mb-2">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{tool.credits} credits</p>
                      <Button size="sm" variant="outline" className="w-full bg-transparent" disabled={!canUse}>
                        {canUse ? 'Use Tool' : 'Insufficient Credits'}
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
