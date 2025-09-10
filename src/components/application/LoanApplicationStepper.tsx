import React from 'react';
import { StepperProvider } from '../../contexts/StepperContext';
import StepperHeader from './StepperHeader';
import StepContent from './StepContent';
import StepNavigation from './StepNavigation';
import CompletionModal from './CompletionModal';

interface LoanApplicationStepperProps {
    className?: string;
}

export default function LoanApplicationStepper({ className = '' }: LoanApplicationStepperProps) {
    return (
        <StepperProvider>
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
        </StepperProvider>
    );
}