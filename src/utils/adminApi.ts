const API_BASE_URL = '/api/admin';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Admin Authentication API
export const adminAuthAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Admin Management API
export const adminManagementAPI = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    
    const response = await fetch(`${API_BASE_URL}?${params}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  create: async (adminData: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(adminData),
    });
    return handleResponse(response);
  },

  update: async (id: number, adminData: { name: string; email: string; password?: string }) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(adminData),
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Payment Fee Management API
export const paymentFeeAPI = {
  getConfig: async () => {
    const response = await fetch(`${API_BASE_URL}/payment-fees/config`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  create: async (feeData: any) => {
    const response = await fetch(`${API_BASE_URL}/payment-fees`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(feeData),
    });
    return handleResponse(response);
  },

  update: async (id: number, feeData: any) => {
    const response = await fetch(`${API_BASE_URL}/payment-fees/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(feeData),
    });
    return handleResponse(response);
  },
};

// Loan Application Management API
export const loanApplicationAPI = {
  getAll: async (page = 1, limit = 10, search = '', status = '', sortBy = 'createdAt', sortOrder = 'desc') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status }),
      sortBy,
      sortOrder,
    });
    
    const response = await fetch(`${API_BASE_URL}/loan-applications?${params}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/loan-applications/${id}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  updateFeeStatus: async (id: number, feeType: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/loan-applications/${id}/fees`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ feeType, status }),
    });
    return handleResponse(response);
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },
};