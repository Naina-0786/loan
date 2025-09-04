import React from 'react';
import { motion } from 'framer-motion';
import { LoanSelection } from '../../types/loan';
import { loanTypes } from '../../data/loanTypes';
import { formatCurrency } from '../../utils/loanCalculator';
import Card from '../ui/Card';
import Slider from '../ui/Slider';

interface LoanSelectionStepProps {
  data: LoanSelection;
  onChange: (data: LoanSelection) => void;
  errors: Partial<LoanSelection>;
}

export default function LoanSelectionStep({ data, onChange, errors }: LoanSelectionStepProps) {
  const handleChange = (field: keyof LoanSelection, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Loan Selection</h3>
        
        <div className="space-y-8">
          {/* Loan Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Loan Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loanTypes.map((loan) => (
                <label key={loan.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="loanType"
                    value={loan.id}
                    checked={data.loanType === loan.id}
                    onChange={(e) => handleChange('loanType', e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      data.loanType === loan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{loan.name}</div>
                    <div className="text-sm text-gray-600">{loan.interestRate}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.loanType && (
              <p className="mt-2 text-sm text-red-600">Please select a loan type</p>
            )}
          </div>

          {/* Loan Amount */}
          <div>
            <Slider
              label="Loan Amount *"
              value={data.loanAmount}
              onChange={(value) => handleChange('loanAmount', value)}
              min={50000}
              max={10000000}
              step={50000}
              formatValue={formatCurrency}
            />
            {errors.loanAmount && (
              <p className="mt-2 text-sm text-red-600">Please select a valid loan amount</p>
            )}
          </div>

          {/* Tenure */}
          <div>
            <Slider
              label="Loan Tenure *"
              value={data.tenure}
              onChange={(value) => handleChange('tenure', value)}
              min={12}
              max={360}
              step={12}
              formatValue={(value) => `${Math.round(value / 12)} years`}
            />
            {errors.tenure && (
              <p className="mt-2 text-sm text-red-600">Please select a valid tenure</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}