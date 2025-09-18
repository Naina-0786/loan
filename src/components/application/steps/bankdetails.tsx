import React, { useState, useEffect } from "react";
import { Building, CreditCard, Landmark } from "lucide-react";
import axios from "axios";
import api from "../../../api/apiClient";
import { useStepper } from "../../../contexts/StepperContext";
import { updateLoanApplication } from "../../../api/loanApplicationApi";
import { toast } from "sonner";

export default function BankDetailsPage() {
    const { updateStepData, dispatch, state } = useStepper();
    const [formData, setFormData] = useState({
        bankName: "",
        accountNumber: "",
        ifscCode: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load existing data on component mount
    useEffect(() => {
        if (state.applicationData) {
            const appData = state.applicationData;
            if (appData.bankName || appData.accountNumber || appData.ifscCode) {
                setFormData({
                    bankName: appData.bankName || "",
                    accountNumber: appData.accountNumber || "",
                    ifscCode: appData.ifscCode || "",
                });
                
                // Mark step as valid if all fields are filled
                if (appData.bankName && appData.accountNumber && appData.ifscCode) {
                    dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 3, isValid: true } });
                }
            }
        }
    }, [state.applicationData, dispatch]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.bankName.trim()) {
            newErrors.bankName = "Bank name is required";
        }

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = "Account number is required";
        } else if (!/^[0-9]{9,18}$/.test(formData.accountNumber)) {
            newErrors.accountNumber = "Invalid account number format";
        }

        if (!formData.ifscCode.trim()) {
            newErrors.ifscCode = "IFSC code is required";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
            newErrors.ifscCode = "Invalid IFSC code format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const applicationId = localStorage.getItem('loanApplicationId');
                if (applicationId) {
                    await updateLoanApplication(parseInt(applicationId), {
                        bankName: formData.bankName,
                        accountNumber: formData.accountNumber,
                        ifscCode: formData.ifscCode
                    });
                    
                    // Update stepper data
                    updateStepData(3, formData);
                    dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 3, isValid: true } });
                    
                    toast.success("Bank details submitted successfully!");
                }
            } catch (error) {
                console.error('Failed to save bank details:', error);
                toast.error('Failed to save bank details');
            }
        }
    };

    // Update stepper data whenever form data changes
    useEffect(() => {
        updateStepData(3, formData);
    }, [formData, updateStepData]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
                    Bank Details for Loan Processing
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bank Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Building className="w-4 h-4 inline mr-1 text-blue-600" />
                            Bank Name
                        </label>
                        <input
                            type="text"
                            value={formData.bankName}
                            onChange={(e) => handleInputChange("bankName", e.target.value)}
                            placeholder="Enter your bank name"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bankName ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.bankName && (
                            <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                        )}
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="w-4 h-4 inline mr-1 text-blue-600" />
                            Account Number
                        </label>
                        <input
                            type="text"
                            value={formData.accountNumber}
                            onChange={(e) =>
                                handleInputChange("accountNumber", e.target.value)
                            }
                            placeholder="Enter your account number"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.accountNumber ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.accountNumber && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.accountNumber}
                            </p>
                        )}
                    </div>

                    {/* IFSC Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Landmark className="w-4 h-4 inline mr-1 text-blue-600" />
                            IFSC Code
                        </label>
                        <input
                            type="text"
                            value={formData.ifscCode}
                            onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                            placeholder="Enter IFSC code"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${errors.ifscCode ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.ifscCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                        >
                            Submit Bank Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
