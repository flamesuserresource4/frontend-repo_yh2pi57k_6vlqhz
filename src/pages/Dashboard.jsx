import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { AchievementStatus } from '../types';
import DynamicAchievementForm from '../components/DynamicAchievementForm';

const badge = (s) => {
  const map = {
    draft: 'bg-slate-700 text-slate-200',
    submitted: 'bg-blue-700 text-blue-100',
    verified: 'bg-emerald-700 text-emerald-100',
    rejected: 'bg-rose-700 text-rose-100',
  };
  return `px-2 py-1 rounded-md text-xs font-medium ${map[s] || 'bg-slate-700 text-slate-200'}`;
};

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/achievements');
      setItems(data?.data || data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submitForVerification = async (id) => {
    await api.post(`/achievements/${id}/submit`);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Hapus item ini?')) return;
    await api.delete(`/achievements/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded-2xl border border-slate-700 bg-slate-800/50">
          <h2 className="text-lg font-semibold mb-3">Buat Laporan Prestasi</h2>
          <DynamicAchievementForm onCreated={load} />
        </div>

        <div className="p-4 rounded-2xl border border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Daftar Prestasi</h2>
            <button onClick={load} className="text-sm text-blue-400 hover:underline">Refresh</button>
          </div>
          {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
          {loading ? (
            <div className="text-slate-300">Memuat...</div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id || it._id} className="p-3 rounded-xl border border-slate-700 bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{it.title}</div>
                      <div className="text-xs text-slate-400">{it.achievementType}</div>
                    </div>
                    <span className={badge(it.status)}>{it.status}</span>
                  </div>

                  <div className="mt-2 flex gap-2">
                    {it.status === AchievementStatus.DRAFT && (
                      <>
                        <button onClick={() => submitForVerification(it.id || it._id)} className="px-2 py-1 text-xs bg-blue-700 rounded-md">Ajukan Verifikasi</button>
                        <button onClick={() => remove(it.id || it._id)} className="px-2 py-1 text-xs bg-rose-700 rounded-md">Hapus</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="text-slate-400">Belum ada data.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
