import React from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { PaymentData } from '../../../types/stepper';
import PaymentStep from './PaymentStep';

export default function InsurancePolicyStep() {
    const { updateStepData, state } = useStepper();

    const handleDataChange = (data: PaymentData) => {
        updateStepData(7, data);
    };

    const currentStepData = state.steps.find(step => step.id === 7)?.data as PaymentData;

    return (
        <div className="space-y-6">
            {/* Insurance Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Loan Protection Insurance
                </h3>
                <div className="space-y-3 text-blue-700">
                    <p>
                        This insurance policy protects your loan in case of unforeseen circumstances.
                        It's designed to provide financial security for both you and your family.
                    </p>
                    <div className="bg-white p-4 rounded-md border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">Coverage Benefits:</h4>
                        <ul className="text-sm space-y-1">
                            <li>• Death benefit: Full loan amount coverage</li>
                            <li>• Disability benefit: EMI payment support</li>
                            <li>• Job loss protection: Temporary EMI relief</li>
                            <li>• Critical illness coverage: Partial loan waiver</li>
                        </ul>
                    </div>
                </div>
            </div>

            <PaymentStep
                stepId={7}
                title="Insurance Policy Premium"
                amount={3500}
                description="One-time premium payment for comprehensive loan protection insurance. This covers the entire loan tenure and provides multiple benefits including death, disability, and critical illness coverage."
                onDataChange={handleDataChange}
                initialData={currentStepData}
            />
        </div>
    );
}