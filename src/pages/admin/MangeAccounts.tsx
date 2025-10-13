import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/apiClient";

const ManageAccountNumbers: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        accountNumber: "",
        bankName: "",
        ifscCode: "",
    });

    const navigate = useNavigate();

    // Check admin auth
    useEffect(() => {
        const token = localStorage.getItem("dhani_admin_token");
        if (!token) {
            navigate("/admin/login");
        }
    }, []);

    // Fetch account number on mount
    useEffect(() => {
        fetchAccount();
    }, []);

    const fetchAccount = async () => {
        setLoading(true);
        try {
            const response = await api.get("/account/get-one"); // adjust your backend route
            const account = response.data.data;
            if (account) {
                setFormData({
                    accountNumber: account.accountNumber || "",
                    bankName: account.bankName || "",
                    ifscCode: account.ifscCode || "",
                });
            }
        } catch (error: any) {
            console.error("Error fetching account:", error.response?.data || error.message);
            toast.error("Error fetching account number. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateAccount = async (formData: any) => {
        try {
            const response = await api.put("/account/account", formData, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error: any) {
            console.error("Error updating account:", error.response?.data || error.message);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateAccount(formData);
            toast.success("Account number updated successfully");
            fetchAccount(); // refresh the form data
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update account number");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Account Number</h1>
                    <p className="text-gray-600">View and update the bank account number</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-lg shadow p-6 space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Number
                        </label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Name
                        </label>
                        <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            IFSC Code
                        </label>
                        <input
                            type="text"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default ManageAccountNumbers;
