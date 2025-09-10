import React from 'react';
import { useStepper } from '../../contexts/StepperContext';
import { CheckCircle, Download, Calendar, Phone, Mail, Trophy } from 'lucide-react';

export default function CompletionModal() {
    const { state } = useStepper();

    if (!state.isComplete) {
        return null;
    }

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const loanData = state.steps.find(s => s.id === 2)?.data;
    const totalFees = 2500 + 1500 + 3500 + 800 + 1200 + 1000; // Sum of all fees

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-lg">
                    <div className="text-center">
                        <Trophy className="w-16 h-16 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
                        <p className="text-green-100">
                            Your loan application has been successfully submitted!
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Success Message */}
                    <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Application Completed Successfully
                        </h3>
                        <p className="text-gray-600">
                            All required steps have been completed and your loan application is now under final review.
                        </p>
                    </div>

                    {/* Application Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Application Summary</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Loan Amount:</span>
                                    <span className="font-medium">
                                        {loanData?.loanAmount ? formatCurrency(loanData.loanAmount) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Interest Rate:</span>
                                    <span className="font-medium">{loanData?.interestRate || 'N/A'}% p.a.</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Monthly EMI:</span>
                                    <span className="font-medium">
                                        {loanData?.calculatedEMI ? formatCurrency(loanData.calculatedEMI) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tenure:</span>
                                    <span className="font-medium">
                                        {loanData?.tenure || 'N/A'} {loanData?.tenureType || ''}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Fees Paid:</span>
                                    <span className="font-medium text-green-600">{formatCurrency(totalFees)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Application ID:</span>
                                    <span className="font-medium font-mono">
                                        LOAN_{Date.now().toString().slice(-8)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-3">What Happens Next?</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                                <div className="text-sm">
                                    <p className="font-medium text-blue-800">Final Review (2-4 hours)</p>
                                    <p className="text-blue-700">Our team will conduct a final review of your application and documents.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                                <div className="text-sm">
                                    <p className="font-medium text-blue-800">Approval Confirmation (4-8 hours)</p>
                                    <p className="text-blue-700">You'll receive final approval confirmation via SMS and email.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                                <div className="text-sm">
                                    <p className="font-medium text-blue-800">Loan Disbursal (24-48 hours)</p>
                                    <p className="text-blue-700">Funds will be transferred directly to your registered bank account.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-3">Need Help?</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-yellow-600" />
                                <span className="text-yellow-700">Customer Care: 1800-123-4567</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-yellow-600" />
                                <span className="text-yellow-700">Email: support@loanflow.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-yellow-600" />
                                <span className="text-yellow-700">Available: 24/7</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Summary
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Start New Application
                        </button>
                    </div>

                    {/* Important Note */}
                    <div className="text-center text-xs text-gray-500 border-t pt-4">
                        <p>
                            Please save your Application ID for future reference.
                            You will receive SMS and email confirmations shortly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}