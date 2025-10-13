import React, { useState, useEffect } from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { EMIData } from '../../../types/stepper';
import { calculateEMI, formatCurrency } from '../../../utils/loanCalculator';
import { Calculator, IndianRupee, Calendar, Percent } from 'lucide-react';
import { updateLoanApplication } from '../../../api/loanApplicationApi';
import { toast } from 'sonner';

export default function EMICalculatorStep() {
    const { updateStepData, dispatch, state } = useStepper();
    const [formData, setFormData] = useState<EMIData>({
        loanAmount: 500000,
        interestRate: 2, // Fixed at 2%
        tenure: 60,
        tenureType: 'months',
        calculatedEMI: 0,
        totalInterest: 0,
        totalPayment: 0
    });
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);

    // Load existing data on component mount
    useEffect(() => {
        const loadExistingData = async () => {
            try {
                const applicationId = localStorage.getItem('loanApplicationId');
                if (applicationId && state.applicationData) {
                    const appData = state.applicationData;
                    if (appData.loanAmount && appData.loanTenure) {
                        const loanAmount = parseFloat(appData.loanAmount);
                        const tenure = parseInt(appData.loanTenure);

                        // Determine tenure type based on value
                        const tenureType = tenure > 60 ? 'years' : 'months';
                        const tenureValue = tenureType === 'years' ? Math.round(tenure / 12) : tenure;

                        const existingData = {
                            loanAmount,
                            interestRate: 2, // Always keep at 2%
                            tenure: tenureValue,
                            tenureType: tenureType as 'months' | 'years',
                            calculatedEMI: 0,
                            totalInterest: 0,
                            totalPayment: 0
                        };

                        setFormData(existingData);
                        updateStepData(2, existingData);
                        setHasSubmitted(true);
                        setIsReadOnly(true); // Disable inputs and submit button
                        dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 2, isValid: true } });
                    } else {
                        // No backend data, allow user input
                        setIsReadOnly(false);
                        dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 2, isValid: false } });
                    }
                }
            } catch (error) {
                console.error('Failed to load existing EMI data:', error);
                toast.error('Failed to load EMI data');
            }
        };

        loadExistingData();
    }, [state.applicationData, updateStepData, dispatch]);

    // Calculate EMI whenever form data changes
    useEffect(() => {
        if (formData.loanAmount && formData.interestRate && formData.tenure) {
            try {
                const tenureInMonths = formData.tenureType === 'years' ? formData.tenure * 12 : formData.tenure;
                const result = calculateEMI({
                    principal: formData.loanAmount,
                    interestRate: formData.interestRate,
                    tenure: tenureInMonths
                });

                const updatedData = {
                    ...formData,
                    calculatedEMI: result.monthlyEMI,
                    totalInterest: result.totalInterest,
                    totalPayment: result.totalRepayment
                };

                setFormData(updatedData);
                updateStepData(2, updatedData);

                // Only mark as valid if user has submitted the form and it's not read-only
                if (hasSubmitted && !isReadOnly) {
                    dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 2, isValid: true } });
                }
            } catch (error) {
                console.error('EMI calculation error:', error);
                toast.error('Failed to calculate EMI');
            }
        }
    }, [formData.loanAmount, formData.interestRate, formData.tenure, formData.tenureType, updateStepData, hasSubmitted, dispatch, isReadOnly]);

    const saveEMIData = async (data: EMIData) => {
        if (isLoading || isReadOnly) return; // Prevent submission if read-only or loading

        setIsLoading(true);
        try {
            const applicationId = localStorage.getItem('loanApplicationId');
            if (applicationId) {
                const tenureInMonths = data.tenureType === 'years' ? data.tenure * 12 : data.tenure;
                await updateLoanApplication(parseInt(applicationId), {
                    loanAmount: data.loanAmount.toString(),
                    interest: data.interestRate.toString(),
                    loanTenure: tenureInMonths.toString() // Convert to string to match Prisma schema
                });

                // Mark step as valid and set read-only after successful submission
                setHasSubmitted(true);
                setIsReadOnly(true);
                dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 2, isValid: true } });
                toast.success('EMI details saved successfully!');
            }
        } catch (error: any) {
            console.error('Failed to save EMI data:', error);
            toast.error(error.response?.data?.message || 'Failed to save EMI data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isReadOnly) return; // Prevent changes if read-only
        const value = parseFloat(e.target.value) || 0;
        if (value < 5000) {
            setErrors(prev => ({ ...prev, loanAmount: 'Minimum loan amount is ₹5,000' }));
        } else if (value > 10000000) {
            setErrors(prev => ({ ...prev, loanAmount: 'Maximum loan amount is ₹1,00,00,000' }));
        } else {
            setErrors(prev => ({ ...prev, loanAmount: '' }));
        }
        setFormData(prev => ({ ...prev, loanAmount: value }));
    };

    const handleTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isReadOnly) return; // Prevent changes if read-only
        const value = parseInt(e.target.value) || 0;
        const maxTenure = formData.tenureType === 'years' ? 30 : 360;
        const minTenure = formData.tenureType === 'years' ? 1 : 12;

        if (value < minTenure) {
            setErrors(prev => ({
                ...prev,
                tenure: `Minimum tenure is ${minTenure} ${formData.tenureType}`
            }));
        } else if (value > maxTenure) {
            setErrors(prev => ({
                ...prev,
                tenure: `Maximum tenure is ${maxTenure} ${formData.tenureType}`
            }));
        } else {
            setErrors(prev => ({ ...prev, tenure: '' }));
        }
        setFormData(prev => ({ ...prev, tenure: value }));
    };

    const handleTenureTypeChange = (type: 'months' | 'years') => {
        if (isReadOnly) return; // Prevent changes if read-only
        const currentTenureInMonths = formData.tenureType === 'years' ? formData.tenure * 12 : formData.tenure;
        const newTenure = type === 'years' ? Math.round(currentTenureInMonths / 12) : currentTenureInMonths;

        setFormData(prev => ({
            ...prev,
            tenureType: type,
            tenure: newTenure
        }));
        setErrors(prev => ({ ...prev, tenure: '' }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (isReadOnly || isLoading || !formData.loanAmount || !formData.tenure || errors.loanAmount || errors.tenure) {
            return;
        }
        await saveEMIData(formData);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                            <Calculator className="w-5 h-5 mr-2" />
                            Loan Details
                        </h3>
                        <p className="text-blue-700 text-sm">
                            {isReadOnly ? 'Your loan details are saved and cannot be modified.' : 'Enter your loan requirements to calculate EMI'}
                        </p>
                    </div>

                    {/* Loan Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <IndianRupee className="w-4 h-4 inline mr-1" />
                            Loan Amount *
                        </label>
                        <input
                            type="number"
                            value={formData.loanAmount || ''}
                            onChange={handleLoanAmountChange}
                            placeholder="Enter loan amount"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.loanAmount ? 'border-red-500' : 'border-gray-300'
                            } ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            min="5000"
                            max="10000000"
                            step="10000"
                            readOnly={isReadOnly}
                            disabled={isLoading}
                        />
                        {errors.loanAmount && (
                            <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Range: ₹5,000 - ₹1,00,00,000</p>
                    </div>

                    {/* Interest Rate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Percent className="w-4 h-4 inline mr-1" />
                            Interest Rate (% per annum) *
                        </label>
                        <input
                            type="number"
                            value={formData.interestRate || ''}
                            readOnly
                            placeholder="Interest rate is fixed at 2%"
                            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                        {errors.interestRate && (
                            <p className="text-red-500 text-sm mt-1">{errors.interestRate}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Fixed at 2%</p>
                    </div>

                    {/* Tenure */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Loan Tenure *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="number"
                                value={formData.tenure || ''}
                                onChange={handleTenureChange}
                                placeholder="Enter tenure"
                                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.tenure ? 'border-red-500' : 'border-gray-300'
                                } ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                min={formData.tenureType === 'years' ? 1 : 12}
                                max={formData.tenureType === 'years' ? 30 : 360}
                                readOnly={isReadOnly}
                                disabled={isLoading}
                            />
                            <div className="flex bg-gray-100 rounded-md p-1">
                                <button
                                    type="button"
                                    onClick={() => handleTenureTypeChange('months')}
                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        formData.tenureType === 'months'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:text-gray-800'
                                    } ${isReadOnly ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={isReadOnly || isLoading}
                                >
                                    Months
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTenureTypeChange('years')}
                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        formData.tenureType === 'years'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:text-gray-800'
                                    } ${isReadOnly ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={isReadOnly || isLoading}
                                >
                                    Years
                                </button>
                            </div>
                        </div>
                        {errors.tenure && (
                            <p className="text-red-500 text-sm mt-1">{errors.tenure}</p>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                            EMI Calculation Results
                        </h3>
                        <p className="text-green-700 text-sm">
                            Your monthly payment breakdown
                        </p>
                    </div>

                    {/* EMI Result Cards */}
                    <div className="space-y-4">
                        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
                                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                                    {formatCurrency(formData.calculatedEMI || 0)}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                                <p className="text-lg sm:text-xl font-semibold text-orange-600">
                                    {formatCurrency(formData.totalInterest || 0)}
                                </p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600 mb-1">Total Payment</p>
                                <p className="text-lg sm:text-xl font-semibold text-gray-800">
                                    {formatCurrency(formData.totalPayment || 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Loan Summary</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Principal Amount:</span>
                                <span className="font-medium">{formatCurrency(formData.loanAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Interest Rate:</span>
                                <span className="font-medium">{formData.interestRate}% p.a.</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tenure:</span>
                                <span className="font-medium">
                                    {formData.tenure} {formData.tenureType}
                                    {formData.tenureType === 'years' && ` (${formData.tenure * 12} months)`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || isReadOnly || !formData.loanAmount || !formData.tenure || !!errors.loanAmount || !!errors.tenure}
                    className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium transition-colors ${
                        isLoading || isReadOnly || !formData.loanAmount || !formData.tenure || errors.loanAmount || errors.tenure
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isLoading ? 'Saving...' : isReadOnly ? 'EMI Details Saved' : 'Save EMI Details'}
                </button>
            </div>
        </div>
    );
}