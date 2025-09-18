import React, { useEffect, useState } from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { CheckCircle, Clock, FileText, Download, AlertCircle } from 'lucide-react';

export default function ApprovalLetterStep() {
    const { updateStepData, state } = useStepper();
    const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'processing'>('processing');

    // Check if previous payment step is completed
    const processingFeeStep = state.steps.find(step => step.id === 4);
    const isProcessingFeeCompleted = processingFeeStep?.data?.status === 'completed';

    useEffect(() => {
        // Simulate approval process
        if (isProcessingFeeCompleted) {
            const timer = setTimeout(() => {
                setApprovalStatus('approved');
                updateStepData(5, {
                    status: 'approved',
                    approvalDate: new Date().toISOString(),
                    approvalNumber: `LOAN_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`
                });
            }, 3000); // 3 second delay to simulate processing

            return () => clearTimeout(timer);
        } else {
            setApprovalStatus('pending');
            updateStepData(5, { status: 'pending' });
        }
    }, [isProcessingFeeCompleted, updateStepData]);

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
        // In real implementation, this would download the actual approval letter
        const approvalData = state.steps.find(step => step.id === 5)?.data;
        alert(`Downloading approval letter...\nApproval Number: ${approvalData?.approvalNumber}`);
    };

    if (!isProcessingFeeCompleted) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        Payment Pending
                    </h3>
                    <p className="text-yellow-700 mb-4">
                        Please complete the processing fee payment in the previous step to proceed with the approval process.
                    </p>
                    <div className="bg-white p-4 rounded-md border border-yellow-200">
                        <p className="text-sm text-gray-600">
                            <strong>Next Steps:</strong>
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                            <li>• Go back to Step 4</li>
                            <li>• Complete the processing fee payment</li>
                            <li>• Upload payment screenshot</li>
                            <li>• Return here for approval letter</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    if (approvalStatus === 'processing') {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Processing Your Application
                    </h3>
                    <p className="text-blue-700 mb-4">
                        We are reviewing your documents and processing fee payment. This usually takes a few moments.
                    </p>
                    <div className="bg-white p-4 rounded-md border border-blue-200">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Estimated time: 2-3 minutes</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const approvalData = state.steps.find(step => step.id === 5)?.data;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
                {/* Success Header */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                        Congratulations! Your Loan is Pre-Approved
                    </h3>
                    <p className="text-green-700">
                        Your loan application has been successfully reviewed and pre-approved.
                        Please proceed with the next steps to complete the process.
                    </p>
                </div>

                {/* Approval Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Approval Details
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Approval Number</label>
                                <p className="text-lg font-mono text-gray-800">{approvalData?.approvalNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Approval Date</label>
                                <p className="text-gray-800">{formatDate(approvalData?.approvalDate)}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Status</label>
                                <div className="flex items-center space-x-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        Pre-Approved
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Valid Until</label>
                                <p className="text-gray-800">
                                    {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loan Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Pre-Approved Loan Summary
                    </h4>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded-md border">
                            <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
                            <p className="text-xl font-bold text-blue-600">
                                {state.steps.find(s => s.id === 2)?.data?.loanAmount ?
                                    `₹${state.steps.find(s => s.id === 2)?.data?.loanAmount?.toLocaleString('en-IN')}` :
                                    'N/A'}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-md border">
                            <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
                            <p className="text-xl font-bold text-green-600">
                                {state.steps.find(s => s.id === 2)?.data?.interestRate || 'N/A'}% p.a.
                            </p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-md border">
                            <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
                            <p className="text-xl font-bold text-purple-600">
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
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Download Approval Letter
                    </button>
                    <p className="text-sm text-gray-600 mt-2">
                        Keep this approval letter for your records
                    </p>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-800 mb-3">
                        Next Steps
                    </h4>
                    <ul className="text-blue-700 space-y-2">
                        <li className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                            <span>Complete the remaining documentation and fee payments</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                            <span>Submit all required documents and payments</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                            <span>Final verification and loan disbursal</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}