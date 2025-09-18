import { useStepper } from '../../../contexts/StepperContext';
import { PaymentData } from '../../../types/stepper';
import PaymentStep from './PaymentStep';

export default function BankTransactionStep() {
    const { updateStepData, state } = useStepper();

    const handleDataChange = (data: PaymentData) => {
        updateStepData(6, data);
    };

    const currentStepData = state.steps.find(step => step.id === 6)?.data as PaymentData;

    return (
        <PaymentStep
            stepId={6}
            title="Bank Transaction Paper Fee"
            amount={1500}
            description="This fee covers the preparation and processing of official bank transaction documents required for your loan. These documents include bank statements verification, transaction history analysis, and official banking correspondence."
            onDataChange={handleDataChange}
            initialData={currentStepData}
        />
    );
}