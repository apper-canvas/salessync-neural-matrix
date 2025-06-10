import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingState from '@/components/molecules/LoadingState';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState>
          <div className="text-center">
            <div className="h-8 bg-surface-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-surface-100 rounded w-32 mx-auto"></div>
          </div>
        </LoadingState>
      </div>
    );
  }
if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;