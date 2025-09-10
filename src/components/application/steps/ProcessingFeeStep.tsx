import React, { useEffect } from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { PaymentData } from '../../../types/stepper';
import PaymentStep from './PaymentStep';

export default function ProcessingFeeStep() {
    const { updateStepData, state } = useStepper();

    const handleDataChange = (data: PaymentData) => {
        updateStepData(4, data);
    };

    const currentStepData = state.steps.find(step => step.id === 4)?.data as PaymentData;

    return (
        <PaymentStep
            stepId={4}
            title="Processing Fee Payment"
            amount={2500}
            description="This fee covers the initial processing and verification of your loan application. It includes document verification, credit checks, and administrative costs."
            onDataChange={handleDataChange}
            initialData={currentStepData}
        />
    );
}