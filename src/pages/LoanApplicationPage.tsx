import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ApplicationData, PersonalInfo, LoanSelection, EMICalculation } from '../types/loan';
import { calculateEMI } from '../utils/loanCalculator';
import ApplicationStepper from '../components/application/ApplicationStepper';
import PersonalInfoStep from '../components/application/PersonalInfoStep';
import LoanSelectionStep from '../components/application/LoanSelectionStep';
import CalculatorStep from '../components/application/CalculatorStep';
import ReviewStep from '../components/application/ReviewStep';
import Button from '../components/ui/Button';

const steps = ['Personal Info', 'Loan Selection', 'Calculator', 'Review & Submit'];

export default function LoanApplicationPage() {
  const location = useLocation();
  const initialLoanType = location.state?.loanType || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    age: 0,
    address: '',
    employmentStatus: '',
    annualIncome: 0
  });
  
  const [loanSelection, setLoanSelection] = useState<LoanSelection>({
    loanType: initialLoanType,
    loanAmount: 500000,
    tenure: 60
  });

  const [calculation, setCalculation] = useState<EMICalculation>({
    monthlyEMI: 0,
    totalInterest: 0,
    totalRepayment: 0
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePersonalInfo = (): boolean => {
    const newErrors: Partial<PersonalInfo> = {};
    
    if (!personalInfo.fullName.trim()) newErrors.fullName = 'Required';
    if (!personalInfo.age || personalInfo.age < 18 || personalInfo.age > 65) newErrors.age = 'Invalid age';
    if (!personalInfo.address.trim()) newErrors.address = 'Required';
    if (!personalInfo.employmentStatus) newErrors.employmentStatus = 'Required';
    if (!personalInfo.annualIncome || personalInfo.annualIncome < 100000) newErrors.annualIncome = 'Invalid income';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoanSelection = (): boolean => {
    const newErrors: Partial<LoanSelection> = {};
    
    if (!loanSelection.loanType) newErrors.loanType = 'Required';
    if (!loanSelection.loanAmount || loanSelection.loanAmount < 50000) newErrors.loanAmount = 'Invalid amount';
    if (!loanSelection.tenure || loanSelection.tenure < 12) newErrors.tenure = 'Invalid tenure';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = true;
    
    if (currentStep === 1) {
      isValid = validatePersonalInfo();
    } else if (currentStep === 2) {
      isValid = validateLoanSelection();
    }
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Application submitted successfully! We will contact you within 24 hours.');
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={personalInfo}
            onChange={setPersonalInfo}
            errors={errors}
          />
        );
      case 2:
        return (
          <LoanSelectionStep
            data={loanSelection}
            onChange={setLoanSelection}
            errors={errors}
          />
        );
      case 3:
        return (
          <CalculatorStep
            loanSelection={loanSelection}
            onCalculationChange={setCalculation}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={{ personalInfo, loanSelection, calculation }}
            onEdit={setCurrentStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loan Application
            </h1>
            <p className="text-lg text-gray-600">
              Complete your loan application in {steps.length} simple steps
            </p>
          </div>

          <ApplicationStepper currentStep={currentStep} steps={steps} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}