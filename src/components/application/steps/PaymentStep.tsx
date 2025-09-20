import { Check, CreditCard, IndianRupee, Smartphone, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { PaymentData } from '../../../types/stepper';

interface PaymentStepProps {
    stepId: number;
    title: string;
    amount: number;
    description: string;
    onDataChange: (data: PaymentData) => void;
    initialData?: PaymentData;
}

export default function PaymentStep({
    stepId,
    title,
    amount,
    description,
    onDataChange,
    initialData
}: PaymentStepProps) {
    const [formData, setFormData] = useState<PaymentData>(
        initialData || {
            paymentMethod: 'upi',
            paymentId: '',
            screenshotFile: null,
            amount: amount,
            status: 'pending'
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [paymentInitiated, setPaymentInitiated] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update parent component whenever form data changes
    useEffect(() => {
        onDataChange(formData);
    }, [formData, onDataChange]);

    const validateFile = (file: File): string | null => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (file.size > maxSize) {
            return 'File size must be less than 5MB';
        }

        if (!allowedTypes.includes(file.type)) {
            return 'Only JPG and PNG files are allowed';
        }

        return null;
    };

    const handleFileUpload = (file: File) => {
        const error = validateFile(file);
        if (error) {
            setErrors(prev => ({ ...prev, screenshotFile: error }));
            return;
        }

        setErrors(prev => ({ ...prev, screenshotFile: '' }));
        setFormData(prev => ({
            ...prev,
            screenshotFile: file,
            status: 'completed'
        }));
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const removeFile = () => {
        setFormData(prev => ({
            ...prev,
            screenshotFile: null,
            status: 'pending'
        }));
        setErrors(prev => ({ ...prev, screenshotFile: '' }));
    };

    const handlePaymentMethodChange = (method: 'upi' | 'card' | 'netbanking') => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    const initiatePayment = () => {
        setPaymentInitiated(true);
        // In real implementation, this would integrate with payment gateway
        const mockPaymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setFormData(prev => ({ ...prev, paymentId: mockPaymentId }));

        // Simulate payment gateway redirect
        setTimeout(() => {
            alert(`Payment initiated! Payment ID: ${mockPaymentId}\n\nPlease complete the payment and upload the screenshot.`);
        }, 1000);
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
                {/* Payment Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-800 mb-2 flex items-center">
                        <IndianRupee className="w-6 h-6 mr-2" />
                        {title}
                    </h3>
                    <p className="text-blue-700 mb-4">{description}</p>
                    <div className="bg-white p-4 rounded-md border border-blue-200">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Amount to Pay:</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {formatCurrency(amount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Select Payment Method</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => handlePaymentMethodChange('upi')}
                            className={`p-4 border-2 rounded-lg text-center transition-colors ${formData.paymentMethod === 'upi'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Smartphone className="w-8 h-8 mx-auto mb-2" />
                            <div className="font-medium">UPI</div>
                            <div className="text-sm text-gray-500">PhonePe, GPay, etc.</div>
                        </button>

                        <button
                            onClick={() => handlePaymentMethodChange('card')}
                            className={`p-4 border-2 rounded-lg text-center transition-colors ${formData.paymentMethod === 'card'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <CreditCard className="w-8 h-8 mx-auto mb-2" />
                            <div className="font-medium">Card</div>
                            <div className="text-sm text-gray-500">Debit/Credit Card</div>
                        </button>

                        <button
                            onClick={() => handlePaymentMethodChange('netbanking')}
                            className={`p-4 border-2 rounded-lg text-center transition-colors ${formData.paymentMethod === 'netbanking'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <CreditCard className="w-8 h-8 mx-auto mb-2" />
                            <div className="font-medium">Net Banking</div>
                            <div className="text-sm text-gray-500">Online Banking</div>
                        </button>
                    </div>
                </div>

                {/* Payment Action */}
                <div className="text-center">
                    <button
                        onClick={initiatePayment}
                        disabled={paymentInitiated}
                        className={`px-8 py-3 rounded-lg font-medium transition-colors ${paymentInitiated
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                    >
                        {paymentInitiated ? 'Payment Initiated' : `Pay ${formatCurrency(amount)}`}
                    </button>

                    {formData.paymentId && (
                        <p className="text-sm text-gray-600 mt-2">
                            Payment ID: <span className="font-mono">{formData.paymentId}</span>
                        </p>
                    )}
                </div>

                {/* Screenshot Upload */}
                {paymentInitiated && (
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                        <h4 className="text-lg font-medium text-yellow-800 mb-4 flex items-center">
                            <Upload className="w-5 h-5 mr-2" />
                            Upload Payment Screenshot
                        </h4>

                        {formData.screenshotFile ? (
                            <div className="bg-white p-4 rounded-md border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span className="text-sm text-gray-700">{formData.screenshotFile.name}</span>
                                        <span className="text-xs text-gray-500">
                                            ({(formData.screenshotFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                    <button
                                        onClick={removeFile}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed border-yellow-300 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-400 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                <p className="text-yellow-700 mb-1">
                                    Click to upload payment screenshot
                                </p>
                                <p className="text-sm text-yellow-600">
                                    Supports: JPG, PNG (Max 5MB)
                                </p>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileInputChange}
                            className="hidden"
                        />

                        {errors.screenshotFile && (
                            <p className="text-red-500 text-sm mt-2">{errors.screenshotFile}</p>
                        )}
                    </div>
                )}

                {/* Status Display */}
                <div className={`p-4 rounded-lg border ${formData.status === 'completed'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Payment Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${formData.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {formData.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}