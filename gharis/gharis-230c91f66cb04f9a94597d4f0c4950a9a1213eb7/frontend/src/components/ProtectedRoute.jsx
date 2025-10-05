import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If no user object is available yet but token exists,
  // it might be still decoding. Can add a loading state here.
  if (!user) {
    return <div>Loading...</div>; // Or a spinner component
  }

  const userRole = user.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect if the user's role is not allowed
    // A student trying to access an admin route should be redirected to their dashboard
    return <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;