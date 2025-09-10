import React from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { PaymentData } from '../../../types/stepper';
import PaymentStep from './PaymentStep';
import { FileText, Calculator, Info, AlertCircle } from 'lucide-react';

export default function TDSPaperStep() {
    const { updateStepData, state } = useStepper();

    const handleDataChange = (data: PaymentData) => {
        updateStepData(9, data);
    };

    const currentStepData = state.steps.find(step => step.id === 9)?.data as PaymentData;

    return (
        <div className="space-y-6">
            {/* TDS Information */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    TDS (Tax Deducted at Source) Documentation
                </h3>
                <div className="space-y-4 text-green-700">
                    <p>
                        TDS documentation is required for loan processing as per Income Tax regulations.
                        This ensures compliance with tax laws and provides necessary documentation for your loan file.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-md border border-green-200">
                            <h4 className="font-medium text-green-800 mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                TDS Documents Include:
                            </h4>
                            <ul className="text-sm space-y-1">
                                <li>• TDS Certificate (Form 16/16A)</li>
                                <li>• Tax computation statement</li>
                                <li>• Income tax return acknowledgment</li>
                                <li>• TDS deduction summary</li>
                                <li>• Compliance verification letter</li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-md border border-green-200">
                            <h4 className="font-medium text-green-800 mb-2 flex items-center">
                                <Info className="w-4 h-4 mr-1" />
                                Why TDS is Required:
                            </h4>
                            <ul className="text-sm space-y-1">
                                <li>• Legal compliance requirement</li>
                                <li>• Income verification process</li>
                                <li>• Tax liability assessment</li>
                                <li>• Loan eligibility confirmation</li>
                                <li>• Regulatory documentation</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-yellow-800">Important:</p>
                                <p className="text-yellow-700">
                                    TDS documentation is mandatory for loans above ₹2 lakhs as per RBI guidelines.
                                    This fee covers the preparation and verification of all tax-related documents.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TDS Calculation Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Understanding TDS on Loans
                </h4>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="text-2xl font-bold text-blue-600 mb-1">0.1%</div>
                        <div className="text-sm text-blue-700">TDS Rate on</div>
                        <div className="text-sm text-blue-700">Interest Payment</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-md">
                        <div className="text-2xl font-bold text-purple-600 mb-1">₹40K+</div>
                        <div className="text-sm text-purple-700">Annual Interest</div>
                        <div className="text-sm text-purple-700">TDS Threshold</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="text-2xl font-bold text-green-600 mb-1">Form 15G</div>
                        <div className="text-sm text-green-700">Exemption</div>
                        <div className="text-sm text-green-700">Declaration</div>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                        <strong>Note:</strong> TDS is applicable on interest payments exceeding ₹40,000 per annum.
                        You can submit Form 15G/15H to claim exemption if your total income is below taxable limit.
                    </p>
                </div>
            </div>

            <PaymentStep
                stepId={9}
                title="TDS Documentation Fee"
                amount={1200}
                description="Fee for preparation and processing of TDS-related documents including tax certificates, computation statements, and compliance verification. This ensures your loan meets all Income Tax Department requirements."
                onDataChange={handleDataChange}
                initialData={currentStepData}
            />
        </div>
    );
}