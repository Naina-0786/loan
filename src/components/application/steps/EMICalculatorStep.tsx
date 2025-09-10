import React, { useState, useEffect } from 'react';
import { useStepper } from '../../../contexts/StepperContext';
import { EMIData } from '../../../types/stepper';
import { calculateEMI, formatCurrency, formatNumber } from '../../../utils/loanCalculator';
import { Calculator, IndianRupee, Calendar, Percent } from 'lucide-react';

export default function EMICalculatorStep() {
    const { updateStepData } = useStepper();
    const [formData, setFormData] = useState<EMIData>({
        loanAmount: 500000,
        interestRate: 10.5,
        tenure: 60,
        tenureType: 'months',
        calculatedEMI: 0,
        totalInterest: 0,
        totalPayment: 0
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

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
            } catch (error) {
                console.error('EMI calculation error:', error);
            }
        }
    }, [formData.loanAmount, formData.interestRate, formData.tenure, formData.tenureType, updateStepData]);

    const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        if (value < 50000) {
            setErrors(prev => ({ ...prev, loanAmount: 'Minimum loan amount is ₹50,000' }));
        } else if (value > 10000000) {
            setErrors(prev => ({ ...prev, loanAmount: 'Maximum loan amount is ₹1,00,00,000' }));
        } else {
            setErrors(prev => ({ ...prev, loanAmount: '' }));
        }
        setFormData(prev => ({ ...prev, loanAmount: value }));
    };

    const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        if (value < 1) {
            setErrors(prev => ({ ...prev, interestRate: 'Interest rate must be at least 1%' }));
        } else if (value > 50) {
            setErrors(prev => ({ ...prev, interestRate: 'Interest rate cannot exceed 50%' }));
        } else {
            setErrors(prev => ({ ...prev, interestRate: '' }));
        }
        setFormData(prev => ({ ...prev, interestRate: value }));
    };

    const handleTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const currentTenureInMonths = formData.tenureType === 'years' ? formData.tenure * 12 : formData.tenure;
        const newTenure = type === 'years' ? Math.round(currentTenureInMonths / 12) : currentTenureInMonths;

        setFormData(prev => ({
            ...prev,
            tenureType: type,
            tenure: newTenure
        }));
        setErrors(prev => ({ ...prev, tenure: '' }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                            <Calculator className="w-5 h-5 mr-2" />
                            Loan Details
                        </h3>
                        <p className="text-blue-700 text-sm">
                            Enter your loan requirements to calculate EMI
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
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.loanAmount ? 'border-red-500' : 'border-gray-300'
                                }`}
                            min="50000"
                            max="10000000"
                            step="10000"
                        />
                        {errors.loanAmount && (
                            <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Range: ₹50,000 - ₹1,00,00,000</p>
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
                            onChange={handleInterestRateChange}
                            placeholder="Enter interest rate"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.interestRate ? 'border-red-500' : 'border-gray-300'
                                }`}
                            min="1"
                            max="50"
                            step="0.1"
                        />
                        {errors.interestRate && (
                            <p className="text-red-500 text-sm mt-1">{errors.interestRate}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">Range: 1% - 50%</p>
                    </div>

                    {/* Tenure */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Loan Tenure *
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={formData.tenure || ''}
                                onChange={handleTenureChange}
                                placeholder="Enter tenure"
                                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tenure ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                min={formData.tenureType === 'years' ? 1 : 12}
                                max={formData.tenureType === 'years' ? 30 : 360}
                            />
                            <div className="flex bg-gray-100 rounded-md p-1">
                                <button
                                    type="button"
                                    onClick={() => handleTenureTypeChange('months')}
                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${formData.tenureType === 'months'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Months
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTenureTypeChange('years')}
                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${formData.tenureType === 'years'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
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
                                <p className="text-3xl font-bold text-blue-600">
                                    {formatCurrency(formData.calculatedEMI || 0)}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                                <p className="text-xl font-semibold text-orange-600">
                                    {formatCurrency(formData.totalInterest || 0)}
                                </p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600 mb-1">Total Payment</p>
                                <p className="text-xl font-semibold text-gray-800">
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
        </div>
    );
}