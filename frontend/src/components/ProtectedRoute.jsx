import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen fullScreen={true} />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    // This case should ideally not be reached if isLoading is false and there's a token,
    // but as a fallback, redirect to login.
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect if the user's role is not allowed
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;