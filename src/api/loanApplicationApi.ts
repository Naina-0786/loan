import api from './apiClient';

export interface LoanApplicationData {
  id?: number;
  email: string;
  phone?: string;
  loanAmount?: string;
  interest?: string;
  loanTenure?: string;
  aadharNumber?: string;
  panNumber?: string;
  fullName?: string;
  fatherName?: string;
  address?: string;
  pincode?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  processingFee?: any;
  processingFeeStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  bankTransactionPaperFee?: any;
  bankTransactionStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  insuranceFee?: any;
  insuranceStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  cibilFee?: any;
  cibilStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  tdsFee?: any;
  tdsStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  nocFee?: any;
  nocStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
}

export interface StepValidationResult {
  isValid: boolean;
  currentStep: number;
  completedSteps: number[];
  canProceed: boolean;
}

// Get loan application by ID
export const getLoanApplication = async (id: number): Promise<LoanApplicationData> => {
  const response = await api.get(`/loan-applications/${id}`);
  return response.data.data || response.data;
};

// Update loan application
export const updateLoanApplication = async (id: number, data: Partial<LoanApplicationData>): Promise<LoanApplicationData> => {
  // Check if we have file data
  const hasFiles = Object.values(data).some(value => value instanceof File);
  
  if (hasFiles) {
    const formData = new FormData();
    
    // Add all non-file fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.post(`/loan-applications/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  } else {
    // Use regular JSON for non-file updates
    const response = await api.post(`/loan-applications/${id}`, data);
    return response.data.data || response.data;
  }
};

// Check step validation and get current progress
export const getStepValidation = async (id: number): Promise<StepValidationResult> => {
  try {
    const application = await getLoanApplication(id);
    
    const completedSteps: number[] = [];
    let currentStep = 1;
    let canProceed = true;

    // Step 1: Login verification (always completed if we have the application)
    if (application.email) {
      completedSteps.push(1);
      currentStep = 2;
    }

  // Step 2: EMI Calculator
  if (application.loanAmount && application.interest && application.loanTenure) {
    completedSteps.push(2);
    currentStep = 3;
  }

  // Step 3: Bank Details
  if (application.bankName && application.accountNumber && application.ifscCode) {
    completedSteps.push(3);
    currentStep = 4;
  }

  // Step 4: KYC Documents
  if (application.aadharNumber && application.panNumber && application.fullName && application.fatherName && application.address) {
    completedSteps.push(4);
    currentStep = 5;
  }

  // Step 5: Processing Fee
  if (application.processingFee) {
    completedSteps.push(5);
    // Check if processing fee is approved by admin
    if (application.processingFeeStatus === 'APPROVED') {
      currentStep = 6;
    } else {
      canProceed = false; // Cannot proceed until admin approves
    }
  }

  // Step 6: Approval Letter
  if (application.processingFeeStatus === 'APPROVED') {
    completedSteps.push(6);
    currentStep = 7;
  }

  // Step 7: Bank Transaction Paper
  if (application.bankTransactionPaperFee) {
    completedSteps.push(7);
    if (application.bankTransactionStatus === 'APPROVED') {
      currentStep = 8;
    } else {
      canProceed = false;
    }
  }

  // Step 8: Insurance Policy
  if (application.insuranceFee) {
    completedSteps.push(8);
    if (application.insuranceStatus === 'APPROVED') {
      currentStep = 9;
    } else {
      canProceed = false;
    }
  }

  // Step 9: CIBIL Report
  if (application.cibilFee) {
    completedSteps.push(9);
    if (application.cibilStatus === 'APPROVED') {
      currentStep = 10;
    } else {
      canProceed = false;
    }
  }

  // Step 10: TDS Paper
  if (application.tdsFee) {
    completedSteps.push(10);
    if (application.tdsStatus === 'APPROVED') {
      currentStep = 11;
    } else {
      canProceed = false;
    }
  }

  // Step 11: NOC Paper
  if (application.nocFee) {
    completedSteps.push(11);
    if (application.nocStatus === 'APPROVED') {
      currentStep = 12; // All steps completed
    } else {
      canProceed = false;
    }
  }

    return {
      isValid: true,
      currentStep,
      completedSteps,
      canProceed
    };
  } catch (error) {
    console.error('Error validating steps:', error);
    // Return default state if validation fails
    return {
      isValid: false,
      currentStep: 1,
      completedSteps: [],
      canProceed: true
    };
  }
};

// Upload payment screenshot
export const uploadPaymentScreenshot = async (
  applicationId: number, 
  feeType: string, 
  file: File, 
  paymentData: any
): Promise<LoanApplicationData> => {
  const formData = new FormData();
  formData.append(feeType, file);
  
  // Add payment data
  Object.entries(paymentData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await api.post(`/loan-applications/${applicationId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};



export interface LoanApplication {
  id: number;
  email: string;
  phoneNumber: string | null;
  loanAmount: string | null;
  interest: string | null;
  loanTenure: number | null;
  aadharNumber: string | null;
  panNumber: string | null;
  fullName: string | null;
  fatherName: string | null;
  address: string | null;
  pincode: string | null;
  bankName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
  processingFee: any | null; // Json
  processingFeeStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  bankTransactionPaperFee: any | null;
  bankTransactionStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  insuranceFee: any | null;
  insuranceStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  cibilFee: any | null;
  cibilStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  tdsFee: any | null;
  tdsStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  nocFee: any | null;
  nocStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplicationsResponse {
  applications: LoanApplication[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  count: number;
}

export const getAllLoanApplications = async (page: number, limit: number, search: string, status: string) => {
  const response = await api.get('/loan-applications', {
    params: { page, limit, search, status }
  });
  return response.data.data as LoanApplicationsResponse;
};

export const getLoanApplicationById = async (id: number) => {
  const response = await api.get(`/loan-applications/${id}`);
  return response.data.data as LoanApplication;
};

export const updateFeeStatus = async (id: number, field: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
  const data = { [field]: status };
  const response = await api.post(`/loan-applications/${id}`, data);
  return response.data.data.data as LoanApplication;
};