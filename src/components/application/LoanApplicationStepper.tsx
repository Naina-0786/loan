import { useEffect } from 'react';
import { useStepper } from '../../contexts/StepperContext';
import CompletionModal from './CompletionModal';
import StepContent from './StepContent';
import StepNavigation from './StepNavigation';
import StepperHeader from './StepperHeader';

interface LoanApplicationStepperProps {
    className?: string;
}

export default function LoanApplicationStepper({ className = '' }: LoanApplicationStepperProps) {
    const { state } = useStepper();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [state.currentStep]);
    return (
        <>
            <div className={`max-w-4xl mx-auto p-6 ${className}`}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Progress Header */}
                    <StepperHeader />

                    {/* Step Content */}
                    <div className="p-6 md:p-8">
                        <StepContent />
                    </div>

                    {/* Navigation Controls */}
                    <StepNavigation />
                </div>
            </div>

            {/* Completion Modal */}
            <CompletionModal />
        </>
    );
}