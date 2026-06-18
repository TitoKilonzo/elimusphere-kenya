import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import LoadingScreen from '../ui/LoadingScreen';

interface ProtectedRouteProps {
  allow: UserRole[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allow, children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen label="Checking your session..." />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!allow.includes(user.role)) {
    // Logged in, but this isn't their portal - send them home.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
