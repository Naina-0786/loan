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
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform hover:scale-101 transition-all duration-300">
                    <div className="mb-6">
                        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                        Congratulations!
                    </h2>
                    <p className="text-xl text-gray-700 mb-6">
                        You have successfully completed your loan application.
                    </p>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Our dedicated team is reviewing your details and will contact you soon to guide you through the next steps. We're excited to help you achieve your financial goals!
                    </p>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">What Happens Next?</h3>
                        <ul className="space-y-3 text-left text-gray-600">
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Application review in progress
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Expect a call from our team within 24-48 hours
                            </li>
                            <li className="flex items-center">
                                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Prepare any additional documents if requested
                            </li>
                        </ul>
                    </div>
                    <p className="text-sm text-gray-500 mt-6">
                        Thank you for choosing us. We're here to support you every step of the way!
                    </p>
                </div>
            </div>
        );
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