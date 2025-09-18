// Updated file: LoginVerificationStep.tsx
import React, { useState, useEffect } from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { LoginData } from '../../../types/stepper';
import { toast } from 'sonner';
import api from '../../../api/apiClient';
import { AxiosError } from 'axios';

export default function LoginVerificationStep() {
    const { updateStepData, state, dispatch } = useStepper();
    const [formData, setFormData] = useState<LoginData>({
        email: '',
        otp: '',
        isVerified: false
    });
    const [otpSent, setOtpSent] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load existing data on component mount
    useEffect(() => {
        const applicationId = localStorage.getItem('loanApplicationId');
        const storedEmail = localStorage.getItem('userEmail');

        if (applicationId && storedEmail && !formData.isVerified) {
            setFormData(prev => ({
                ...prev,
                email: storedEmail,
                isVerified: true
            }));
            setOtpSent(true);
            dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 1, isValid: true } });
        } else if (state.applicationData?.email && !formData.isVerified) {
            setFormData(prev => ({
                ...prev,
                email: state.applicationData.email,
                isVerified: true
            }));
            setOtpSent(true);
            dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 1, isValid: true } });
        } else {
            // Reset form if no valid application data or navigating back
            setFormData({ email: '', otp: '', isVerified: false });
            setOtpSent(false);
            dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 1, isValid: false } });
        }
    }, [state.applicationData, dispatch]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateOTP = (otp: string): boolean => {
        return otp.length === 4 && /^\d+$/.test(otp);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, email: value, isVerified: false, otp: '' }));
        setOtpSent(false); // Reset OTP sent state when email changes
        dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 1, isValid: false } });
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const handleSendOTP = async () => {
        if (!validateEmail(formData.email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        try {
            await api.post("/otp/generate", { email: formData.email });
            setOtpSent(true);
            setErrors({});
            toast.success("OTP sent successfully!");
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Failed to send OTP");
            } else {
                toast.error("Failed to send OTP");
            }
        }
    };

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setFormData(prev => ({ ...prev, otp: value }));
        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: '' }));
        }
    };

    const handleVerifyOTP = async () => {
        if (!validateOTP(formData.otp)) {
            setErrors({ otp: 'Please enter a valid 4-digit OTP' });
            return;
        }

        try {
            const verify = await api.post("/otp/verify", { email: formData.email, otp: formData.otp });
            localStorage.setItem("loanApplicationId", verify.data.data.loanApplication.id);
            localStorage.setItem("userEmail", formData.email);
            const updatedData = { ...formData, isVerified: true };
            setFormData(updatedData);
            updateStepData(1, updatedData);
            dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 1, isValid: true } });
            toast.success("OTP verified successfully");
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "Invalid OTP");
            } else {
                toast.error("Invalid OTP");
            }
        }
    };

    // Update stepper data whenever form data changes
    useEffect(() => {
        updateStepData(1, formData);
    }, [formData, updateStepData]);

    return (
        <div className="w-full max-w-md mx-auto sm:p-4">
            <div className="space-y-6">
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email address"
                            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <button
                            onClick={handleSendOTP}
                            disabled={!formData.email || !validateEmail(formData.email)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed sm:w-auto w-full"
                        >
                            {otpSent && formData.isVerified ? 'Verified' : 'Send OTP'}
                        </button>
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                    {formData.isVerified && (
                        <p className="text-green-600 text-sm mt-1">✓ Email verified successfully</p>
                    )}
                </div>

                {/* OTP Input */}
                {otpSent && !formData.isVerified && (
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                id="otp"
                                value={formData.otp}
                                onChange={handleOTPChange}
                                placeholder="Enter 4-digit OTP"
                                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.otp ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            <button
                                onClick={handleVerifyOTP}
                                disabled={!formData.otp || !validateOTP(formData.otp)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed sm:w-auto w-full"
                            >
                                Verify
                            </button>
                        </div>
                        {errors.otp && (
                            <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                        )}
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Instructions:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Enter your valid email address</li>
                        <li>• Click "Send OTP" to receive verification code</li>
                        <li>• Enter the 4-digit OTP and click "Verify"</li>
                        <li>• Once verified, you can proceed to the next step</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}