import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { StepperState, StepperAction, StepperContextType, StepData } from '../types/stepper';
import { getStepValidation, getLoanApplication } from '../api/loanApplicationApi';

// Initial step configuration
const initialSteps: StepData[] = [
    { id: 1, title: 'Login & Verification', status: 'current', isValid: false, data: {} },
    { id: 2, title: 'EMI Calculator', status: 'pending', isValid: false, data: {} },
    { id: 3, title: 'Bank Details', status: 'pending', isValid: false, data: {} },
    { id: 4, title: 'KYC Document Submission', status: 'pending', isValid: false, data: {} },
    { id: 5, title: 'Processing Fee Payment', status: 'pending', isValid: false, data: {} },
    { id: 6, title: 'Approval Letter', status: 'pending', isValid: false, data: {} },
    { id: 7, title: 'Bank Transaction Paper', status: 'pending', isValid: false, data: {} },
    { id: 8, title: 'Insurance Policy', status: 'pending', isValid: false, data: {} },
    { id: 9, title: 'CIBIL Report', status: 'pending', isValid: false, data: {} },
    { id: 10, title: 'TDS Paper', status: 'pending', isValid: false, data: {} },
    { id: 11, title: 'NOC Paper', status: 'pending', isValid: false, data: {} },
];

const initialState: StepperState = {
    currentStep: 1,
    steps: initialSteps,
    isComplete: false,
    applicationData: null,
    canProceed: true,
};

// Stepper reducer
function stepperReducer(state: StepperState, action: StepperAction): StepperState {
    switch (action.type) {
        case 'SET_CURRENT_STEP':
            return {
                ...state,
                currentStep: action.payload,
                steps: state.steps.map(step => ({
                    ...step,
                    status: step.id === action.payload ? 'current' :
                        step.id < action.payload ? 'completed' : 'pending'
                }))
            };

        case 'UPDATE_STEP_DATA':
            return {
                ...state,
                steps: state.steps.map(step =>
                    step.id === action.payload.stepId
                        ? { ...step, data: { ...step.data, ...action.payload.data } }
                        : step
                )
            };

        case 'SET_STEP_VALID':
            return {
                ...state,
                steps: state.steps.map(step =>
                    step.id === action.payload.stepId
                        ? { ...step, isValid: action.payload.isValid }
                        : step
                )
            };

        case 'COMPLETE_STEPPER':
            return {
                ...state,
                isComplete: true,
                steps: state.steps.map(step => ({ ...step, status: 'completed' }))
            };

        case 'SET_APPLICATION_DATA':
            return {
                ...state,
                applicationData: action.payload
            };

        case 'SET_CAN_PROCEED':
            return {
                ...state,
                canProceed: action.payload
            };

        case 'LOAD_STEPPER_STATE':
            return {
                ...state,
                currentStep: action.payload.currentStep,
                canProceed: action.payload.canProceed,
                steps: state.steps.map(step => ({
                    ...step,
                    status: step.id === action.payload.currentStep ? 'current' :
                        action.payload.completedSteps.includes(step.id) ? 'completed' : 'pending',
                    isValid: action.payload.completedSteps.includes(step.id)
                }))
            };

        case 'RESET_STEPPER':
            return initialState;

        default:
            return state;
    }
}

// Create context
const StepperContext = createContext<StepperContextType | undefined>(undefined);

// Provider component
interface StepperProviderProps {
    children: ReactNode;
}

export function StepperProvider({ children }: StepperProviderProps) {
    const [state, dispatch] = useReducer(stepperReducer, initialState);

    const updateStepData = (stepId: number, data: Record<string, any>) => {
        dispatch({ type: 'UPDATE_STEP_DATA', payload: { stepId, data } });
    };

    const validateStep = (stepId: number): boolean => {
        const step = state.steps.find(s => s.id === stepId);
        return step?.isValid || false;
    };

    const navigateToStep = (stepId: number) => {
        dispatch({ type: 'SET_CURRENT_STEP', payload: stepId });
    };

    const nextStep = () => {
        if (state.currentStep < state.steps.length && state.canProceed) {
            const nextStepId = state.currentStep + 1;
            if (nextStepId > state.steps.length) {
                dispatch({ type: 'COMPLETE_STEPPER' });
            } else {
                dispatch({ type: 'SET_CURRENT_STEP', payload: nextStepId });
            }
        }
    };

    const previousStep = () => {
        if (state.currentStep > 1) {
            dispatch({ type: 'SET_CURRENT_STEP', payload: state.currentStep - 1 });
        }
    };

    const loadApplicationData = useCallback(async (applicationId: number) => {
        try {
            const applicationData = await getLoanApplication(applicationId);
            const validationResult = await getStepValidation(applicationId);

            dispatch({ type: 'SET_APPLICATION_DATA', payload: applicationData });
            dispatch({
                type: 'LOAD_STEPPER_STATE',
                payload: {
                    currentStep: validationResult.currentStep,
                    completedSteps: validationResult.completedSteps,
                    canProceed: validationResult.canProceed
                }
            });
        } catch (error) {
            console.error('Failed to load application data:', error);
            // If we can't load application data, at least try to get basic info
            try {
                const applicationData = await getLoanApplication(applicationId);
                dispatch({ type: 'SET_APPLICATION_DATA', payload: applicationData });
            } catch (innerError) {
                console.error('Failed to load basic application data:', innerError);
            }
        }
    }, [dispatch]);

    const canNavigateToStep = (stepId: number): boolean => {
        // Can always go to previous steps
        if (stepId < state.currentStep) {
            return true;
        }

        // Can only go to next step if current step is valid and can proceed
        if (stepId === state.currentStep + 1) {
            const currentStepData = state.steps.find(step => step.id === state.currentStep);
            return (currentStepData?.isValid || false) && state.canProceed;
        }

        // Cannot skip steps
        return false;
    };

    const contextValue: StepperContextType = {
        state,
        dispatch,
        updateStepData,
        validateStep,
        navigateToStep,
        nextStep,
        previousStep,
        loadApplicationData,
        canNavigateToStep,
    };

    return (
        <StepperContext.Provider value={contextValue}>
            {children}
        </StepperContext.Provider>
    );
}

// Custom hook to use stepper context
export function useStepper() {
    const context = useContext(StepperContext);
    if (context === undefined) {
        throw new Error('useStepper must be used within a StepperProvider');
    }
    return context;
}