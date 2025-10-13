import { CreditCard, MapPin, Phone, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../api/apiClient";
import { useStepper } from "../../../contexts/StepperContext";

export default function KYCDocumentStep() {
  const { updateStepData, dispatch } = useStepper();
  const [formData, setFormData] = useState({
    aadharNumber: "",
    panNumber: "",
    fullName: "",
    fatherName: "",
    address: "",
    pincode: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Fetch loan application data on mount
  useEffect(() => {
    const applicationId = localStorage.getItem("loanApplicationId");
    if (!applicationId) {
      console.log("No loanApplicationId found in localStorage");
      setIsReadOnly(false);
      return;
    }

    let isMounted = true;
    const fetchLoanApplication = async () => {
      setIsLoading(true);
      try {
        console.log(
          "Calling API: /loan-applications/",
          applicationId,
          new Date().toISOString()
        );
        const response = await api.get(`/loan-applications/${applicationId}`);
        const { data } = response.data;
        console.log("Fetched loan application:", data);

        if (!isMounted) return;

        // Check if all required KYC details are non-null and non-empty
        const hasKYCDetails =
          data.aadharNumber?.trim() &&
          data.fullName?.trim() &&
          data.fatherName?.trim() &&
          data.address?.trim() &&
          data.pincode?.trim() &&
          data.phoneNumber?.trim();

        setFormData({
          aadharNumber: data.aadharNumber?.trim() || "",
          panNumber: data.panNumber?.trim() || "",
          fullName: data.fullName?.trim() || "",
          fatherName: data.fatherName?.trim() || "",
          address: data.address?.trim() || "",
          pincode: data.pincode?.trim() || "",
          phoneNumber: data.phoneNumber?.trim() || "",
        });

        setIsReadOnly(hasKYCDetails);
        console.log("isReadOnly set to:", hasKYCDetails);

        // Update stepper state if KYC details are complete
        if (hasKYCDetails) {
          dispatch({
            type: "SET_STEP_VALID",
            payload: { stepId: 4, isValid: true },
          });
          dispatch({ type: "SET_CAN_PROCEED", payload: true });
          updateStepData(4, {
            aadharNumber: data.aadharNumber,
            panNumber: data.panNumber,
            fullName: data.fullName,
            fatherName: data.fatherName,
            address: data.address,
            pincode: data.pincode,
            phoneNumber: data.phoneNumber,
          });
        }
      } catch (error: any) {
        console.error("Failed to fetch KYC details:", error);
        if (isMounted) {
          toast.error(
            error.response?.data?.message || "Failed to fetch KYC details"
          );
          setIsReadOnly(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLoanApplication();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (isReadOnly) {
      console.log(`Input change blocked for ${field}: Form is read-only`);
      return;
    }

    // Apply input formatting
    let formattedValue = value;
    if (field === "aadharNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 12);
    } else if (field === "panNumber") {
      formattedValue = value.toUpperCase().slice(0, 10);
    } else if (field === "pincode") {
      formattedValue = value.replace(/\D/g, "").slice(0, 6);
    } else if (field === "phoneNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    console.log(`Input changed: ${field} = ${formattedValue}`);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.aadharNumber.trim() || formData.aadharNumber.length !== 12) {
      newErrors.aadharNumber = "Aadhaar number must be 12 digits";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father's name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!formData.phoneNumber.trim() || formData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isReadOnly || isLoading || !validateForm()) {
      console.log("Submit blocked:", {
        isReadOnly,
        isLoading,
        isValid: !Object.keys(errors).length,
      });
      return;
    }

    setIsLoading(true);
    try {
      const applicationId = localStorage.getItem("loanApplicationId");
      if (!applicationId) {
        throw new Error("Loan application ID not found");
      }

      const payload = {
        aadharNumber: formData.aadharNumber.trim(),
        panNumber: formData.panNumber.trim() || null,
        fullName: formData.fullName.trim(),
        fatherName: formData.fatherName.trim(),
        address: formData.address.trim(),
        pincode: formData.pincode.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      };

      console.log("Submitting KYC payload:", payload);

      await api.post(`/loan-applications/${applicationId}`, payload);

      setIsReadOnly(true);
      toast.success("KYC details submitted successfully!");
      console.log("KYC details submitted:", formData);

      // Update stepper state to enable Next button
      dispatch({
        type: "SET_STEP_VALID",
        payload: { stepId: 4, isValid: true },
      });
      dispatch({ type: "SET_CAN_PROCEED", payload: true });
      updateStepData(4, { ...formData });
    } catch (error: any) {
      console.error("Failed to save KYC details:", error);
      toast.error(
        error.response?.data?.message || "Failed to save KYC details"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            KYC Document Verification
          </h3>
          <p className="text-blue-700 text-sm mb-2">
            Please provide your identity details for verification.
          </p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Aadhaar number is mandatory</li>
            <li>• PAN number is optional</li>
            <li>• Ensure details match official records</li>
          </ul>
        </div>

        {isLoading && (
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Document Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Aadhaar Number *
            </label>
            <input
              type="text"
              value={formData.aadharNumber}
              onChange={(e) =>
                handleInputChange("aadharNumber", e.target.value)
              }
              placeholder="Enter your Aadhaar number"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.aadharNumber ? "border-red-500" : "border-gray-300"
              } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
              readOnly={isReadOnly}
              disabled={isLoading}
            />
            {errors.aadharNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>
            )}
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              PAN Number
            </label>
            <input
              type="text"
              value={formData.panNumber}
              onChange={(e) => handleInputChange("panNumber", e.target.value)}
              placeholder="Enter your PAN number"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.panNumber ? "border-red-500" : "border-gray-300"
              } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
              readOnly={isReadOnly}
              disabled={isLoading}
            />
            {errors.panNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>
            )}
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="Enter your phone number"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isReadOnly}
                disabled={isLoading}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name as per Aadhaar"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isReadOnly}
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Father's Name *
              </label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) =>
                  handleInputChange("fatherName", e.target.value)
                }
                placeholder="Enter father's name"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fatherName ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isReadOnly}
                disabled={isLoading}
              />
              {errors.fatherName && (
                <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>
              )}
            </div>
          </div>

          {/* Address and Pincode */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your complete address"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isReadOnly}
                disabled={isLoading}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Pincode *
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                placeholder="Enter your pincode"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pincode ? "border-red-500" : "border-gray-300"
                } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                readOnly={isReadOnly}
                disabled={isLoading}
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={validateForm}
            disabled={isLoading || isReadOnly}
            className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors ${
              isLoading || isReadOnly
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Validate Information
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              isReadOnly ||
              Object.keys(errors).length > 0 ||
              !formData.aadharNumber ||
              formData.aadharNumber.length !== 12 ||
              !formData.fullName ||
              !formData.fatherName ||
              !formData.address ||
              !formData.pincode ||
              !formData.phoneNumber ||
              formData.phoneNumber.length !== 10
            }
            className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors ${
              isLoading ||
              isReadOnly ||
              Object.keys(errors).length > 0 ||
              !formData.aadharNumber ||
              formData.aadharNumber.length !== 12 ||
              !formData.fullName ||
              !formData.fatherName ||
              !formData.address ||
              !formData.pincode ||
              !formData.phoneNumber ||
              formData.phoneNumber.length !== 10
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading
              ? "Submitting..."
              : isReadOnly
              ? "KYC Details Saved"
              : "Submit KYC Details"}
          </button>
        </div>

        {isReadOnly && (
          <p className="text-green-600 text-sm text-center mt-4">
            ✓ KYC details saved successfully
          </p>
        )}
      </div>
    </div>
  );
}
