import React from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { PaymentData } from '../../../types/stepper';
import PaymentStep from './PaymentStep';
import { BarChart3, TrendingUp, Shield, AlertTriangle } from 'lucide-react';

export default function CIBILReportStep() {
    const { updateStepData, state } = useStepper();

    const handleDataChange = (data: PaymentData) => {
        updateStepData(8, data);
    };

    const currentStepData = state.steps.find(step => step.id === 8)?.data as PaymentData;

    return (
        <div className="space-y-6">
            {/* CIBIL Information */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    CIBIL Credit Report
                </h3>
                <div className="space-y-4 text-purple-700">
                    <p>
                        Your CIBIL report is essential for loan approval. It provides a comprehensive
                        view of your credit history and helps determine your loan eligibility and interest rates.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-md border border-purple-200">
                            <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                What's Included:
                            </h4>
                            <ul className="text-sm space-y-1">
                                <li>• Complete credit history (36 months)</li>
                                <li>• Current CIBIL score</li>
                                <li>• Active loans and credit cards</li>
                                <li>• Payment history analysis</li>
                                <li>• Credit utilization ratio</li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-md border border-purple-200">
                            <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                                <Shield className="w-4 h-4 mr-1" />
                                Benefits:
                            </h4>
                            <ul className="text-sm space-y-1">
                                <li>• Faster loan processing</li>
                                <li>• Better interest rates</li>
                                <li>• Higher loan amounts</li>
                                <li>• Transparent evaluation</li>
                                <li>• Credit improvement insights</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-yellow-800">Important Note:</p>
                                <p className="text-yellow-700">
                                    This fee covers the cost of obtaining your official CIBIL report directly from
                                    TransUnion CIBIL. The report will be used solely for loan evaluation purposes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Credit Score Ranges Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Understanding CIBIL Scores
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="text-lg font-bold text-red-600">300-549</div>
                        <div className="text-sm text-red-700">Poor</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-md">
                        <div className="text-lg font-bold text-orange-600">550-649</div>
                        <div className="text-sm text-orange-700">Fair</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="text-lg font-bold text-yellow-600">650-749</div>
                        <div className="text-sm text-yellow-700">Good</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="text-lg font-bold text-green-600">750-900</div>
                        <div className="text-sm text-green-700">Excellent</div>
                    </div>
                </div>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Higher scores typically result in better loan terms and faster approvals
                </p>
            </div>

            <PaymentStep
                stepId={8}
                title="CIBIL Report Fee"
                amount={800}
                description="Official fee for obtaining your comprehensive CIBIL credit report from TransUnion CIBIL. This report is mandatory for loan processing and will be used to evaluate your creditworthiness and determine loan terms."
                onDataChange={handleDataChange}
                initialData={currentStepData}
            />
        </div>
    );
}