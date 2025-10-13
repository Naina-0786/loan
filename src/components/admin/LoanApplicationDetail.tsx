import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getLoanApplicationById, updateFeeStatus, LoanApplication } from '../../api/loanApplicationApi';

const LoanApplicationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [application, setApplication] = useState<LoanApplication | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchApplication(Number(id));
        }
    }, [id]);

    const fetchApplication = async (appId: number) => {
        setLoading(true);
        try {
            const data = await getLoanApplicationById(appId);
            setApplication(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching application:', error);
            setLoading(false);
            alert('Error fetching application details. Please try again.');
        }
    };

    const handleUpdateFeeStatus = async (feeType: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
        if (!application) return;
        try {
            const updated = await updateFeeStatus(application.id, feeType, status);
            setApplication(updated);
        } catch (error) {
            console.error('Error updating fee status:', error);
            alert('Error updating fee status. Please try again.');
        }
    };

    const StatusBadge: React.FC<{ status: 'PENDING' | 'APPROVED' | 'REJECTED' }> = ({ status }) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800'
        };

        const icons = {
            PENDING: <Clock className="h-3 w-3" />,
            APPROVED: <CheckCircle className="h-3 w-3" />,
            REJECTED: <XCircle className="h-3 w-3" />
        };

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
                {icons[status]}
                <span className="ml-1">{status}</span>
            </span>
        );
    };

    const FeeSection: React.FC<{ 
        label: string; 
        feeField: keyof LoanApplication; 
        statusField: keyof LoanApplication; 
    }> = ({ label, feeField, statusField }) => {
        if (!application) return null;
        const screenshot = application[feeField] as { url?: string } | null;
        const url = screenshot?.url;
        const status = application[statusField] as 'PENDING' | 'APPROVED' | 'REJECTED';

        return (
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{label}</span>
                    </div>
                    {url && (
                        <a
                            href={url}
                            download
                            className="text-blue-600 hover:text-blue-900 flex items-center text-sm"
                        >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                        </a>
                    )}
                </div>
                {url && (
                    <div className="mt-2">
                        <img 
                            src={url} 
                            alt={`${label} screenshot`} 
                            className="max-w-full h-auto rounded-lg shadow-md" 
                        />
                    </div>
                )}
                {url && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Current Status:</span>
                        <StatusBadge status={status} />
                        <select
                            onChange={(e) => handleUpdateFeeStatus(statusField as string, e.target.value as 'APPROVED' | 'REJECTED' | 'PENDING')}
                            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            defaultValue=""
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="APPROVED">Approve</option>
                            <option value="REJECTED">Reject</option>
                            <option value="PENDING">Pending</option>
                        </select>
                    </div>
                )}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: string | null) => {
        if (!amount) return 'N/A';
        return `₹${parseInt(amount).toLocaleString('en-IN')}`;
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!application) {
        return (
            <AdminLayout>
                <div className="p-6">
                    <p className="text-red-600">Application not found.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6">
                <button
                    onClick={() => navigate('/admin/manage-applications')} // Adjust path as needed
                    className="flex items-center text-blue-600 hover:text-blue-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Applications
                </button>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Loan Application Details</h1>
                    <p className="text-gray-600">ID: {application.id} • Applied on: {formatDate(application.createdAt)}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6 space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><span className="font-medium">Full Name:</span> {application.fullName || 'N/A'}</div>
                            <div><span className="font-medium">Father's Name:</span> {application.fatherName || 'N/A'}</div>
                            <div><span className="font-medium">Email:</span> {application.email}</div>
                            <div><span className="font-medium">Phones:</span> {application.phoneNumber || 'N/A'}</div>
                            <div><span className="font-medium">Aadhar Number:</span> {application.aadharNumber || 'N/A'}</div>
                            <div><span className="font-medium">PAN Number:</span> {application.panNumber || 'N/A'}</div>
                            <div><span className="font-medium">Address:</span> {application.address || 'N/A'}</div>
                            <div><span className="font-medium">Pincode:</span> {application.pincode || 'N/A'}</div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Loan Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><span className="font-medium">Loan Amount:</span> {formatCurrency(application.loanAmount)}</div>
                            <div><span className="font-medium">Interest Rate:</span> {application.interest || 'N/A'}%</div>
                            <div><span className="font-medium">Tenure:</span> {application.loanTenure || 'N/A'} months</div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><span className="font-medium">Bank Name:</span> {application.bankName || 'N/A'}</div>
                            <div><span className="font-medium">Account Number:</span> {application.accountNumber || 'N/A'}</div>
                            <div><span className="font-medium">IFSC Code:</span> {application.ifscCode || 'N/A'}</div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4">Fee Payments and Approvals</h2>
                        <div className="space-y-6">
                            <FeeSection 
                                label="Processing Fee" 
                                feeField="processingFee" 
                                statusField="processingFeeStatus" 
                            />
                            <FeeSection 
                                label="Bank Transaction Paper Fee" 
                                feeField="bankTransactionPaperFee" 
                                statusField="bankTransactionStatus" 
                            />
                            <FeeSection 
                                label="Insurance Fee" 
                                feeField="insuranceFee" 
                                statusField="insuranceStatus" 
                            />
                            <FeeSection 
                                label="CIBIL Fee" 
                                feeField="cibilFee" 
                                statusField="cibilStatus" 
                            />
                            <FeeSection 
                                label="TDS Fee" 
                                feeField="tdsFee" 
                                statusField="tdsStatus" 
                            />
                            <FeeSection 
                                label="NOC Fee" 
                                feeField="nocFee" 
                                statusField="nocStatus" 
                            />
                        </div>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
};

export default LoanApplicationDetail;