export interface LoanCalculatorInputs {
  principal: number;
  interestRate: number;
  tenure: number; // in months
}

export interface LoanCalculatorResults {
  monthlyEMI: number;
  totalInterest: number;
  totalRepayment: number;
}

export function calculateEMI(inputs: LoanCalculatorInputs): LoanCalculatorResults {
  const { principal, interestRate, tenure } = inputs;
  
  // Convert annual interest rate to monthly and percentage to decimal
  const monthlyRate = interestRate / (12 * 100);
  
  // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  
  const totalRepayment = emi * tenure;
  const totalInterest = totalRepayment - principal;
  
  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(totalRepayment)
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}