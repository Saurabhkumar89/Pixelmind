'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>Error loading stats</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Users</p>
                  <p className="text-4xl font-bold">{stats.totalUsers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="glass rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Credits Used</p>
                  <p className="text-4xl font-bold">{stats.totalCreditsUsed || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="glass rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Revenue</p>
                  <p className="text-4xl font-bold">₹{stats.totalRevenue || 0}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/admin/users">
              <div className="glass rounded-lg p-6 cursor-pointer hover:bg-white/15 transition">
                <h3 className="font-semibold text-lg mb-2">Manage Users</h3>
                <p className="text-muted-foreground text-sm">View and edit user accounts</p>
                <Button className="mt-4 w-full">Manage</Button>
              </div>
            </Link>

            <Link href="/admin/credits">
              <div className="glass rounded-lg p-6 cursor-pointer hover:bg-white/15 transition">
                <h3 className="font-semibold text-lg mb-2">Credit Management</h3>
                <p className="text-muted-foreground text-sm">Adjust user credits manually</p>
                <Button className="mt-4 w-full">Manage</Button>
              </div>
            </Link>

            <Link href="/admin/analytics">
              <div className="glass rounded-lg p-6 cursor-pointer hover:bg-white/15 transition">
                <h3 className="font-semibold text-lg mb-2">Analytics</h3>
                <p className="text-muted-foreground text-sm">View detailed usage analytics</p>
                <Button className="mt-4 w-full">View</Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
