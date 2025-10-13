import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStepper } from '../../contexts/StepperContext';

export default function StepNavigation() {
    const { state, previousStep, nextStep, validateStep, canNavigateToStep } = useStepper();

    const currentStep = state.steps.find(step => step.id === state.currentStep);

    const canGoBack = state.currentStep > 1;
    const currentStepData = state.steps.find(step => step.id === state.currentStep);
    const isCurrentStepValid = currentStepData?.isValid || false;
    const canGoNext = state.currentStep < state.steps.length && isCurrentStepValid && state.canProceed;
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

            <div className="text-sm text-gray-500 text-center">
                {/* {state.isComplete ? 'Application Complete' : `Step ${state.currentStep} of ${state.steps.length}`} */}
                {!isCurrentStepValid && !state.isComplete && (
                    <div className="text-red-500 text-xs mt-1">
                        {currentStep?.title ? `Complete ${currentStep?.title} to proceed` : ''}
                    </div>
                )}
                {!state.canProceed && !state.isComplete && (
                    <div className="text-yellow-600 text-xs mt-1">
                        Waiting for admin verification
                    </div>
                )}
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