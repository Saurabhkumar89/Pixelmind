'use client';

import React from "react"

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminCreditsPage() {
  const { token } = useAuth();
  const [userId, setUserId] = useState('');
  const [credits, setCredits] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdjustCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/adjust-credits`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, credits: parseInt(credits) }),
        }
      );

      if (res.ok) {
        setMessage('Credits updated successfully');
        setUserId('');
        setCredits('');
      } else {
        setMessage('Error updating credits');
      }
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold mb-8">Credit Management</h1>

          <div className="glass rounded-lg p-8">
            <h2 className="text-xl font-bold mb-6">Adjust User Credits</h2>

            <form onSubmit={handleAdjustCredits} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">User ID</label>
                <Input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Credits to Add/Remove</label>
                <Input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  placeholder="Enter amount (negative to subtract)"
                  required
                />
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('successfully')
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {message}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Processing...' : 'Adjust Credits'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
