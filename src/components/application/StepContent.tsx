import { useStepper } from '../../contexts/StepperContext';
import ApprovalLetterStep from './steps/ApprovalLetterStep';
import BankTransactionStep from './steps/BankTransactionStep';
import CIBILReportStep from './steps/CIBILReportStep';
import EMICalculatorStep from './steps/EMICalculatorStep';
import InsurancePolicyStep from './steps/InsurancePolicyStep';
import KYCDocumentStep from './steps/KYCDocumentStep';
import LoginVerificationStep from './steps/LoginVerificationStep';
import NOCPaperStep from './steps/NOCPaperStep';
import ProcessingFeeStep from './steps/ProcessingFeeStep';
import TDSPaperStep from './steps/TDSPaperStep';
import BankDetailsPage from './steps/bankdetails';
import { useEffect } from 'react';

export default function StepContent() {
    const { state, loadApplicationData } = useStepper();
    const currentStep = state.steps.find(step => step.id === state.currentStep);

    // Load application data on component mount
    useEffect(() => {
        const applicationId = localStorage.getItem('loanApplicationId');
        if (applicationId && !state.applicationData) {
            loadApplicationData(parseInt(applicationId));
        }
    }, [loadApplicationData, state.applicationData]);

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
                return <BankDetailsPage />;
            case 4:
                return <KYCDocumentStep />;
            case 5:
                return <ProcessingFeeStep />;
            case 6:
                return <ApprovalLetterStep />;
            case 7:
                return <BankTransactionStep />;
            case 8:
                return <InsurancePolicyStep />;
            case 9:
                return <CIBILReportStep />;
            case 10:
                return <TDSPaperStep />;
            case 11:
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