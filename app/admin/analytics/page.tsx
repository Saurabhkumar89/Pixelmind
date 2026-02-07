'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

export default function AdminAnalyticsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    }
    setLoading(false);
  }, [token, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Analytics</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Usage by Tool */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Usage by Tool</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Text-to-Image</span>
                    <span className="font-mono">1,234</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400" style={{ width: '45%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Background Remove</span>
                    <span className="font-mono">892</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400" style={{ width: '32%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Upscale</span>
                    <span className="font-mono">567</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: '20%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Other Tools</span>
                    <span className="font-mono">423</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Growth */}
            <div className="glass rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Monthly Growth</h2>
              <div className="space-y-4">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => (
                  <div key={month}>
                    <div className="flex justify-between mb-2">
                      <span>{month}</span>
                      <span className="font-mono">{Math.floor(Math.random() * 5000) + 1000}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400"
                        style={{ width: `${40 + idx * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
