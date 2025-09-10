// Core stepper types and interfaces
export interface StepData {
  id: number;
  title: string;
  status: 'pending' | 'completed' | 'current';
  isValid: boolean;
  data: Record<string, any>;
}

export interface StepperState {
  currentStep: number;
  steps: StepData[];
  isComplete: boolean;
}

export interface StepProps {
  data: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onValidationChange: (isValid: boolean) => void;
}

// Form data models for each step
export interface LoginData {
  mobileNumber: string;
  otp: string;
  isVerified: boolean;
}

export interface EMIData {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  tenureType: 'months' | 'years';
  calculatedEMI?: number;
  totalInterest?: number;
  totalPayment?: number;
}

export interface KYCData {
  aadhaarFile: File | null;
  panFile: File | null;
  fullName: string;
  fatherName: string;
  address: string;
}

export interface PaymentData {
  paymentMethod: 'upi' | 'card' | 'netbanking';
  paymentId?: string;
  screenshotFile: File | null;
  amount: number;
  status: 'pending' | 'completed';
}

// Validation and error types
export interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'format' | 'size' | 'network';
}

export interface ErrorState {
  stepErrors: Record<number, ValidationError[]>;
  globalError: string | null;
  isLoading: boolean;
}

// Stepper actions for useReducer
export type StepperAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_STEP_DATA'; payload: { stepId: number; data: Record<string, any> } }
  | { type: 'SET_STEP_VALID'; payload: { stepId: number; isValid: boolean } }
  | { type: 'COMPLETE_STEPPER' }
  | { type: 'RESET_STEPPER' };

// Context type
export interface StepperContextType {
  state: StepperState;
  dispatch: React.Dispatch<StepperAction>;
  updateStepData: (stepId: number, data: Record<string, any>) => void;
  validateStep: (stepId: number) => boolean;
  navigateToStep: (stepId: number) => void;
  nextStep: () => void;
  previousStep: () => void;
}