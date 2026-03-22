"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BrandLogo } from '@/src/components/BrandLogo';

type User = { id: string; email: string; plan: 'FREE' | 'PRO'; createdAt: string };

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'FREE' | 'PRO'>('FREE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setUsers([]);
      setError(
        data.error === 'supabase_admin_not_configured'
          ? 'Configure SUPABASE_SERVICE_ROLE_KEY para listar e editar usuarios reais do Supabase.'
          : 'Unable to load users right now.',
      );
      return;
    }

    setError('');
    setUsers(data.users || []);
  };

  useEffect(() => { load(); }, []);

  const upsert = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/upsert-user', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'save_failed');
      }
      setEmail('');
      setPlan('FREE');
      setError('');
      await load();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'save_failed';
      setError(
        message === 'supabase_admin_not_configured'
          ? 'Configure SUPABASE_SERVICE_ROLE_KEY para editar planos pelo admin.'
          : 'Unable to save user right now.',
      );
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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0b]/90 backdrop-blur-xl">
        <div className="container-editorial flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo variant="full" height={30} />
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-mono text-xs text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/pricing" className="text-mono text-xs text-zinc-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/admin" className="text-mono text-xs text-white">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-32 pb-16">
        <div className="container-editorial">
          {/* Header */}
          <div className="mb-12">
            <h1 className="heading-mono text-xs text-zinc-500 mb-4">Admin</h1>
            <p className="heading-display text-3xl text-white">User Management</p>
            {error ? <p className="text-sm text-red-400 mt-4">{error}</p> : null}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="stat-card">
              <div className="stat-value text-white">{stats.total}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value gradient-text">{stats.pro}</div>
              <div className="stat-label">Pro Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-white">{stats.free}</div>
              <div className="stat-label">Free Users</div>
            </div>
          </div>

          {/* Add User */}
          <div className="card-elevated mb-8">
            <h2 className="heading-mono text-xs text-zinc-500 mb-4">Add / Update User</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                className="input-refined flex-1"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select
                className="input-refined sm:w-40"
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
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="card-elevated">
            <h2 className="heading-mono text-xs text-zinc-500 mb-6">All Users</h2>
            
            <div className="overflow-x-auto">
              <table className="table-editorial">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-12">
                        <span className="text-mono text-xs text-zinc-500">No users yet</span>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <span className="text-white">{user.email}</span>
                        </td>
                        <td>
                          <span className={user.plan === 'PRO' ? 'plan-badge-pro' : 'plan-badge-free'}>
                            {user.plan}
                          </span>
                        </td>
                        <td>
                          <span className="text-mono text-xs text-zinc-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="card-elevated mt-8">
            <h2 className="heading-mono text-xs text-zinc-500 mb-4">API Endpoints</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { method: 'GET', path: '/api/opportunities' },
                { method: 'POST', path: '/api/scan' },
                { method: 'POST', path: '/api/test-telegram' },
                { method: 'POST', path: '/api/billing/checkout' },
              ].map((ep, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`text-mono text-[10px] font-bold uppercase ${
                    ep.method === 'GET' ? 'text-emerald-400' : 'text-cyan-400'
                  }`}>
                    {ep.method}
                  </span>
                  <code className="text-mono text-xs text-zinc-300">{ep.path}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="container-editorial">
          <div className="flex items-center justify-center">
            <span className="text-mono text-[10px] text-zinc-600">Admin Dashboard — ArbsFlow 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

