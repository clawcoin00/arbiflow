"use client";

import { useEffect, useState } from 'react';

type User = { id: string; email: string; plan: 'FREE' | 'PRO'; createdAt: string };

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'FREE' | 'PRO'>('FREE');

  const load = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
  };

  useEffect(() => { load(); }, []);

  const upsert = async () => {
    await fetch('/api/auth/upsert-user', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, plan }),
    });
    setEmail('');
    setPlan('FREE');
    await load();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">ArbiFlow Admin (MVP)</h1>
        <div className="border border-zinc-800 rounded-xl p-4 space-y-2">
          <h2 className="font-semibold">Criar/atualizar usuário</h2>
          <div className="flex gap-2">
            <input className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" />
            <select className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2" value={plan} onChange={(e)=>setPlan(e.target.value as any)}>
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
            </select>
            <button className="bg-emerald-600 px-4 rounded" onClick={upsert}>Salvar</button>
          </div>
        </div>

        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900"><tr><th className="p-2 text-left">Email</th><th className="p-2 text-left">Plan</th><th className="p-2 text-left">Criado em</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-zinc-800">
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.plan}</td>
                  <td className="p-2">{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
