import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getLoanApplication, uploadPaymentScreenshot } from '../../../api/loanApplicationApi';
import { useStepper } from '../../../contexts/StepperContext';
import { PaymentData } from '../../../types/stepper';
import PaymentStep from './PaymentStep';

export default function ProcessingFeeStep() {
    const { updateStepData, state, dispatch } = useStepper();
    const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<PaymentData>({
        paymentMethod: '',
        paymentId: '',
        amount: 2500,
        status: 'pending',
        screenshotFile: null
    });

    // Load existing data and check payment status on component mount
    useEffect(() => {
        const loadExistingData = async () => {
            try {
                const applicationId = localStorage.getItem('loanApplicationId');
                if (applicationId) {
                    const application = await getLoanApplication(parseInt(applicationId));
                    const newStatus = application.processingFeeStatus || 'PENDING';
                    setPaymentStatus(newStatus);

                    if (application.processingFeeData) {
                        setFormData(prev => ({
                            ...prev,
                            paymentMethod: application.processingFeeData.paymentMethod || '',
                            paymentId: application.processingFeeData.paymentId || '',
                            amount: application.processingFeeData.amount || 2500,
                            status: application.processingFeeData.status || 'pending',
                            screenshotFile: null // File is not persisted in state
                        }));
                        updateStepData(5, application.processingFeeData);
                    }

                    if (newStatus === 'APPROVED') {
                        dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 5, isValid: true } });
                        dispatch({ type: 'SET_CAN_PROCEED', payload: true });
                        toast.success("Payment verified! You can proceed to the next step.");
                    } else if (newStatus === 'REJECTED') {
                        toast.error("Payment verification failed. Please upload a valid screenshot.");
                    }
                }
            } catch (error) {
                console.error('Failed to load payment status:', error);
                toast.error('Failed to load payment status');
            }
        };

        loadExistingData();
    }, [dispatch, updateStepData]);

    // Poll payment status only when status is PENDING
    useEffect(() => {
        if (paymentStatus !== 'PENDING') return;

        const checkPaymentStatus = async () => {
            try {
                const applicationId = localStorage.getItem('loanApplicationId');
                if (applicationId) {
                    const application = await getLoanApplication(parseInt(applicationId));
                    const newStatus = application.processingFeeStatus || 'PENDING';
                    setPaymentStatus(newStatus);

                    if (newStatus === 'APPROVED') {
                        dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 5, isValid: true } });
                        dispatch({ type: 'SET_CAN_PROCEED', payload: true });
                        toast.success("Payment verified! You can proceed to the next step.");
                        return true; // Stop polling
                    } else if (newStatus === 'REJECTED') {
                        toast.error("Payment verification failed. Please upload a valid screenshot.");
                        return true; // Stop polling
                    }
                }
            } catch (error) {
                console.error('Failed to check payment status:', error);
            }
            return false; // Continue polling
        };

        const interval = setInterval(async () => {
            const shouldStop = await checkPaymentStatus();
            if (shouldStop) {
                clearInterval(interval);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [paymentStatus, dispatch]);

    const handleDataChange = (data: PaymentData) => {
        setFormData(data);
        updateStepData(5, data);
    };

    const handleSubmit = async () => {
        if (!formData.screenshotFile || !formData.paymentMethod || !formData.paymentId) {
            toast.error('Please fill all required fields and upload a screenshot.');
            return;
        }

        setIsLoading(true);
        try {
            const applicationId = localStorage.getItem('loanApplicationId');
            if (applicationId) {
                await uploadPaymentScreenshot(
                    parseInt(applicationId),
                    'processingFee',
                    formData.screenshotFile,
                    {
                        paymentMethod: formData.paymentMethod,
                        paymentId: formData.paymentId,
                        amount: formData.amount
                    }
                );

                setFormData(prev => ({ ...prev, status: 'completed' }));
                updateStepData(5, { ...formData, status: 'completed' });
                setPaymentStatus('PENDING');
                toast.success("Payment screenshot uploaded successfully! Waiting for admin verification.");
            }
        } catch (error: any) {
            console.error('Failed to upload payment screenshot:', error);
            toast.error(error.response?.data?.message || 'Failed to upload payment screenshot');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <PaymentStep
                stepId={5}
                title="Processing Fee Payment"
                amount={2500}
                description="This fee covers the initial processing and verification of your loan application. It includes document verification, credit checks, and administrative costs."
                onDataChange={handleDataChange}
                initialData={formData}
            />

            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.screenshotFile || !formData.paymentMethod || !formData.paymentId}
                    className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors ${
                        isLoading || !formData.screenshotFile || !formData.paymentMethod || !formData.paymentId
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isLoading ? 'Submitting...' : 'Submit Payment Details'}
                </button>
            </div>

            {paymentStatus === 'PENDING' && formData.status === 'completed' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                        <span className="text-yellow-800">
                            Payment screenshot uploaded. Waiting for admin verification...
                        </span>
                    </div>
                </div>
            )}

            {paymentStatus === 'REJECTED' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-red-800">
                        Payment verification failed. Please upload a valid screenshot.
                    </span>
                </div>
            )}

            {paymentStatus === 'APPROVED' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-800">
                        Payment verified! You can proceed to the next step.
                    </span>
                </div>
            )}
        </div>
    );
}