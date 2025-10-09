import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';

const AdminIndexRedirect = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen fullScreen={false} />;
  }

  if (user) {
    // Check permissions in a specific order and redirect to the first available page
    if (user.can_manage_students || user.can_manage_admins || user.can_manage_classes) {
      return <Navigate to="/admin/users" replace />;
    }
    if (user.can_manage_weeks) {
      return <Navigate to="/admin/weeks" replace />;
    }
    if (user.can_manage_points) {
      return <Navigate to="/admin/points" replace />;
    }
  }

  // Fallback for an admin who has no permissions or if user object is not available
  return <Navigate to="/login" replace />;
};

export default AdminIndexRedirect;