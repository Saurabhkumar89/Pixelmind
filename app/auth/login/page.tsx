'use client';

import React from "react"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="glass rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-xl">PixelMind</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 smooth-transition">
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium smooth-transition">
              Create one
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-2">Demo credentials:</p>
            <p className="text-xs text-foreground">Email: demo@example.com</p>
            <p className="text-xs text-foreground">Password: demo1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
