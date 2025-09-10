import React, { useState, useEffect } from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { LoginData } from '../../../types/stepper';

export default function LoginVerificationStep() {
    const { updateStepData, state } = useStepper();
    const [formData, setFormData] = useState<LoginData>({
        mobileNumber: '',
        otp: '',
        isVerified: false
    });
    const [otpSent, setOtpSent] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateMobileNumber = (number: string): boolean => {
        const mobileRegex = /^[6-9]\d{9}$/;
        return mobileRegex.test(number);
    };

    const validateOTP = (otp: string): boolean => {
        return otp.length === 6 && /^\d+$/.test(otp);
    };

    const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, mobileNumber: value }));

        if (errors.mobileNumber) {
            setErrors(prev => ({ ...prev, mobileNumber: '' }));
        }
    };

    const handleSendOTP = () => {
        if (!validateMobileNumber(formData.mobileNumber)) {
            setErrors({ mobileNumber: 'Please enter a valid 10-digit mobile number' });
            return;
        }

        setOtpSent(true);
        setErrors({});
        // In real implementation, this would call an API to send OTP
        console.log('OTP sent to:', formData.mobileNumber);
    };

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setFormData(prev => ({ ...prev, otp: value }));

        if (errors.otp) {
            setErrors(prev => ({ ...prev, otp: '' }));
        }
    };

    const handleVerifyOTP = () => {
        if (!validateOTP(formData.otp)) {
            setErrors({ otp: 'Please enter a valid 6-digit OTP' });
            return;
        }

        // In real implementation, this would verify OTP with backend
        const updatedData = { ...formData, isVerified: true };
        setFormData(updatedData);
        setErrors({});
        console.log('OTP verified successfully');
    };

    // Update stepper data whenever form data changes
    useEffect(() => {
        updateStepData(1, formData);
    }, [formData, updateStepData]);

    return (
        <div className="max-w-md mx-auto">
            <div className="space-y-6">
                {/* Mobile Number Input */}
                <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number *
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="tel"
                            id="mobile"
                            value={formData.mobileNumber}
                            onChange={handleMobileNumberChange}
                            placeholder="Enter 10-digit mobile number"
                            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                                }`}
                            disabled={otpSent}
                        />
                        <button
                            onClick={handleSendOTP}
                            disabled={!formData.mobileNumber || otpSent}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {otpSent ? 'Sent' : 'Send OTP'}
                        </button>
                    </div>
                    {errors.mobileNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
                    )}
                </div>

                {/* OTP Input */}
                {otpSent && (
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP *
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="otp"
                                value={formData.otp}
                                onChange={handleOTPChange}
                                placeholder="Enter 6-digit OTP"
                                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.otp ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                disabled={formData.isVerified}
                            />
                            <button
                                onClick={handleVerifyOTP}
                                disabled={!formData.otp || formData.isVerified}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {formData.isVerified ? 'Verified' : 'Verify'}
                            </button>
                        </div>
                        {errors.otp && (
                            <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                        )}
                        {formData.isVerified && (
                            <p className="text-green-600 text-sm mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Mobile number verified successfully!
                            </p>
                        )}
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Instructions:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Enter your 10-digit mobile number</li>
                        <li>• Click "Send OTP" to receive verification code</li>
                        <li>• Enter the 6-digit OTP and click "Verify"</li>
                        <li>• Once verified, you can proceed to the next step</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}