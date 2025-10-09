import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';

const AdminIndexRedirect = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen fullScreen={false} />;
  }

  // Define the order of pages to check for permissions
  const orderedPages = [
    { permission: 'can_manage_students', path: '/admin/users' },
    { permission: 'can_manage_admins', path: '/admin/users' },
    { permission: 'can_manage_classes', path: '/admin/users' },
    { permission: 'can_manage_weeks', path: '/admin/weeks' },
    { permission: 'can_manage_points', path: '/admin/points' },
  ];

  // Find the first page the user has permission to view
  const redirectTo = orderedPages.find(page => user?.[page.permission])?.path;

  // If a valid page is found, redirect. Otherwise, fallback to a default or show an error.
  // A fallback to '/admin/users' is safe as a default, but this logic ensures it's permission-based.
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  // Fallback for an admin who has no permissions (unlikely case)
  // Or, you could render a "No Access" component here.
  return <Navigate to="/login" replace />;
};

export default AdminIndexRedirect;