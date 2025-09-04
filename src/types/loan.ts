export interface LoanType {
  id: string;
  name: string;
  description: string;
  icon: string;
  interestRate: string;
  maxAmount: string;
}

export interface PersonalInfo {
  fullName: string;
  age: number;
  address: string;
  employmentStatus: string;
  annualIncome: number;
}

export interface LoanSelection {
  loanType: string;
  loanAmount: number;
  tenure: number;
}

export interface EMICalculation {
  monthlyEMI: number;
  totalInterest: number;
  totalRepayment: number;
}

export interface ApplicationData {
  personalInfo: PersonalInfo;
  loanSelection: LoanSelection;
  calculation: EMICalculation;
}