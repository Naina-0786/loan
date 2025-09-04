import React from 'react';
import { motion } from 'framer-motion';
import { LoanSelection, EMICalculation } from '../../types/loan';
import { calculateEMI } from '../../utils/loanCalculator';
import LoanCalculatorWidget from '../calculator/LoanCalculatorWidget';

interface CalculatorStepProps {
  loanSelection: LoanSelection;
  onCalculationChange: (calculation: EMICalculation) => void;
}

export default function CalculatorStep({ loanSelection, onCalculationChange }: CalculatorStepProps) {
  React.useEffect(() => {
    if (loanSelection.loanAmount && loanSelection.tenure) {
      const calculation = calculateEMI({
        principal: loanSelection.loanAmount,
        interestRate: 12, // Default rate, can be made dynamic
        tenure: loanSelection.tenure
      });
      onCalculationChange(calculation);
    }
  }, [loanSelection, onCalculationChange]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">EMI Calculator</h3>
        <p className="text-gray-600">
          Review your loan details and see the calculated EMI breakdown
        </p>
      </div>
      
      <LoanCalculatorWidget showFullFeatures />
    </motion.div>
  );
}