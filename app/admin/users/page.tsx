'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchUsers();
  }, [token, router]);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage all users and their credits</p>
          </div>

          <div className="mb-8 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="glass rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Plan</th>
                  <th className="px-6 py-4 text-left font-semibold">Credits</th>
                  <th className="px-6 py-4 text-left font-semibold">Joined</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.fullName}</td>
                    <td className="px-6 py-4 capitalize font-semibold">{user.plan}</td>
                    <td className="px-6 py-4 font-mono">{user.credits}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No users found
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>
    </div>
  );
}
