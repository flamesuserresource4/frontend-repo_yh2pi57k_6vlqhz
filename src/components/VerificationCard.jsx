import React, { useState } from 'react';
import api from '../services/api';

export default function VerificationCard({ achievementId, onAction }) {
  const [loading, setLoading] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const doVerify = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post(`/achievements/${achievementId}/verify`);
      onAction && onAction('verified');
    } catch (e) {
      setError(e?.response?.data?.message || 'Gagal memverifikasi');
    } finally {
      setLoading(false);
    }
  };

  const doReject = async () => {
    if (!note.trim()) {
      setError('Rejection note wajib diisi');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post(`/achievements/${achievementId}/reject`, { rejection_note: note });
      onAction && onAction('rejected');
      setShowReject(false);
      setNote('');
    } catch (e) {
      setError(e?.response?.data?.message || 'Gagal menolak');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/50">
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <div className="flex items-center gap-2">
        <button disabled={loading} onClick={doVerify} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50">Verify</button>
        <button disabled={loading} onClick={() => setShowReject(true)} className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg disabled:opacity-50">Reject</button>
      </div>

      {showReject && (
        <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-700">
          <label className="text-sm text-slate-200">Rejection Note</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500" rows={3} />
          <div className="mt-2 flex gap-2">
            <button disabled={loading} onClick={doReject} className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg disabled:opacity-50">Kirim Penolakan</button>
            <button type="button" onClick={() => setShowReject(false)} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}
