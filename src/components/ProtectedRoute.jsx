import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Tunggu sampai auth selesai di-fetch
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Jika tidak ada token (belum login), redirect ke login page dengan info redirect url
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika perlu role tertentu
  if (allowedRoles) {
    // Jika user belum termuat tapi ada token, anggap masih loading
    if (!user) {
      return <div className="min-h-screen flex items-center justify-center">Loading user data...</div>;
    }
    
    // Jika role user tidak ada di daftar allowedRoles
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/home" replace />;
    }
  }

  return <Outlet />;
};
