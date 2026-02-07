'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Copy, Users, Gift } from 'lucide-react';
import Link from 'next/link';

export default function ReferralPage() {
  const { user } = useAuth(); // ✅ use hook instead of useContext
  const [copied, setCopied] = useState(false);

  const referralLink = `https://pixelmindai.com/signup?ref=${user?.referralCode || 'unknown'}`;
  const referralStats = {
    totalReferrals: user?.referrals?.length || 0,
    creditsEarned: (user?.referrals?.length || 0) * 100,
    pendingRewards: 0,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">🎁 Referral Program</h1>
            <p className="text-lg text-muted-foreground">
              Earn free credits by inviting friends to PixelMind AI Studio
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <div className="glass rounded-lg p-6 text-center">
              <Users className="mx-auto mb-4 h-8 w-8 text-blue-400" />
              <div className="text-3xl font-bold">{referralStats.totalReferrals}</div>
              <div className="text-sm text-muted-foreground">Total Referrals</div>
            </div>
            <div className="glass rounded-lg p-6 text-center">
              <Gift className="mx-auto mb-4 h-8 w-8 text-green-400" />
              <div className="text-3xl font-bold">{referralStats.creditsEarned}</div>
              <div className="text-sm text-muted-foreground">Credits Earned</div>
            </div>
            <div className="glass rounded-lg p-6 text-center">
              <Gift className="mx-auto mb-4 h-8 w-8 text-yellow-400" />
              <div className="text-3xl font-bold">{referralStats.pendingRewards}</div>
              <div className="text-sm text-muted-foreground">Pending Rewards</div>
            </div>
          </div>

          {/* Share Section */}
          <div className="mb-12 glass rounded-lg p-8">
            <h2 className="mb-6 text-2xl font-bold">Share Your Referral Link</h2>

            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 rounded-lg bg-black/30 px-4 py-3 text-sm font-mono outline-none"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}