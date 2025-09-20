import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import api from '../../../api/apiClient';

export default function LoginVerificationStep() {
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        isVerified: false,
        loanApplicationId: null as number | null
    });
    const [otpSent, setOtpSent] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Validate email format
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate OTP format
    const validateOTP = (otp: string): boolean => {
        return otp.length === 4 && /^\d+$/.test(otp);
    };

    // Fetch loan application on component mount
    useEffect(() => {
        const fetchLoanApplication = async () => {
            const applicationId = localStorage.getItem('loanApplicationId');
            if (applicationId) {
                setIsLoading(true);
                try {
                    const response = await api.get(`/loan-applications/${applicationId}`);
                    const application = response.data.data;
                    if (application.email) {
                        setFormData({
                            email: application.email,
                            otp: '',
                            isVerified: true,
                            loanApplicationId: parseInt(applicationId)
                        });
                        localStorage.setItem('userEmail', application.email);
                    }
                } catch (error) {
                    console.error('Failed to fetch loan application:', error);
                    toast.error('Failed to fetch loan application data');
                    // Clear loanApplicationId if fetch fails
                    localStorage.removeItem('loanApplicationId');
                    localStorage.removeItem('userEmail');
                    setFormData({
                        email: '',
                        otp: '',
                        isVerified: false,
                        loanApplicationId: null
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchLoanApplication();
    }, []);

    // Handle email input change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, email: value, otp: '', isVerified: false }));
        setOtpSent(false);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    };

    // Handle sending OTP
    const handleSendOTP = async () => {
        if (!validateEmail(formData.email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/otp/generate', { email: formData.email });
            setOtpSent(true);
            setErrors({});
            toast.success('OTP sent successfully!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to send OTP';
            toast.error(message);
            setErrors({ email: message });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP input change
    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        setFormData(prev => ({ ...prev, otp: value }));
        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: '' }));
        }
    };

    // Handle OTP verification
    const handleVerifyOTP = async () => {
        if (!validateOTP(formData.otp)) {
            setErrors({ otp: 'Please enter a valid 4-digit OTP' });
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/otp/verify', {
                email: formData.email,
                otp: formData.otp
            });
            const loanApplicationId = response.data.data.loanApplication.id;
            localStorage.setItem('loanApplicationId', loanApplicationId);
            localStorage.setItem('userEmail', formData.email);
            setFormData(prev => ({
                ...prev,
                isVerified: true,
                loanApplicationId
            }));
            setErrors({});
            toast.success('OTP verified successfully');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Invalid OTP';
            toast.error(message);
            setErrors({ otp: message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
                {isLoading && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

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
                            readOnly={formData.isVerified}
                            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            } ${formData.isVerified ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        />
                        {!formData.isVerified && (
                            <button
                                onClick={handleSendOTP}
                                disabled={isLoading || !formData.email || !validateEmail(formData.email)}
                                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                    isLoading || !formData.email || !validateEmail(formData.email)
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                } w-full sm:w-auto`}
                            >
                                Send OTP
                            </button>
                        )}
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
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleVerifyOTP}
                                disabled={isLoading || !formData.otp || !validateOTP(formData.otp)}
                                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                    isLoading || !formData.otp || !validateOTP(formData.otp)
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                } w-full sm:w-auto`}
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