import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/apiClient";

const ManageFee: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    processingFee: "",
    bankTransactionPaperFee: "",
    insuranceFee: "",
    cibilFee: "",
    tdsFee: "",
    nocFee: "",
  });

  useEffect(() => {
    fetchFee();
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("dhani_admin_token");
    if (!token) {
      navigate("/admin/login");
    }
  }, []);

  // Fetch payment fee data
  const fetchFee = async () => {
    setLoading(true);
    try {
      console.log("Fetching fee from:", "/admin/payment-fees");
      const response = await api.get("/admin/payment-fees");
      const fee = response.data.data; 
      console.log("Fetched fee:", fee);
      setFormData({
        processingFee: fee?.processingFee || "",
        bankTransactionPaperFee: fee?.bankTransactionPaperFee || "",
        insuranceFee: fee?.insuranceFee || "",
        cibilFee: fee?.cibilFee || "",
        tdsFee: fee?.tdsFee || "",
        nocFee: fee?.nocFee || "",
      });
    } catch (error: any) {
      console.error(
        "Error fetching payment fee:",
        error.response?.data || error.message
      );
      toast.error("Error fetching payment fee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update payment fee data
  const updatePaymentFee = async (formData: any) => {
    try {
      console.log("Updating fee with:", formData);
      const response = await api.put("/admin/payment-fees", formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Update response:", response.data);
    } catch (error: any) {
      console.error(
        "Error updating payment fee:",
        error.response?.data || error.message
      );
      throw error; // Re-throw to handle in handleSubmit
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePaymentFee(formData);
      toast.success("Payment fee updated successfully");
      fetchFee(); // Refetch to confirm updates
    } catch (error: any) {
      console.error("Submit error:", error.response?.data || error.message);
      toast.error("Error updating payment fee. Please try again.");
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
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Payment Fees
          </h1>
          <p className="text-gray-600">
            View and update the payment fee configurations
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Fee
            </label>
            <input
              type="text"
              name="processingFee"
              value={formData.processingFee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Transaction Paper Fee
            </label>
            <input
              type="text"
              name="bankTransactionPaperFee"
              value={formData.bankTransactionPaperFee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Fee
            </label>
            <input
              type="text"
              name="insuranceFee"
              value={formData.insuranceFee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CIBIL Fee
            </label>
            <input
              type="text"
              name="cibilFee"
              value={formData.cibilFee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TDS Fee
            </label>
            <input
              type="text"
              name="tdsFee"
              value={formData.tdsFee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NOC Fee
            </label>
            <input
              type="text"
              name="nocFee"
              value={formData.nocFee}
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

export default ManageFee;
