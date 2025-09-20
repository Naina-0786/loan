import { AlertCircle, CheckCircle, Clock, Download, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStepper } from '../../../contexts/StepperContext';

export default function ApprovalLetterStep() {
    const { updateStepData, state } = useStepper();
    const [approvalStatus, setApprovalStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
    const [isLoading, setIsLoading] = useState(false);

    // Check processing fee status from Step 4 (ProcessingFeeStep)
    const processingFeeStep = state.steps.find(step => step.id === 4); // Adjust if step ID differs
    const processingFeeStatus = processingFeeStep?.data?.processingFeeStatus || 'PENDING';

    useEffect(() => {
        // Only proceed with approval process if processing fee is approved
        if (processingFeeStatus === 'APPROVED' && approvalStatus === 'PENDING') {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setApprovalStatus('APPROVED');
                const approvalData = {
                    status: 'APPROVED',
                    approvalDate: new Date().toISOString(),
                    approvalNumber: `LOAN_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`
                };
                updateStepData(5, approvalData);
                setIsLoading(false);
                const event = new CustomEvent('approvalLetterSubmitted', { detail: { isValid: true, stepId: 5 } });
                window.dispatchEvent(event);
                console.log('Dispatched approvalLetterSubmitted event:', { isValid: true, stepId: 5 });
            }, 3000); // 3-second delay to simulate processing

            return () => clearTimeout(timer);
        } else if (processingFeeStatus !== 'APPROVED') {
            setApprovalStatus('PENDING');
            updateStepData(5, { status: 'PENDING' });
        } else if (processingFeeStatus === 'APPROVED' && approvalStatus === 'APPROVED') {
            const event = new CustomEvent('approvalLetterSubmitted', { detail: { isValid: true, stepId: 5 } });
            window.dispatchEvent(event);
        }
    }, [processingFeeStatus, approvalStatus, updateStepData]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const downloadApprovalLetter = () => {
        const approvalData = state.steps.find(step => step.id === 5)?.data;
        alert(`Downloading approval letter...\nApproval Number: ${approvalData?.approvalNumber}`);
    };

    if (processingFeeStatus !== 'APPROVED') {
        return (
            <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
                    <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">
                        Payment Pending
                    </h3>
                    <p className="text-yellow-700 mb-4 text-sm sm:text-base">
                        Please complete the processing fee payment in the previous step to proceed with the approval process.
                    </p>
                    <div className="bg-white p-3 sm:p-4 rounded-md border border-yellow-200">
                        <p className="text-sm sm:text-base text-gray-600">
                            <strong>Next Steps:</strong>
                        </p>
                        <ul className="text-sm sm:text-base text-gray-600 mt-2 space-y-1">
                            <li className="flex items-center">
                                <span className="mr-2">•</span> Go back to Step 4
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">•</span> Complete the processing fee payment
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">•</span> Upload payment screenshot
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">•</span> Return here for approval letter
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    if (approvalStatus === 'PENDING') {
        return (
            <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
                    <div className="animate-spin w-10 sm:w-12 h-10 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">
                        Processing Your Application
                    </h3>
                    <p className="text-blue-700 mb-4 text-sm sm:text-base">
                        We are reviewing your documents and processing fee payment. This usually takes a few moments.
                    </p>
                    <div className="bg-white p-3 sm:p-4 rounded-md border border-blue-200">
                        <div className="flex items-center justify-center space-x-2 text-sm sm:text-base text-gray-600">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Estimated time: 2-3 minutes</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const approvalData = state.steps.find(step => step.id === 5)?.data;

    return (
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
                {/* Success Header */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
                    <CheckCircle className="w-14 sm:w-16 h-14 sm:h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
                        Congratulations! Your Loan is Pre-Approved
                    </h3>
                    <p className="text-green-700 text-sm sm:text-base">
                        Your loan application has been successfully reviewed and pre-approved.
                        Please proceed with the next steps to complete the process.
                    </p>
                </div>

                {/* Approval Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                        Approval Details
                    </h4>

                    <div className="grid gap-4 sm:gap-6">
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm sm:text-base font-medium text-gray-600">Approval Number</label>
                                <p className="text-lg sm:text-xl font-mono text-gray-800">{approvalData?.approvalNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm sm:text-base font-medium text-gray-600">Approval Date</label>
                                <p className="text-gray-800 text-sm sm:text-base">{formatDate(approvalData?.approvalDate)}</p>
                            </div>
                            <div>
                                <label className="text-sm sm:text-base font-medium text-gray-600">Status</label>
                                <div className="flex items-center space-x-2">
                                    <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm sm:text-base font-medium">
                                        Pre-Approved
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm sm:text-base font-medium text-gray-600">Valid Until</label>
                                <p className="text-gray-800 text-sm sm:text-base">
                                    {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loan Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                        Pre-Approved Loan Summary
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="text-center p-3 sm:p-4 bg-white rounded-md border">
                            <p className="text-sm sm:text-base text-gray-600 mb-1">Loan Amount</p>
                            <p className="text-lg sm:text-xl font-bold text-blue-600">
                                {state.steps.find(s => s.id === 2)?.data?.loanAmount ?
                                    `₹${state.steps.find(s => s.id === 2)?.data?.loanAmount?.toLocaleString('en-IN')}` :
                                    'N/A'}
                            </p>
                        </div>
                        <div className="text-center p-3 sm:p-4 bg-white rounded-md border">
                            <p className="text-sm sm:text-base text-gray-600 mb-1">Interest Rate</p>
                            <p className="text-lg sm:text-xl font-bold text-green-600">
                                {state.steps.find(s => s.id === 2)?.data?.interestRate || 'N/A'}% p.a.
                            </p>
                        </div>
                        <div className="text-center p-3 sm:p-4 bg-white rounded-md border">
                            <p className="text-sm sm:text-base text-gray-600 mb-1">Monthly EMI</p>
                            <p className="text-lg sm:text-xl font-bold text-purple-600">
                                {state.steps.find(s => s.id === 2)?.data?.calculatedEMI ?
                                    `₹${state.steps.find(s => s.id === 2)?.data?.calculatedEMI?.toLocaleString('en-IN')}` :
                                    'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Download Section */}
                <div className="text-center">
                    <button
                        onClick={downloadApprovalLetter}
                        className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        Download Approval Letter
                    </button>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">
                        Keep this approval letter for your records
                    </p>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 shadow-md">
                    <h4 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3">
                        Next Steps
                    </h4>
                    <ul className="text-blue-700 space-y-2 text-sm sm:text-base">
                        <li className="flex items-start">
                            <span className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">1</span>
                            <span>Complete the remaining documentation and fee payments</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">2</span>
                            <span>Submit all required documents and payments</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">3</span>
                            <span>Final verification and loan disbursal</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}