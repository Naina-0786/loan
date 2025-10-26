import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/apiClient";

const ManageContacts: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        phoneNumber: "",
    });

    const navigate = useNavigate();

    // Check admin auth
    useEffect(() => {
        const token = localStorage.getItem("dhani_admin_token");
        if (!token) {
            navigate("/admin/login");
        }
    }, []);

    // Fetch contact on mount
    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async () => {
        setLoading(true);
        try {
            const response = await api.get("/contact/get-one");
            const contact = response.data.data;
            if (contact) {
                setFormData({
                    email: contact.email || "",
                    phoneNumber: contact.phoneNumber || "",
                });
            }
        } catch (error: any) {
            console.error("Error fetching contact:", error.response?.data || error.message);
            toast.error("Error fetching contact. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updateContact = async (formData: any) => {
        try {
            const response = await api.put("/contact", formData, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error: any) {
            console.error("Error updating contact:", error.response?.data || error.message);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateContact(formData);
            toast.success("Contact updated successfully");
            fetchContact(); // refresh the form data
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update contact");
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
                    <h1 className="text-2xl font-bold text-gray-900">Manage Contact</h1>
                    <p className="text-gray-600">View and update the contact details</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-lg shadow p-6 space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
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

export default ManageContacts;