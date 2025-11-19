import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Protected({ children, allowRoles }) {
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;

  if (!user) return <Navigate to="/login" replace />;

  if (allowRoles && !allowRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
