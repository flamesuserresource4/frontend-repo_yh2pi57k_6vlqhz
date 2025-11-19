import React, { useState } from 'react';
import api from '../services/api';

const input = 'w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { token, user } = data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/';
    } catch (e) {
      setError(e?.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={submit} className="w-full max-w-md p-6 rounded-2xl bg-slate-800/60 border border-slate-700">
        <h1 className="text-2xl font-semibold text-white mb-4">Masuk</h1>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <div className="space-y-3">
          <input className={input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={input} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50" disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
