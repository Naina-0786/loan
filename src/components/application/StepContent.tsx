import React from 'react';
import { useStepper } from '../../contexts/StepperContext';
import LoginVerificationStep from './steps/LoginVerificationStep';
import EMICalculatorStep from './steps/EMICalculatorStep';
import KYCDocumentStep from './steps/KYCDocumentStep';
import ProcessingFeeStep from './steps/ProcessingFeeStep';
import ApprovalLetterStep from './steps/ApprovalLetterStep';
import BankTransactionStep from './steps/BankTransactionStep';
import InsurancePolicyStep from './steps/InsurancePolicyStep';
import CIBILReportStep from './steps/CIBILReportStep';
import TDSPaperStep from './steps/TDSPaperStep';
import NOCPaperStep from './steps/NOCPaperStep';

export default function StepContent() {
    const { state } = useStepper();
    const currentStep = state.steps.find(step => step.id === state.currentStep);

    if (!currentStep) {
        return <div>Step not found</div>;
    }

    const renderStepContent = () => {
        switch (currentStep.id) {
            case 1:
                return <LoginVerificationStep />;
            case 2:
                return <EMICalculatorStep />;
            case 3:
                return <KYCDocumentStep />;
            case 4:
                return <ProcessingFeeStep />;
            case 5:
                return <ApprovalLetterStep />;
            case 6:
                return <BankTransactionStep />;
            case 7:
                return <InsurancePolicyStep />;
            case 8:
                return <CIBILReportStep />;
            case 9:
                return <TDSPaperStep />;
            case 10:
                return <NOCPaperStep />;
            default:
                return (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p className="text-gray-600">
                            Step {currentStep.id} content will be implemented here.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Current step status: {currentStep.status}
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-96">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {currentStep.title}
            </h2>
            {renderStepContent()}
        </div>
    );
}