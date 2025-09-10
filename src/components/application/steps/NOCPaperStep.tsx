import React from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { PaymentData } from '../../../types/stepper';
import PaymentStep from './PaymentStep';
import { Shield, FileCheck, Award, CheckCircle, Star, Trophy } from 'lucide-react';

export default function NOCPaperStep() {
    const { updateStepData, state } = useStepper();

    const handleDataChange = (data: PaymentData) => {
        updateStepData(10, data);
    };

    const currentStepData = state.steps.find(step => step.id === 10)?.data as PaymentData;

    // Calculate total fees paid so far
    const totalFees = [4, 6, 7, 8, 9].reduce((total, stepId) => {
        const stepData = state.steps.find(step => step.id === stepId)?.data as PaymentData;
        return total + (stepData?.amount || 0);
    }, 0);

    return (
        <div className="space-y-6">
            {/* Final Step Celebration */}
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                <div className="text-center mb-4">
                    <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-purple-800 mb-2">
                        🎉 Final Step - NOC Documentation
                    </h3>
                    <p className="text-purple-700">
                        You're almost done! This is the last step in your loan application process.
                    </p>
                </div>
            </div>

            {/* NOC Information */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    NOC (No Objection Certificate) Documentation
                </h3>
                <div className="space-y-4 text-blue-700">
                    <p>
                        The NOC (No Objection Certificate) is the final clearance document that confirms
                        all loan requirements have been met and there are no pending objections to loan disbursal.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-md border border-blue-200">
                            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                <FileCheck className="w-4 h-4 mr-1" />
                                NOC Includes:
                            </h4>
                            <ul className="text-sm space-y-1">
                                <li>• Final clearance certificate</li>
                                <li>• Legal verification completion</li>
                                <li>• Document authenticity confirmation</li>
                                <li>• Compliance verification letter</li>
                                <li>• Loan disbursal authorization</li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-md border border-blue-200">
                            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                Final Clearances:
                            </h4>
                            <ul className="text-sm space-y-1">
                                <li>• All documents verified ✓</li>
                                <li>• Payments completed ✓</li>
                                <li>• Legal checks passed ✓</li>
                                <li>• Credit approval confirmed ✓</li>
                                <li>• Ready for disbursal ✓</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Your Loan Application Summary
                </h4>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h5 className="font-medium text-gray-700">Loan Details</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Loan Amount:</span>
                                <span className="font-medium">
                                    {state.steps.find(s => s.id === 2)?.data?.loanAmount ?
                                        `₹${state.steps.find(s => s.id === 2)?.data?.loanAmount?.toLocaleString('en-IN')}` :
                                        'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Interest Rate:</span>
                                <span className="font-medium">
                                    {state.steps.find(s => s.id === 2)?.data?.interestRate || 'N/A'}% p.a.
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Monthly EMI:</span>
                                <span className="font-medium">
                                    {state.steps.find(s => s.id === 2)?.data?.calculatedEMI ?
                                        `₹${state.steps.find(s => s.id === 2)?.data?.calculatedEMI?.toLocaleString('en-IN')}` :
                                        'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tenure:</span>
                                <span className="font-medium">
                                    {state.steps.find(s => s.id === 2)?.data?.tenure || 'N/A'} {state.steps.find(s => s.id === 2)?.data?.tenureType || ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h5 className="font-medium text-gray-700">Payment Summary</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Processing Fee:</span>
                                <span className="font-medium">₹2,500</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Bank Transaction:</span>
                                <span className="font-medium">₹1,500</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Insurance Premium:</span>
                                <span className="font-medium">₹3,500</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">CIBIL Report:</span>
                                <span className="font-medium">₹800</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">TDS Documentation:</span>
                                <span className="font-medium">₹1,200</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 font-semibold">
                                <span className="text-gray-800">Total Paid:</span>
                                <span className="text-green-600">₹{(totalFees + 1200).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Completion Timeline */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    What Happens After NOC Payment?
                </h4>

                <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                        <div>
                            <p className="font-medium text-green-800">Immediate Processing (0-2 hours)</p>
                            <p className="text-sm text-green-700">NOC generation and final document verification</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                        <div>
                            <p className="font-medium text-green-800">Loan Sanction Letter (2-4 hours)</p>
                            <p className="text-sm text-green-700">Official loan approval and sanction letter generation</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                        <div>
                            <p className="font-medium text-green-800">Loan Disbursal (24-48 hours)</p>
                            <p className="text-sm text-green-700">Funds transfer to your registered bank account</p>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentStep
                stepId={10}
                title="NOC Documentation Fee"
                amount={1000}
                description="Final fee for NOC (No Objection Certificate) preparation and processing. This completes all documentation requirements and authorizes loan disbursal. Once paid, your loan will be processed for final approval and disbursal within 24-48 hours."
                onDataChange={handleDataChange}
                initialData={currentStepData}
            />
        </div>
    );
}