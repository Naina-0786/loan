import { Image, Phone, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../api/apiClient"; // Your axios client
import AdminLayout from "../../components/admin/AdminLayout";

interface QRCodeData {
  id: number;
  phone: string | null;
  image: { public_id: string; secure_url: string } | null;
  createdAt: string;
  updatedAt: string;
}

export default function QRCodeManager() {
  const [formData, setFormData] = useState({
    phone: "",
    image: null as File | null,
  });
  const [qrCode, setQrCode] = useState<QRCodeData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.phone && !formData.image) {
      newErrors.form = "Either phone number or image is required";
    }
    if (formData.phone && formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    return newErrors;
  };

  // Run validation on every state change
  useEffect(() => {
    const newErrors = validateForm();
    setErrors(newErrors);
    console.log("Form state:", { formData, errors: newErrors });
  }, [formData.phone, formData.image]);

  // Fetch existing QR code on mount
  useEffect(() => {
    const fetchQRCode = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/v1/qr/get");
        const qrData = response.data.data;
        setQrCode(qrData);
        setFormData((prev) => ({
          ...prev,
          phone: qrData.phone || "",
        }));
      } catch (error: any) {
        if (error.response?.status === 404) {
          setQrCode(null);
          toast.info("No QR code exists. Please create one.");
        } else {
          toast.error(
            error.response?.data?.message || "Failed to fetch QR code"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchQRCode();
  }, []);

  // Handle phone number input change
  const handlePhoneChange = (value: string) => {
    const formattedValue = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: formattedValue }));
    console.log("Phone changed:", formattedValue);
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPEG, PNG, and WEBP images are allowed",
        }));
        setFormData((prev) => ({ ...prev, image: null }));
        setPreviewUrl(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 10MB",
        }));
        setFormData((prev) => ({ ...prev, image: null }));
        setPreviewUrl(null);
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
      console.log("Image selected:", file.name);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (isLoading || Object.keys(errors).length > 0) {
      console.log("Submit blocked:", { isLoading, errors });
      return;
    }
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      if (formData.phone) {
        formDataToSend.append("phone", formData.phone);
      }
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      const response = await api.put("/v1/qr/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setQrCode(response.data.data);
      setFormData({ phone: response.data.data.phone || "", image: null });
      setPreviewUrl(null);
      toast.success(
        qrCode
          ? "QR code updated successfully!"
          : "QR code created successfully!"
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update QR code");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear image preview
  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreviewUrl(null);
    setErrors((prev) => ({ ...prev, image: "" }));
    console.log("Image cleared");
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              QR Code Manager
            </h3>
            <p className="text-blue-700 text-sm mb-2">
              {qrCode
                ? "Update the existing QR code for payments."
                : "Create a QR code for payments."}
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Provide either a phone number, an image, or both</li>
              <li>• Image must be JPEG, PNG, or WEBP (max 10MB)</li>
              <li>• Phone number must be 10 digits</li>
            </ul>
          </div>

          {isLoading && (
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Form Section */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              {qrCode ? "Update QR Code" : "Create QR Code"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter phone number"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 inline mr-1" />
                  QR Code Image
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.image ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
                {previewUrl && (
                  <div className="mt-2">
                    <img
                      src={previewUrl}
                      alt="QR Code Preview"
                      className="w-32 h-32 object-contain rounded-md"
                    />
                    <button
                      onClick={clearImage}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                      disabled={isLoading}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>
            {errors.form && (
              <p className="text-red-500 text-sm mt-4">{errors.form}</p>
            )}
            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSubmit}
                disabled={isLoading || Object.keys(errors).length > 0}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isLoading || Object.keys(errors).length > 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading
                  ? "Submitting..."
                  : qrCode
                  ? "Update QR Code"
                  : "Create QR Code"}
              </button>
            </div>
          </div>

          {/* Current QR Code Details */}
          {qrCode && (
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Current QR Code Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Phone Number:
                  </p>
                  <p className="text-gray-900">
                    {qrCode.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    QR Code Image:
                  </p>
                  {qrCode.image && qrCode.image.secure_url ? (
                    <img
                      src={qrCode.image.secure_url}
                      alt="Current QR Code"
                      className="w-48 h-48 object-contain rounded-md mt-2"
                    />
                  ) : (
                    <p className="text-gray-900">No image provided</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Last Updated: {new Date(qrCode.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
