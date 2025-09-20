import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { getLoanApplication, uploadPaymentScreenshot } from '../../../api/loanApplicationApi';

export default function CibilFeeStep() {
    const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        screenshotFile: null as File | null,
        paymentId: '',
        screenshotUrl: '' as string | null,
    });
    const [isReadOnly, setIsReadOnly] = useState(false);

    // Load existing data and check payment status on component mount
    useEffect(() => {
        const loadExistingData = async () => {
            const applicationId = localStorage.getItem('loanApplicationId');
            if (!applicationId) {
                console.log('No loanApplicationId found in localStorage');
                return;
            }

            setIsLoading(true);
            try {
                const application = await getLoanApplication(parseInt(applicationId));
                const newStatus = application.cibilStatus || 'PENDING';
                setPaymentStatus(newStatus);

                const hasCibilFee = application.cibilFee && application.cibilFee.public_id;
                setIsReadOnly(hasCibilFee && newStatus !== 'REJECTED');
                console.log('isReadOnly set to:', hasCibilFee && newStatus !== 'REJECTED');

                if (hasCibilFee) {
                    setFormData({
                        screenshotFile: null,
                        paymentId: application.cibilFee.paymentId || '',
                        screenshotUrl: application.cibilFee.url || '',
                    });
                    if (newStatus === 'APPROVED') {
                        const event = new CustomEvent('cibilFeeSubmitted', { detail: { isValid: true, stepId: 8 } });
                        window.dispatchEvent(event);
                        console.log('Dispatched cibilFeeSubmitted event:', { isValid: true, stepId: 8 });
                    } else if (newStatus === 'REJECTED') {
                        toast.error('Payment verification failed. Please upload a valid screenshot.');
                    }
                }
            } catch (error: any) {
                console.error('Failed to load payment status:', error);
                toast.error('Failed to load payment status');
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingData();
    }, []);

    // Poll payment status only when status is PENDING
    useEffect(() => {
        if (paymentStatus !== 'PENDING' || !paymentStatus) return;

        const checkPaymentStatus = async () => {
            try {
                const applicationId = localStorage.getItem('loanApplicationId');
                if (applicationId) {
                    const application = await getLoanApplication(parseInt(applicationId));
                    const newStatus = application.cibilStatus || 'PENDING';
                    setPaymentStatus(newStatus);

                    if (newStatus === 'APPROVED') {
                        const event = new CustomEvent('cibilFeeSubmitted', { detail: { isValid: true, stepId: 8 } });
                        window.dispatchEvent(event);
                        console.log('Dispatched cibilFeeSubmitted event:', { isValid: true, stepId: 8 });
                        toast.success('Payment verified! You can proceed to the next step.');
                        return true;
                    } else if (newStatus === 'REJECTED') {
                        setIsReadOnly(false);
                        toast.error('Payment verification failed. Please upload a valid screenshot.');
                        return true;
                    }
                }
            } catch (error) {
                console.error('Failed to check payment status:', error);
            }
            return false;
        };

        const interval = setInterval(async () => {
            const shouldStop = await checkPaymentStatus();
            if (shouldStop) {
                clearInterval(interval);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [paymentStatus]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isReadOnly) {
            console.log('File change blocked: Form is read-only');
            return;
        }
        const file = event.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, screenshotFile: file, screenshotUrl: file ? URL.createObjectURL(file) : null }));
    };

    const handleSubmit = async () => {
        if (isReadOnly || !formData.screenshotFile) {
            toast.error('Please upload a screenshot to proceed.');
            return;
        }

        setIsLoading(true);
        try {
            const applicationId = localStorage.getItem('loanApplicationId');
            if (!applicationId) throw new Error('Loan application ID not found');

            await uploadPaymentScreenshot(
                parseInt(applicationId),
                'cibilFee',
                formData.screenshotFile,
                {
                    paymentMethod: 'default',
                    paymentId: formData.paymentId || `PAY_${Date.now()}`,
                    amount: 500, // Placeholder amount for CIBIL fee
                }
            );

            setIsReadOnly(true);
            setPaymentStatus('PENDING');
            toast.success('Payment screenshot uploaded successfully! Waiting for admin verification.');
            console.log('Payment details submitted:', formData);

            const event = new CustomEvent('cibilFeeSubmitted', { detail: { isValid: false, stepId: 8 } });
            window.dispatchEvent(event);
            console.log('Dispatched cibilFeeSubmitted event:', { isValid: false, stepId: 8 });
        } catch (error: any) {
            console.error('Failed to upload payment screenshot:', error);
            toast.error(error.response?.data?.message || 'Failed to upload payment screenshot');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform hover:scale-101 transition-all duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    CIBIL Fee Payment
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed">
                    This fee covers the CIBIL report processing for your loan application. It includes credit score verification and report generation.
                </p>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 border border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Payment Details</h3>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-4">Amount to Pay: ₹500</p>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-4 sm:mb-6">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                        Upload Payment Screenshot *
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading || isReadOnly}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            isReadOnly ? 'bg-gray-100 cursor-not-allowed border-gray-300' : 'border-gray-300 hover:border-blue-500'
                        }`}
                    />
                    {!formData.screenshotFile && !isReadOnly && (
                        <p className="text-red-500 text-sm mt-1 sm:mt-2">Please upload a screenshot to proceed.</p>
                    )}
                </div>

                {formData.screenshotUrl && (
                    <div className="mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Uploaded Screenshot</h3>
                        <div className="relative w-full h-48 sm:h-64 bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                            <img
                                src={formData.screenshotUrl}
                                alt="Payment Screenshot"
                                className="w-full h-full object-contain p-2 sm:p-4"
                            />
                            <div className="absolute top-2 right-2 sm:top-2 sm:right-2 bg-white rounded-full p-1 sm:p-2 shadow-md">
                                <svg className="w-4 sm:w-6 h-4 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 sm:mt-6 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || isReadOnly || !formData.screenshotFile}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            isLoading || isReadOnly || !formData.screenshotFile
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500'
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Submitting...
                            </span>
                        ) : isReadOnly ? 'Image Uploaded' : 'Pay'}
                    </button>
                </div>

                {paymentStatus && (
                    <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl shadow-lg border">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Payment Status</h3>
                        {paymentStatus === 'PENDING' && (
                            <div className="flex items-center bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                                <div className="flex-shrink-0">
                                    <div className="h-8 sm:h-12 w-8 sm:w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <svg className="h-4 sm:h-6 w-4 sm:w-6 text-yellow-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-2 sm:ml-4">
                                    <h4 className="text-base sm:text-lg font-medium text-yellow-800">Pending</h4>
                                    <p className="text-sm sm:text-base text-gray-600">Your payment is under review. Please wait for verification.</p>
                                </div>
                            </div>
                        )}
                        {paymentStatus === 'APPROVED' && (
                            <div className="flex items-center bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                                <div className="flex-shrink-0">
                                    <div className="h-8 sm:h-12 w-8 sm:w-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg className="h-4 sm:h-6 w-4 sm:w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-2 sm:ml-4">
                                    <h4 className="text-base sm:text-lg font-medium text-green-800">Approved</h4>
                                    <p className="text-sm sm:text-base text-gray-600">Your payment has been successfully verified! Proceed to the next step.</p>
                                </div>
                            </div>
                        )}
                        {paymentStatus === 'REJECTED' && (
                            <div className="flex items-center bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                                <div className="flex-shrink-0">
                                    <div className="h-8 sm:h-12 w-8 sm:w-12 rounded-full bg-red-100 flex items-center justify-center">
                                        <svg className="h-4 sm:h-6 w-4 sm:w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-2 sm:ml-4">
                                    <h4 className="text-base sm:text-lg font-medium text-red-800">Rejected</h4>
                                    <p className="text-sm sm:text-base text-gray-600">Payment verification failed. Please upload a valid screenshot.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}