import React from 'react';
import { useStepper } from '../../contexts/StepperContext';

export default function StepperHeader() {
    const { state } = useStepper();

    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-white">
                    Loan Application
                </h1>
                <div className="text-sm text-blue-100">
                    Step {state.currentStep} of {state.steps.length}
                </div>
            </div>

            {/* Progress Bar - Will be enhanced in task 2 */}
            <div className="mt-4">
                <div className="w-full bg-blue-500 rounded-full h-2">
                    <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(state.currentStep / state.steps.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}