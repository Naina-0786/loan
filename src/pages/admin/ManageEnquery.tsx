import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/apiClient';

interface Popup {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    message: string;
    createdAt: string;
}

interface PopupResponse {
    popup: Popup[];
    totalPopUp: number;
    totalPages: number;
    currentPage: number;
    count: number;
}

const ManageInquiries: React.FC = () => {
    const [inquiries, setInquiries] = useState<Popup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const navigate = useNavigate();

    // Check for admin token and redirect to login if not present
    useEffect(() => {
        const token = localStorage.getItem('dhani_admin_token');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    // Fetch inquiries with pagination and search
    useEffect(() => {
        const fetchInquiries = async () => {
            setLoading(true);
            try {
                const response = await api.get<PopupResponse>('/popup/all', {
                    params: { page: currentPage, limit, search: searchTerm },
                });
                setInquiries(response.data.popup || []);
                setTotalPages(response.data.totalPages || 1);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching inquiries:', error);
                setLoading(false);
            }
        };
        fetchInquiries();
    }, [currentPage, searchTerm, limit]);

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Handle view details navigation
    const handleViewDetails = (id: number) => {
        navigate(`/admin/inquiries/${id}`);
    };

    // Handle delete inquiry
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this inquiry?')) {
            try {
                await api.delete(`/popup/${id}`);
                // Refresh inquiries after deletion
                setCurrentPage(1); // Reset to first page to avoid empty page issues
            } catch (error) {
                console.error('Error deleting inquiry:', error);
            }
        }
    };

    // Pagination controls
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Inquiries</h1>
                    <p className="text-gray-600">Review and manage customer inquiries</p>
                </div>

                {/* Search */}
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
                </div>

                {/* Inquiries Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Inquirer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Message Preview
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Submitted Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : inquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        No inquiries found
                                    </td>
                                </tr>
                            ) : (
                                inquiries.map((inquiry) => (
                                    <tr key={inquiry.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                                                <div className="text-sm text-gray-500">{inquiry.email}</div>
                                                <div className="text-sm text-gray-500">{inquiry.phoneNumber}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 line-clamp-2">{inquiry.message}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(inquiry.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewDetails(inquiry.id)}
                                                className="text-blue-600 hover:text-blue-900 flex items-center mr-4"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDelete(inquiry.id)}
                                                className="text-red-600 hover:text-red-900 flex items-center"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
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

export default ManageInquiries;