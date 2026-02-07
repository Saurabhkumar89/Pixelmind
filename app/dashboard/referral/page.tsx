'use client';

import { useContext, useState } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Users, Gift } from 'lucide-react';
import Link from 'next/link';

export default function ReferralPage() {
  const { user } = useContext(AuthContext) || {};
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

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { name: 'Twitter', icon: '𝕏' },
                { name: 'Facebook', icon: 'f' },
                { name: 'Email', icon: '✉' },
              ].map((social) => (
                <Button key={social.name} variant="outline" className="gap-2 bg-transparent">
                  <span>{social.icon}</span>
                  Share on {social.name}
                </Button>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">How It Works</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Share Your Link', desc: 'Copy and share your unique referral link with friends' },
                { step: 2, title: 'Friend Joins', desc: 'Your friend signs up using your referral link' },
                { step: 3, title: 'Get Rewards', desc: 'Earn 100 free credits for each successful referral' },
                { step: 4, title: 'No Limits', desc: 'Keep referring to earn unlimited credits!' },
              ].map((item) => (
                <div key={item.step} className="glass rounded-lg p-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Referrals */}
          <div className="glass rounded-lg p-8">
            <h2 className="mb-6 text-2xl font-bold">Recent Referrals</h2>
            
            {user?.referrals && user.referrals.length > 0 ? (
              <div className="space-y-2">
                {user.referrals.slice(0, 5).map((referral, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                    <div>
                      <div className="font-medium">{referral.email}</div>
                      <div className="text-sm text-muted-foreground">
                        Joined {new Date(referral.joinedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="badge-success">+100 credits</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No referrals yet. Start sharing to earn rewards!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
