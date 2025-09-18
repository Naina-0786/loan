import { CreditCard, MapPin, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { updateLoanApplication } from '../../../api/loanApplicationApi';
import { useStepper } from '../../../contexts/StepperContext';
import { KYCData } from '../../../types/stepper';

export default function KYCDocumentStep() {
    const { updateStepData, dispatch, state } = useStepper();
    const [formData, setFormData] = useState<KYCData>({
        aadhaarNumber: '',
        panNumber: '',
        fullName: '',
        fatherName: '',
        address: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Load existing data on component mount
    useEffect(() => {
        if (state.applicationData) {
            const appData = state.applicationData;
            if (appData.aadhaarNumber || appData.panNumber || appData.fullName || appData.fatherName || appData.address) {
                setFormData({
                    aadhaarNumber: appData.aadhaarNumber || '',
                    panNumber: appData.panNumber || '',
                    fullName: appData.fullName || '',
                    fatherName: appData.fatherName || '',
                    address: appData.address || ''
                });

                // Mark step as valid if all required fields are filled
                if (appData.aadhaarNumber && appData.fullName && appData.fatherName && appData.address) {
                    dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 4, isValid: true } });
                }
            }
        }
    }, [state.applicationData, dispatch]);

    // Update stepper data whenever form data changes
    useEffect(() => {
        updateStepData(4, formData);
    }, [formData, updateStepData]);

    const handleInputChange = (field: keyof KYCData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.aadhaarNumber.trim()) {
            newErrors.aadhaarNumber = 'Aadhaar number is mandatory';
        } else if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
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
        if (validateForm()) {
            setIsLoading(true);
            try {
                const applicationId = localStorage.getItem('loanApplicationId');
                if (applicationId) {
                    await updateLoanApplication(parseInt(applicationId), {
                        aadharNumber: formData.aadhaarNumber,
                        panNumber: formData.panNumber,
                        fullName: formData.fullName,
                        fatherName: formData.fatherName,
                        address: formData.address
                    });

                    // Update stepper data and mark step as valid
                    updateStepData(4, formData);
                    dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 4, isValid: true } });

                    toast.success('KYC details submitted successfully!');
                }
            } catch (error) {
                console.error('Failed to save KYC details:', error);
                toast.error('Failed to save KYC details');
            } finally {
                setIsLoading(false);
            }
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
                            value={formData.aadhaarNumber}
                            onChange={(e) => handleInputChange('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
                            placeholder="Enter your Aadhaar number"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                            onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase().slice(0, 10))}
                            placeholder="Enter your PAN number"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.panNumber ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                                }`}
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
                                }`}
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
                            }`}
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
                        className="w-full sm:w-auto px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Validate Information
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || Object.keys(errors).length > 0 || !formData.aadhaarNumber || !formData.fullName || !formData.fatherName || !formData.address}
                        className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors ${
                            isLoading || Object.keys(errors).length > 0 || !formData.aadhaarNumber || !formData.fullName || !formData.fatherName || !formData.address
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {isLoading ? 'Submitting...' : 'Submit KYC Details'}
                    </button>
                </div>
            </div>
        </div>
    );
}