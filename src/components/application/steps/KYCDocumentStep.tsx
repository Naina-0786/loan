import React, { useState, useEffect, useRef } from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { KYCData } from '../../../types/stepper';
import { Upload, FileText, X, Check, User, MapPin, Users } from 'lucide-react';

export default function KYCDocumentStep() {
    const { updateStepData } = useStepper();
    const [formData, setFormData] = useState<KYCData>({
        aadhaarFile: null,
        panFile: null,
        fullName: '',
        fatherName: '',
        address: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dragActive, setDragActive] = useState<string | null>(null);

    const aadhaarInputRef = useRef<HTMLInputElement>(null);
    const panInputRef = useRef<HTMLInputElement>(null);

    // Update stepper data whenever form data changes
    useEffect(() => {
        updateStepData(3, formData);
    }, [formData, updateStepData]);

    const validateFile = (file: File, type: 'aadhaar' | 'pan'): string | null => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

        if (file.size > maxSize) {
            return 'File size must be less than 5MB';
        }

        if (!allowedTypes.includes(file.type)) {
            return 'Only JPG, PNG, and PDF files are allowed';
        }

        return null;
    };

    const handleFileUpload = (file: File, type: 'aadhaar' | 'pan') => {
        const error = validateFile(file, type);
        if (error) {
            setErrors(prev => ({ ...prev, [`${type}File`]: error }));
            return;
        }

        setErrors(prev => ({ ...prev, [`${type}File`]: '' }));
        setFormData(prev => ({ ...prev, [`${type}File`]: file }));
    };

    const handleDrop = (e: React.DragEvent, type: 'aadhaar' | 'pan') => {
        e.preventDefault();
        setDragActive(null);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload(files[0], type);
        }
    };

    const handleDragOver = (e: React.DragEvent, type: 'aadhaar' | 'pan') => {
        e.preventDefault();
        setDragActive(type);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(null);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'pan') => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleFileUpload(files[0], type);
        }
    };

    const removeFile = (type: 'aadhaar' | 'pan') => {
        setFormData(prev => ({ ...prev, [`${type}File`]: null }));
        setErrors(prev => ({ ...prev, [`${type}File`]: '' }));
    };

    const handleInputChange = (field: keyof KYCData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.aadhaarFile) {
            newErrors.aadhaarFile = 'Aadhaar card is mandatory';
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

    const FileUploadArea = ({ type, label, required = false }: {
        type: 'aadhaar' | 'pan';
        label: string;
        required?: boolean;
    }) => {
        const file = formData[`${type}File` as keyof KYCData] as File | null;
        const isDragging = dragActive === type;
        const hasError = errors[`${type}File`];

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 inline mr-1" />
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
                            ? 'border-blue-400 bg-blue-50'
                            : hasError
                                ? 'border-red-300 bg-red-50'
                                : file
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-300 hover:border-gray-400'
                        }`}
                    onDrop={(e) => handleDrop(e, type)}
                    onDragOver={(e) => handleDragOver(e, type)}
                    onDragLeave={handleDragLeave}
                >
                    {file ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                            </div>
                            <button
                                onClick={() => removeFile(type)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">
                                Drag and drop your {label.toLowerCase()} here, or{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (type === 'aadhaar') aadhaarInputRef.current?.click();
                                        else panInputRef.current?.click();
                                    }}
                                    className="text-blue-600 hover:text-blue-700 underline"
                                >
                                    browse
                                </button>
                            </p>
                            <p className="text-xs text-gray-500">
                                Supports: JPG, PNG, PDF (Max 5MB)
                            </p>
                        </div>
                    )}
                </div>

                <input
                    ref={type === 'aadhaar' ? aadhaarInputRef : panInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileInputChange(e, type)}
                    className="hidden"
                />

                {hasError && (
                    <p className="text-red-500 text-sm">{hasError}</p>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
                {/* Instructions */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        KYC Document Verification
                    </h3>
                    <p className="text-blue-700 text-sm mb-2">
                        Please upload your identity documents and provide personal information for verification.
                    </p>
                    <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Aadhaar card is mandatory for identity verification</li>
                        <li>• PAN card is optional but recommended</li>
                        <li>• All documents must be clear and readable</li>
                        <li>• File size should not exceed 5MB</li>
                    </ul>
                </div>

                {/* Document Upload Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    <FileUploadArea type="aadhaar" label="Aadhaar Card" required />
                    <FileUploadArea type="pan" label="PAN Card" />
                </div>

                {/* Personal Information Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
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
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
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
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fatherName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.fatherName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Address with Pincode *
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Enter your complete address with pincode"
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                        )}
                    </div>
                </div>

                {/* Validation Button */}
                <div className="text-center">
                    <button
                        onClick={validateForm}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Validate Information
                    </button>
                </div>
            </div>
        </div>
    );
}