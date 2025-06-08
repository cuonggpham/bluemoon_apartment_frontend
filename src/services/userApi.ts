import api  from './axios';

export interface User {
  id: number;
  name: string;
  email: string;
  authType: string;
  isActive: number;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: number;
}

export interface UserCreateRequest {
  name: string;
  username: string; // email
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  authType?: string;
  isActive?: number;
  roles?: Role[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// User CRUD operations
export const userApi = {
  // Get all users
  getAll: async (): Promise<UserResponse[]> => {
    console.log('userApi.getAll called');
    const response = await api.get('/users');
    console.log('API response:', response);
    console.log('Response data:', response.data);
    
    // Handle both wrapped and unwrapped responses
    let users;
    if (response.data.data) {
      users = response.data.data;
    } else if (Array.isArray(response.data)) {
      users = response.data;
    } else {
      users = [];
    }
    console.log('Extracted users:', users);
    
    // Add default values for missing fields
    const mappedUsers = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      authType: user.authType || 'LOCAL',
      isActive: user.isActive !== undefined ? user.isActive : 1,
      roles: user.roles || []
    }));
    
    console.log('Mapped users:', mappedUsers);
    return mappedUsers;
  },

  // Get user by ID
  getById: async (id: number): Promise<UserResponse> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  // Create new user
  create: async (userData: UserCreateRequest): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data.data;
  },

  // Update user
  update: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  },

  // Delete user (soft delete)
  delete: async (id: number): Promise<ApiResponse<string>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data.data;
  },

  // Role management
  getUserRoles: async (userId: number): Promise<Role[]> => {
    const response = await api.get(`/users/${userId}/roles`);
    return response.data.data;
  },

  assignRolesToUser: async (userId: number, roleIds: number[]): Promise<void> => {
    await api.put(`/users/${userId}/roles`, roleIds);
  },

  addRoleToUser: async (userId: number, roleId: number): Promise<void> => {
    await api.post(`/users/${userId}/roles/${roleId}`);
  },

  removeRoleFromUser: async (userId: number, roleId: number): Promise<void> => {
    await api.delete(`/users/${userId}/roles/${roleId}`);
  }
};

// Role operations
export const roleApi = {
  // Get all roles
  getAll: async (): Promise<Role[]> => {
    const response = await api.get('/roles');
    return response.data.data;
  },

  // Get role by ID
  getById: async (id: number): Promise<Role> => {
    const response = await api.get(`/roles/${id}`);
    return response.data.data;
  },

  // Get role by name
  getByName: async (name: string): Promise<Role> => {
    const response = await api.get(`/roles/name/${name}`);
    return response.data.data;
  },

  // Create new role
  create: async (roleData: Omit<Role, 'id'>): Promise<Role> => {
    const response = await api.post('/roles', roleData);
    return response.data.data;
  },

  // Update role
  update: async (id: number, roleData: Partial<Role>): Promise<Role> => {
    const response = await api.put(`/roles/${id}`, roleData);
    return response.data.data;
  },

  // Delete role
  delete: async (id: number): Promise<void> => {
    await api.delete(`/roles/${id}`);
  }
}; 