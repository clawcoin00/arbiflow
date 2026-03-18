"use client";

import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

type User = { id: string; email: string; plan: 'FREE' | 'PRO'; createdAt: string };

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'FREE' | 'PRO'>('FREE');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
  };

  useEffect(() => { load(); }, []);

  const upsert = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/auth/upsert-user', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, plan }),
      });
      setEmail('');
      setPlan('FREE');
      await load();
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: users.length,
    pro: users.filter(u => u.plan === 'PRO').length,
    free: users.filter(u => u.plan === 'FREE').length,
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-zinc-400">Manage users and subscriptions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="card text-center">
              <div className="text-3xl font-bold text-zinc-100">{stats.total}</div>
              <div className="text-zinc-400 text-sm mt-1">Total Users</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold gradient-text">{stats.pro}</div>
              <div className="text-zinc-400 text-sm mt-1">Pro Users</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-zinc-100">{stats.free}</div>
              <div className="text-zinc-400 text-sm mt-1">Free Users</div>
            </div>
          </div>

          {/* Add User */}
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Add / Update User</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                className="input flex-1"
                placeholder="user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select
                className="input sm:w-40"
                value={plan}
                onChange={(e) => setPlan(e.target.value as 'FREE' | 'PRO')}
              >
                <option value="FREE">FREE</option>
                <option value="PRO">PRO</option>
              </select>
              <button
                className="btn-primary whitespace-nowrap"
                onClick={upsert}
                disabled={loading || !email}
              >
                {loading ? 'Saving...' : 'Save User'}
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Plan</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-zinc-500">
                        No users yet
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="py-4 px-4 font-medium">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            user.plan === 'PRO'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-zinc-700 text-zinc-300'
                          }`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-zinc-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* API Info */}
          <div className="card mt-8">
            <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs">GET</span>
                <code className="text-zinc-300">/api/opportunities</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 font-mono text-xs">POST</span>
                <code className="text-zinc-300">/api/scan</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 font-mono text-xs">POST</span>
                <code className="text-zinc-300">/api/test-telegram</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 font-mono text-xs">POST</span>
                <code className="text-zinc-300">/api/billing/checkout</code>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}