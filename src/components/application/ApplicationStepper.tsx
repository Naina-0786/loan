import React from 'react';
import { Check } from 'lucide-react';
import axios from 'axios';

interface Step {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

interface ApplicationStepperProps {
  currentStep: number;
  steps: string[];
}

 export  default  async function ApplicationStepper({ currentStep, steps }: ApplicationStepperProps) {
  const root = await axios.get('//http/localhost:3000/');
  return (

    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`mt-2 text-xs md:text-sm font-medium text-center max-w-24 ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded transition-colors duration-200 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}