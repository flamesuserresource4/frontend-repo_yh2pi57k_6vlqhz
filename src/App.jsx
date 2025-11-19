import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Protected from './components/Protected';

export default function App() {
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userRaw ? JSON.parse(userRaw) : null;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Sistem Pelaporan Prestasi</Link>
          <nav className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <span className="text-slate-300">Halo, {user.name || user.email}</span>
                <button onClick={logout} className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700">Logout</button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500">Login</Link>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={
          <Protected allowRoles={["mahasiswa","admin","dosen"]}>
            <Dashboard />
          </Protected>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Routes>
    </div>
  );
}
