import { useState } from 'react';
import api from '../api/apiClient';

export default function TestConnection() {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testHealthCheck = async () => {
        setLoading(true);
        try {
            const response = await api.get('/health');
            setResult(`Health Check Success: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error: any) {
            setResult(`Health Check Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testOTPGenerate = async () => {
        setLoading(true);
        try {
            const response = await api.post('/otp/generate', { email: 'test@example.com' });
            setResult(`OTP Generate Success: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error: any) {
            setResult(`OTP Generate Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testOTPVerify = async () => {
        setLoading(true);
        try {
            const response = await api.post('/otp/verify', {
                email: 'test@example.com',
                otp: '123456'
            });
            setResult(`OTP Verify Success: ${JSON.stringify(response.data, null, 2)}`);

            // Store the application ID for testing
            if (response.data.data?.loanApplication?.id) {
                localStorage.setItem('loanApplicationId', response.data.data.loanApplication.id.toString());
                localStorage.setItem('userEmail', 'test@example.com');
            }
        } catch (error: any) {
            setResult(`OTP Verify Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testLoanApplicationUpdate = async () => {
        setLoading(true);
        try {
            const applicationId = localStorage.getItem('loanApplicationId');
            if (!applicationId) {
                setResult('No application ID found. Please verify OTP first.');
                setLoading(false);
                return;
            }

            const response = await api.put(`/loan-applications/${applicationId}`, {
                loanAmount: '500000',
                interest: '2',
                loanTenure: 60
            });
            setResult(`Loan Application Update Success: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error: any) {
            setResult(`Loan Application Update Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testGetLoanApplication = async () => {
        setLoading(true);
        try {
            const applicationId = localStorage.getItem('loanApplicationId');
            if (!applicationId) {
                setResult('No application ID found. Please verify OTP first.');
                setLoading(false);
                return;
            }

            const response = await api.get(`/loan-applications/${applicationId}`);
            setResult(`Get Loan Application Success: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error: any) {
            setResult(`Get Loan Application Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Backend Connection Test</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    onClick={testHealthCheck}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Test Health Check
                </button>

                <button
                    onClick={testOTPGenerate}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    Test OTP Generate
                </button>

                <button
                    onClick={testOTPVerify}
                    disabled={loading}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                >
                    Test OTP Verify
                </button>

                <button
                    onClick={testLoanApplicationUpdate}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                    Test Loan Update
                </button>

                <button
                    onClick={testGetLoanApplication}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    Test Get Loan App
                </button>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Result:</h2>
                <pre className="whitespace-pre-wrap text-sm">
                    {loading ? 'Loading...' : result || 'No test run yet'}
                </pre>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p><strong>Stored Application ID:</strong> {localStorage.getItem('loanApplicationId') || 'None'}</p>
                <p><strong>Stored Email:</strong> {localStorage.getItem('userEmail') || 'None'}</p>
            </div>
        </div>
    );
}