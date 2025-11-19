import React from 'react';
import Protected from '../components/Protected';

export default function Admin() {
  return (
    <Protected allowRoles={["admin"]}>
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>
          <p className="text-slate-300">Hanya admin yang bisa mengakses halaman ini.</p>
        </div>
      </div>
    </Protected>
  );
}
