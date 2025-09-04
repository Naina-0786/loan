import React from 'react';
import { motion } from 'framer-motion';
import { ApplicationData } from '../../types/loan';
import { loanTypes } from '../../data/loanTypes';
import { formatCurrency } from '../../utils/loanCalculator';
import Card from '../ui/Card';
import { Edit } from 'lucide-react';

interface ReviewStepProps {
  data: ApplicationData;
  onEdit: (step: number) => void;
}

export default function ReviewStep({ data, onEdit }: ReviewStepProps) {
  const selectedLoanType = loanTypes.find(type => type.id === data.loanSelection.loanType);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h3>
        <p className="text-gray-600">
          Please review your application details before submitting
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
          <button
            onClick={() => onEdit(1)}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Full Name:</span>
            <span className="ml-2 font-medium">{data.personalInfo.fullName}</span>
          </div>
          <div>
            <span className="text-gray-600">Age:</span>
            <span className="ml-2 font-medium">{data.personalInfo.age} years</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-600">Address:</span>
            <span className="ml-2 font-medium">{data.personalInfo.address}</span>
          </div>
          <div>
            <span className="text-gray-600">Employment:</span>
            <span className="ml-2 font-medium capitalize">{data.personalInfo.employmentStatus.replace('-', ' ')}</span>
          </div>
          <div>
            <span className="text-gray-600">Annual Income:</span>
            <span className="ml-2 font-medium">{formatCurrency(data.personalInfo.annualIncome)}</span>
          </div>
        </div>
      </Card>

      {/* Loan Details */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Loan Details</h4>
          <button
            onClick={() => onEdit(2)}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Loan Type:</span>
            <span className="ml-2 font-medium">{selectedLoanType?.name}</span>
          </div>
          <div>
            <span className="text-gray-600">Loan Amount:</span>
            <span className="ml-2 font-medium">{formatCurrency(data.loanSelection.loanAmount)}</span>
          </div>
          <div>
            <span className="text-gray-600">Tenure:</span>
            <span className="ml-2 font-medium">{Math.round(data.loanSelection.tenure / 12)} years</span>
          </div>
          <div>
            <span className="text-gray-600">Interest Rate:</span>
            <span className="ml-2 font-medium">{selectedLoanType?.interestRate}</span>
          </div>
        </div>
      </Card>

      {/* EMI Summary */}
      <Card>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">EMI Summary</h4>
        
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.calculation.monthlyEMI)}
              </div>
              <div className="text-sm text-gray-600">Monthly EMI</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(data.calculation.totalInterest)}
              </div>
              <div className="text-sm text-gray-600">Total Interest</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(data.calculation.totalRepayment)}
              </div>
              <div className="text-sm text-gray-600">Total Repayment</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Declaration */}
      <Card>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Declaration:</strong> I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to rejection of my application.
          </p>
          <p>
            I agree to the <a href="#terms" className="text-blue-600 hover:underline">Terms & Conditions</a> and <a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}