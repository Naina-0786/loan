import api from './apiClient'; 

export interface Admin {
  id: number;
  name: string;
  email: string;
  created: string;
  updated: string;
}

export interface AdminFormData {
  name: string;
  email: string;
  password?: string; // Make password optional for updates
}

export const getAllAdmins = async (page: number, limit: number, search: string) => {
  const response = await api.get('/admin/all', {
    params: { page, limit, search }
  });
  return response.data;
};

export const createAdmin = async (data: AdminFormData) => {
  const response = await api.post('/admin/create', data);
  return response.data;
};

export const adminLogin = async (email: string, password: string) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

export const updateAdmin = async (id: number, data: AdminFormData) => {
  // If password is empty, remove it from the payload to avoid updating with empty string
  const payload: Partial<AdminFormData> = {
    name: data.name,
    email: data.email,
  };
  // If password is empty, do not include it in the payload to avoid updating with an empty string
  if (data.password !== '') {
    payload.password = data.password;
  }
  const response = await api.put(`/admin/${id}`, payload);
  return response.data;
};

export const deleteAdmin = async (id: number) => {
  const response = await api.delete(`/admin/${id}`);
  return response.data;
};

// Payment Fee Management
export interface PaymentFee {
  id: number;
  processingFee: string;
  bankTransactionPaperFee: string;
  insuranceFee: string;
  cibilFee: string;
  tdsFee: string;
  nocFee: string;
}

export const getPaymentFees = async () => {
  const response = await api.get('/admin/payment-fees');
  return response.data;
};

export const updatePaymentFee = async (id: number, data: Partial<PaymentFee>) => {
  const response = await api.put(`/admin/payment-fees/${id}`, data);
  return response.data;
};

// Loan Application Management
export interface LoanApplication {
  id: number;
  email: string;
  phone: string;
  fullName: string;
  loanAmount: string;
  interest: string;
  loanTenure: number;
  processingFeeStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  bankTransactionStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  insuranceStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  cibilStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  tdsStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  nocStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export const getAllLoanApplications = async (page: number, limit: number, search: string, status: string) => {
  const response = await api.get('/admin/loan-applications', {
    params: { page, limit, search, status }
  });
  return response.data;
};

export const updateFeeStatus = async (applicationId: number, feeType: string, status: 'APPROVED' | 'REJECTED') => {
  const response = await api.put(`/admin/loan-applications/${applicationId}/fees/${feeType}`, { status });
  return response.data;
};

// Dashboard Statistics
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/stats');
  return response.data;
};