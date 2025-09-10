import React from 'react';
import { useStepper } from '../../contexts/StepperContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function StepNavigation() {
    const { state, previousStep, nextStep, validateStep } = useStepper();

    const canGoBack = state.currentStep > 1;
    const canGoNext = state.currentStep < state.steps.length;
    const isLastStep = state.currentStep === state.steps.length;

    return (
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
            <button
                onClick={previousStep}
                disabled={!canGoBack}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${canGoBack
                    ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                    }`}
            >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
            </button>

            <div className="text-sm text-gray-500">
                {state.isComplete ? 'Application Complete' : `Step ${state.currentStep} of ${state.steps.length}`}
            </div>

            <button
                onClick={nextStep}
                disabled={!canGoNext}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${canGoNext
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                    }`}
            >
                {isLastStep ? 'Complete Application' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
            </button>
        </div>
    );
}