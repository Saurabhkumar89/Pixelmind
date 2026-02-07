'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Menu } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl smooth-transition hover:opacity-80">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <span>PixelMind</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">
              Pricing
            </a>
            <a href="#tools" className="text-sm text-muted-foreground hover:text-foreground smooth-transition">
              Tools
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-muted-foreground">
                  {user?.credits || 0} credits
                </div>
                <Link href="/dashboard">
                  <Button size="sm" variant="outline">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button size="sm" variant="ghost">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary smooth-transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="py-3 space-y-2">
              <a href="#features" className="block px-3 py-2 rounded-lg text-sm hover:bg-secondary">
                Features
              </a>
              <a href="#pricing" className="block px-3 py-2 rounded-lg text-sm hover:bg-secondary">
                Pricing
              </a>
              <a href="#tools" className="block px-3 py-2 rounded-lg text-sm hover:bg-secondary">
                Tools
              </a>
            </div>
            <div className="pt-3 border-t border-border space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="block w-full">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block w-full">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="block w-full">
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
