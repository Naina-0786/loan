// Updated frontend component: src/pages/admin/ManageApplications.tsx or similar
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllLoanApplications, LoanApplication, LoanApplicationsResponse } from '../../api/loanApplicationApi';

const ManageApplications: React.FC = () => {
    const [applications, setApplications] = useState<LoanApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10); // Can make adjustable if needed
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, [searchTerm, statusFilter, currentPage]);

    useEffect(() => {
        const token = localStorage.getItem("dhani_admin_token");
        if (token) {
            navigate("/admin/manage-admin")
        } else {
            navigate("/admin/login")
        }
    },[])

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response: LoanApplicationsResponse = await getAllLoanApplications(
                currentPage, 
                limit, 
                searchTerm, 
                statusFilter === 'all' ? '' : statusFilter
            );
            setApplications(response.applications || []);
            setTotalPages(response.totalPages || 1);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setLoading(false);
        }
    };

    const getOverallStatus = (application: LoanApplication) => {
        const statuses = [
            application.processingFeeStatus,
            application.bankTransactionStatus,
            application.insuranceStatus,
            application.cibilStatus,
            application.tdsStatus,
            application.nocStatus
        ];

        if (statuses.every(status => status === 'APPROVED')) return 'APPROVED';
        if (statuses.some(status => status === 'REJECTED')) return 'REJECTED';
        return 'PENDING';
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

    const handleViewDetails = (id: number) => {
        navigate(`/admin/loan-applications/${id}`);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Applications</h1>
                    <p className="text-gray-600">Review and process loan applications</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applicant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Loan Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applied Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No applications found
                                    </td>
                                </tr>
                            ) : (
                                applications.map((application) => (
                                    <tr key={application.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{application.fullName || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{application.email}</div>
                                                <div className="text-sm text-gray-500">{application.phone || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{formatCurrency(application.loanAmount)}</div>
                                                <div className="text-sm text-gray-500">{application.interest || 'N/A'}% • {application.loanTenure || 'N/A'} months</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={getOverallStatus(application)} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(application.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewDetails(application.id)}
                                                className="text-blue-600 hover:text-blue-900 flex items-center"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageApplications;