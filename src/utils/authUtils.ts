// JWT and Auth utility functions

interface DecodedToken {
  sub: string; // email
  user: {
    id: number;
    email: string;
    name: string;
  };
  roles: string[];
  iat: number;
  exp: number;
}

/**
 * Decode JWT token without verification (for frontend use only)
 */
export const decodeJWT = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Get current user roles from localStorage token
 */
export const getCurrentUserRoles = (): string[] => {
  const token = localStorage.getItem('accessToken');
  if (!token) return [];
  
  const decoded = decodeJWT(token);
  return decoded?.roles || [];
};

/**
 * Check if current user has a specific role
 */
export const hasRole = (role: string): boolean => {
  const roles = getCurrentUserRoles();
  return roles.includes(role);
};

/**
 * Check if current user is Manager
 */
export const isManager = (): boolean => {
  return hasRole('ROLE_MANAGER');
};

/**
 * Check if current user is Accountant
 */
export const isAccountant = (): boolean => {
  return hasRole('ROLE_ACCOUNTANT');
};

/**
 * Check if current user has any of the specified roles
 */
export const hasAnyRole = (roles: string[]): boolean => {
  const userRoles = getCurrentUserRoles();
  return roles.some(role => userRoles.includes(role));
};

/**
 * Get current user information from token
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.user || null;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  const token = localStorage.getItem('accessToken');
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Role constants
 */
export const ROLES = {
  MANAGER: 'ROLE_MANAGER',
  ACCOUNTANT: 'ROLE_ACCOUNTANT'
} as const; 