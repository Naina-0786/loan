import { Building, CreditCard, Landmark } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../api/apiClient";
import { useStepper } from "../../../contexts/StepperContext";

export default function BankDetailsPage() {
    const { updateStepData, dispatch } = useStepper();
    const [formData, setFormData] = useState({
        bankName: "",
        accountNumber: "",
        ifscCode: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);

    // Fetch loan application data on mount
    useEffect(() => {
        const applicationId = localStorage.getItem("loanApplicationId");
        if (!applicationId) {
            console.log("No loanApplicationId found in localStorage");
            setIsReadOnly(false);
            return;
        }

        let isMounted = true; // Prevent updates after unmount
        const fetchLoanApplication = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/loan-applications/${applicationId}`);
                const { data } = response.data;
                console.log("Fetched loan application:", data);

                if (!isMounted) return; // Prevent state updates if unmounted

                // Check if all bank details are non-null and non-empty
                const hasBankDetails =
                    data.bankName?.trim() &&
                    data.accountNumber?.trim() &&
                    data.ifscCode?.trim();

                setFormData({
                    bankName: data.bankName?.trim() || "",
                    accountNumber: data.accountNumber?.trim() || "",
                    ifscCode: data.ifscCode?.trim() || ""
                });

                setIsReadOnly(hasBankDetails);
                console.log("isReadOnly set to:", hasBankDetails);

                // Update stepper state if bank details are complete
                if (hasBankDetails) {
                    dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 3, isValid: true } });
                    dispatch({ type: 'SET_CAN_PROCEED', payload: true });
                    updateStepData(3, {
                        bankName: data.bankName,
                        accountNumber: data.accountNumber,
                        ifscCode: data.ifscCode
                    });
                }
            } catch (error: any) {
                console.error("Failed to fetch loan application:", error);
                if (isMounted) {
                    toast.error(error.response?.data?.message || "Failed to fetch bank details");
                    setIsReadOnly(false);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchLoanApplication();

        return () => {
            isMounted = false; // Cleanup to prevent state updates after unmount
        };
    }, []); // Dependencies unchanged

    const handleInputChange = (field: string, value: string) => {
        if (isReadOnly) {
            console.log(`Input change blocked for ${field}: Form is read-only`);
            return;
        }

        // For ifscCode, convert to uppercase
        const formattedValue = field === "ifscCode" ? value.toUpperCase() : value;
        setFormData((prev) => ({ ...prev, [field]: formattedValue }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
        console.log(`Input changed: ${field} = ${formattedValue}`);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.bankName.trim()) {
            newErrors.bankName = "Bank name is required";
        }

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = "Account number is required";
        }

        if (!formData.ifscCode.trim()) {
            newErrors.ifscCode = "IFSC code is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly || isLoading || !validateForm()) {
            console.log("Submit blocked:", { isReadOnly, isLoading, isValid: !Object.keys(errors).length });
            return;
        }

        setIsLoading(true);
        try {
            const applicationId = localStorage.getItem("loanApplicationId");
            if (!applicationId) {
                throw new Error("Loan application ID not found");
            }

            // Use POST to match existing logic
            await api.post(`/loan-applications/${applicationId}`, {
                bankName: formData.bankName.trim(),
                accountNumber: formData.accountNumber.trim(),
                ifscCode: formData.ifscCode.trim()
            });

            setIsReadOnly(true);
            toast.success("Bank details submitted successfully!");
            console.log("Bank details submitted:", formData);

            // Update stepper state to enable Next button
            dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 3, isValid: true } });
            dispatch({ type: 'SET_CAN_PROCEED', payload: true });
            updateStepData(3, { ...formData });
        } catch (error: any) {
            console.error("Failed to save bank details:", error);
            toast.error(error.response?.data?.message || "Failed to save bank details");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
                    Bank Details for Loan Processing
                </h2>

                {isLoading && (
                    <div className="flex justify-center mb-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

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
                                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            readOnly={isReadOnly}
                            disabled={isLoading}
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
                            onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                            placeholder="Enter your account number"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.accountNumber ? "border-red-500" : "border-gray-300"
                                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            readOnly={isReadOnly}
                            disabled={isLoading}
                        />
                        {errors.accountNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
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
                                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            readOnly={isReadOnly}
                            disabled={isLoading}
                        />
                        {errors.ifscCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={isLoading || isReadOnly || Object.keys(errors).length > 0}
                            className={`w-full py-3 rounded-lg font-medium transition-colors ${isLoading || isReadOnly || Object.keys(errors).length > 0
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                } shadow-md`}
                        >
                            {isLoading ? "Submitting..." : isReadOnly ? "Bank Details Saved" : "Submit Bank Details"}
                        </button>
                    </div>
                </form>

                {isReadOnly && (
                    <p className="text-green-600 text-sm text-center mt-4">
                        ✓ Bank details saved successfully
                    </p>
                )}
            </div>
        </div>
    );
}