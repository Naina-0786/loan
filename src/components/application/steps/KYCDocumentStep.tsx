import { CreditCard, MapPin, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import api from '../../../api/apiClient';

export default function KYCDocumentStep() {
    const [formData, setFormData] = useState({
        aadharNumber: '',
        panNumber: '',
        fullName: '',
        fatherName: '',
        address: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);

    // Fetch loan application data on mount
    useEffect(() => {
        const fetchLoanApplication = async () => {
            const applicationId = localStorage.getItem('loanApplicationId');
            if (!applicationId) {
                console.log('No loanApplicationId found in localStorage');
                setIsReadOnly(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await api.get(`/loan-applications/${applicationId}`);
                const { data } = response.data;
                console.log('Fetched loan application:', data);

                // Check if all required KYC details are non-null and non-empty
                const hasKYCDetails =
                    data.aadhaarNumber?.trim() &&
                    data.fullName?.trim() &&
                    data.fatherName?.trim() &&
                    data.address?.trim();

                setFormData({
                    aadharNumber: data.aadhaarNumber?.trim() || '',
                    panNumber: data.panNumber?.trim() || '',
                    fullName: data.fullName?.trim() || '',
                    fatherName: data.fatherName?.trim() || '',
                    address: data.address?.trim() || ''
                });

                setIsReadOnly(hasKYCDetails);
                console.log('isReadOnly set to:', hasKYCDetails);

                // Dispatch custom event if KYC details are complete
                if (hasKYCDetails) {
                    const event = new CustomEvent('kycDetailsSubmitted', {
                        detail: { isValid: true, stepId: 4 }
                    });
                    window.dispatchEvent(event);
                    console.log('Dispatched kycDetailsSubmitted event:', { isValid: true, stepId: 4 });
                }
            } catch (error: any) {
                console.error('Failed to fetch KYC details:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch KYC details');
                setIsReadOnly(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLoanApplication();
    }, []);

    const handleInputChange = (field: string, value: string) => {
        if (isReadOnly) {
            console.log(`Input change blocked for ${field}: Form is read-only`);
            return;
        }

        // Apply input formatting
        let formattedValue = value;
        if (field === 'aadhaarNumber') {
            formattedValue = value.replace(/\D/g, '').slice(0, 12);
        } else if (field === 'panNumber') {
            formattedValue = value.toUpperCase().slice(0, 10);
        }

        setFormData((prev) => ({ ...prev, [field]: formattedValue }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
        console.log(`Input changed: ${field} = ${formattedValue}`);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.aadharNumber.trim()) {
            newErrors.aadhaarNumber = 'Aadhaar number is mandatory';
        } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
            newErrors.aadhaarNumber = 'Aadhaar number must be 12 digits';
        }

        if (formData.panNumber && formData.panNumber.length !== 10) {
            newErrors.panNumber = 'Invalid PAN number format';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.fatherName.trim()) {
            newErrors.fatherName = "Father's name is required";
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (isReadOnly || isLoading || !validateForm()) {
            console.log('Submit blocked:', { isReadOnly, isLoading, isValid: !Object.keys(errors).length });
            return;
        }

        setIsLoading(true);
        try {
            const applicationId = localStorage.getItem('loanApplicationId');
            if (!applicationId) {
                throw new Error('Loan application ID not found');
            }

            await api.post(`/loan-applications/${applicationId}`, {
                aadhaarNumber: formData.aadharNumber.trim(),
                panNumber: formData.panNumber.trim() || null,
                fullName: formData.fullName.trim(),
                fatherName: formData.fatherName.trim(),
                address: formData.address.trim()
            });

            setIsReadOnly(true);
            toast.success('KYC details submitted successfully!');
            console.log('KYC details submitted:', formData);

            // Dispatch custom event to signal successful submission
            const event = new CustomEvent('kycDetailsSubmitted', {
                detail: { isValid: true, stepId: 4 }
            });
            window.dispatchEvent(event);
            console.log('Dispatched kycDetailsSubmitted event:', { isValid: true, stepId: 4 });
        } catch (error: any) {
            console.error('Failed to save KYC details:', error);
            toast.error(error.response?.data?.message || 'Failed to save KYC details');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
                {/* Instructions */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        KYC Document Verification
                    </h3>
                    <p className="text-blue-700 text-sm mb-2">
                        Please provide your identity details for verification.
                    </p>
                    <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Aadhaar number is mandatory (12 digits)</li>
                        <li>• PAN number is optional but recommended (10 characters)</li>
                        <li>• Ensure details match official records</li>
                    </ul>
                </div>

                {isLoading && (
                    <div className="flex justify-center mb-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Document Input Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Aadhaar Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="w-4 h-4 inline mr-1" />
                            Aadhaar Number *
                        </label>
                        <input
                            type="text"
                            value={formData.aadharNumber}
                            onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                            placeholder="Enter your Aadhaar number"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
                            } ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            readOnly={isReadOnly}
                            disabled={isLoading}
                        />
                        {errors.aadhaarNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>
                        )}
                    </div>

                    {/* PAN Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="w-4 h-4 inline mr-1" />
                            PAN Number
                        </label>
                        <input
                            type="text"
                            value={formData.panNumber}
                            onChange={(e) => handleInputChange('panNumber', e.target.value)}
                            placeholder="Enter your PAN number"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.panNumber ? 'border-red-500' : 'border-gray-300'
                            } ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            readOnly={isReadOnly}
                            disabled={isLoading}
                        />
                        {errors.panNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>
                        )}
                    </div>
                </div>

                {/* Personal Information Section */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                placeholder="Enter your full name as per Aadhaar"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.fullName ? 'border-red-red-500' : 'border-gray-300'
                                } ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                readOnly={isReadOnly}
                                disabled={isLoading}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Father's Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="w-4 h-4 inline mr-1" />
                                Father's Name *
                            </label>
                            <input
                                type="text"
                                value={formData.fatherName}
                                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                                placeholder="Enter father's name"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.fatherName ? 'border-red-500' : 'border-gray-300'
                                } ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                readOnly={isReadOnly}
                                disabled={isLoading}
                            />
                            {errors.fatherName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mt-4 sm:mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Address with Pincode *
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Enter your complete address with pincode"
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.address ? 'border-red-500' : 'border-gray-300'
                            } ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            readOnly={isReadOnly}
                            disabled={isLoading}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={validateForm}
                        disabled={isLoading || isReadOnly}
                        className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors ${
                            isLoading || isReadOnly ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                    >
                        Validate Information
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || isReadOnly || Object.keys(errors).length > 0 || !formData.aadharNumber || !formData.fullName || !formData.fatherName || !formData.address}
                        className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors ${
                            isLoading || isReadOnly || Object.keys(errors).length > 0 || !formData.aadharNumber || !formData.fullName || !formData.fatherName || !formData.address
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {isLoading ? 'Submitting...' : isReadOnly ? 'KYC Details Saved' : 'Submit KYC Details'}
                    </button>
                </div>

                {isReadOnly && (
                    <p className="text-green-600 text-sm text-center mt-4">
                        ✓ KYC details saved successfully
                    </p>
                )}
            </div>
        </div>
    );
}