import React from 'react';
import { hasRole, hasAnyRole } from '../utils/authUtils';

interface ProtectedComponentProps {
  roles?: string[];
  role?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render content based on user roles
 */
const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ 
  roles, 
  role, 
  children, 
  fallback = null 
}) => {
  let hasPermission = false;

  if (role) {
    hasPermission = hasRole(role);
  } else if (roles && roles.length > 0) {
    hasPermission = hasAnyRole(roles);
  } else {
    // If no roles specified, allow access (default behavior)
    hasPermission = true;
  }

  if (hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default ProtectedComponent; 