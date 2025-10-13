import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  getLoanApplication,
  uploadPaymentScreenshot,
} from "../../../api/loanApplicationApi";
import html2pdf from "html2pdf.js";
import NocLogo from "../../assets/noc/Noc Logo.jpg";
import DirectorSignature from "../../assets/gst/IMG-20250324-WA0036.jpg";
import AuthorizedSignature from "../../assets/noc/IMG-20250324-WA0035.jpg";
import NotaryStamp from "../../assets/certificate/IMG-20250324-WA0029.png";

interface FormData {
  screenshotFile: File | null;
  paymentId: string;
  screenshotUrl: string | null;
}

interface NocFormData {
  date: string;
  refNumber: string;
  recipientName: string;
  totalAmount: string;
  nocCharges: string;
}

export default function NocFeeStep() {
  const [paymentStatus, setPaymentStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    screenshotFile: null,
    paymentId: "",
    screenshotUrl: null,
  });
  const [nocFormData, setNocFormData] = useState<NocFormData | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Initialize axios instance
  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 10000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("dhani_admin_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("dhani_admin_token");
        if (window.location.pathname !== "/admin/login") {
          window.location.href = "/admin/login";
        }
      }
      return Promise.reject(error);
    }
  );

  // Clean up screenshotUrl to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.screenshotUrl) {
        URL.revokeObjectURL(formData.screenshotUrl);
      }
    };
  }, [formData.screenshotUrl]);

  // Load existing data and check payment status
  useEffect(() => {
    const loadExistingData = async () => {
      const applicationId = localStorage.getItem("loanApplicationId");
      if (!applicationId) {
        console.log("No loanApplicationId found in localStorage");
        toast.error("Loan application ID not found");
        return;
      }

      setIsLoading(true);
      try {
        const application = await getLoanApplication(parseInt(applicationId));
        const newStatus = application.nocStatus || null;
        console.log(
          "loadExistingData - paymentStatus:",
          newStatus,
          "application:",
          application
        );
        setPaymentStatus(newStatus);

        const hasNocFee = application.nocFee?.public_id;
        setIsReadOnly(hasNocFee && newStatus !== "REJECTED");
        console.log(
          "isReadOnly set to:",
          hasNocFee && newStatus !== "REJECTED"
        );

        if (hasNocFee && application.nocFee) {
          setFormData({
            screenshotFile: null,
            paymentId: application.nocFee.paymentId || "",
            screenshotUrl: application.nocFee.url || null,
          });
        }

        // Populate NOC form data if APPROVED
        if (newStatus === "APPROVED") {
          const nocData = {
            date: new Date().toISOString().split("T")[0],
            refNumber: `NOC_${application.id}_${Date.now()}`,
            recipientName: application.fullName || "Unknown Applicant",
            totalAmount: application.loanAmount?.toString() || "1000000",
            nocCharges: "200",
          };
          setNocFormData(nocData);
          console.log("nocFormData set in loadExistingData:", nocData);

          const event = new CustomEvent("nocFeeSubmitted", {
            detail: { isValid: true, stepId: 10 },
          });
          window.dispatchEvent(event);
          console.log("Dispatched nocFeeSubmitted event:", {
            isValid: true,
            stepId: 10,
          });
        } else if (newStatus === "REJECTED") {
          toast.error(
            "Payment verification failed. Please upload a valid screenshot."
          );
        }
      } catch (error: any) {
        console.error("Failed to load payment status:", error);
        toast.error(
          error.response?.data?.message || "Failed to load payment status"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingData();
  }, []);

  // Poll payment status when PENDING
  useEffect(() => {
    if (paymentStatus !== "PENDING") return;

    const checkPaymentStatus = async () => {
      try {
        const applicationId = localStorage.getItem("loanApplicationId");
        if (!applicationId) return false;

        const application = await getLoanApplication(parseInt(applicationId));
        const newStatus = application.nocStatus || "PENDING";
        console.log(
          "checkPaymentStatus - paymentStatus:",
          newStatus,
          "application:",
          application
        );
        setPaymentStatus(newStatus);

        if (newStatus === "APPROVED") {
          const nocData = {
            date: new Date().toISOString().split("T")[0],
            refNumber: `NOC_${application.id}_${Date.now()}`,
            recipientName: application.fullName || "Unknown Applicant",
            totalAmount: application.loanAmount?.toString() || "1000000",
            nocCharges: "200",
          };
          setNocFormData(nocData);
          console.log("nocFormData set in checkPaymentStatus:", nocData);

          const event = new CustomEvent("nocFeeSubmitted", {
            detail: { isValid: true, stepId: 10 },
          });
          window.dispatchEvent(event);
          console.log("Dispatched nocFeeSubmitted event:", {
            isValid: true,
            stepId: 10,
          });
          toast.success("Payment verified! You can proceed to the next step.");
          return true;
        } else if (newStatus === "REJECTED") {
          setIsReadOnly(false);
          toast.error(
            "Payment verification failed. Please upload a valid screenshot."
          );
          return true;
        }
      } catch (error) {
        console.error("Failed to check payment status:", error);
      }
      return false;
    };

    const interval = setInterval(async () => {
      const shouldStop = await checkPaymentStatus();
      if (shouldStop) {
        clearInterval(interval);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [paymentStatus]);

  // Debug rendering
  useEffect(() => {
    console.log(
      "Rendering - paymentStatus:",
      paymentStatus,
      "nocFormData:",
      nocFormData
    );
  }, [paymentStatus, nocFormData]);

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) {
      console.log("File change blocked: Form is read-only");
      return;
    }
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      screenshotFile: file,
      screenshotUrl: file ? URL.createObjectURL(file) : null,
    }));
  };

  // Handle payment submission
  const handleSubmit = async () => {
    if (isReadOnly || !formData.screenshotFile) {
      toast.error("Please upload a screenshot to proceed.");
      return;
    }

    setIsLoading(true);
    try {
      const applicationId = localStorage.getItem("loanApplicationId");
      if (!applicationId) throw new Error("Loan application ID not found");

      await uploadPaymentScreenshot(
        parseInt(applicationId),
        "nocFee",
        formData.screenshotFile,
        {
          paymentMethod: "default",
          paymentId: formData.paymentId || `PAY_${Date.now()}`,
          amount: 200,
        }
      );

      setIsReadOnly(true);
      setPaymentStatus("PENDING");
      toast.success(
        "Payment screenshot uploaded successfully! Waiting for admin verification."
      );
      console.log("Payment details submitted:", formData);

      const event = new CustomEvent("nocFeeSubmitted", {
        detail: { isValid: false, stepId: 10 },
      });
      window.dispatchEvent(event);
      console.log("Dispatched nocFeeSubmitted event:", {
        isValid: false,
        stepId: 10,
      });
    } catch (error: any) {
      console.error("Failed to upload payment screenshot:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload payment screenshot"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate Sub-Total Amount
  const calculateSubTotal = (formData: NocFormData) => {
    const total = parseFloat(formData.totalAmount.replace(/,/g, "")) || 0;
    const charges = parseFloat(formData.nocCharges.replace(/,/g, "")) || 0;
    return (total + charges).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format the date for display (e.g., "2025-03-11" to "11/03/2025")
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Handle PDF download
  const handlePrint = () => {
    if (printRef.current && nocFormData) {
      const element = printRef.current;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `NOC_Certificate_${nocFormData.refNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, width: 750 },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .catch((err: unknown) => {
          console.error("PDF generation failed:", err);
          toast.error("Failed to generate PDF");
        });
    }
  };

  // Non-APPROVED state UI
  if (paymentStatus !== "APPROVED") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            NOC Fee Payment
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed">
            This fee covers the No Objection Certificate (NOC) processing for
            your loan application. It includes document clearance verification.
          </p>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 border border-gray-200 shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Payment Details
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-4">
              Amount to Pay: ₹200
            </p>
          </div>

          {!isReadOnly && (
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Upload Payment Screenshot *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading || isReadOnly}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  isReadOnly
                    ? "bg-gray-100 cursor-not-allowed border-gray-300"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              />
              {!formData.screenshotFile && !isReadOnly && (
                <p className="text-red-500 text-sm mt-1 sm:mt-2">
                  Please upload a screenshot to proceed.
                </p>
              )}
            </div>
          )}

          {formData.screenshotUrl && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Uploaded Screenshot
              </h3>
              <div className="relative w-full h-48 sm:h-64 bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <img
                  src={formData.screenshotUrl}
                  alt="Payment Screenshot"
                  className="w-full h-full object-contain p-2 sm:p-4"
                />
                <div className="absolute top-2 right-2 sm:top-2 sm:right-2 bg-white rounded-full p-1 sm:p-2 shadow-md">
                  <svg
                    className="w-4 sm:w-6 h-4 sm:h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading || isReadOnly || !formData.screenshotFile}
              className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isLoading || isReadOnly || !formData.screenshotFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : isReadOnly ? (
                "Image Uploaded"
              ) : (
                "Pay"
              )}
            </button>
          </div>

          {paymentStatus && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Payment Status
              </h3>
              {paymentStatus === "PENDING" && (
                <div className="flex items-center bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                  <div className="flex-shrink-0">
                    <div className="h-8 sm:h-12 w-8 sm:w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <svg
                        className="h-4 sm:h-6 w-4 sm:w-6 text-yellow-600 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <h4 className="text-base sm:text-lg font-medium text-yellow-800">
                      Pending
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      Your payment is under review. Please wait for
                      verification.
                    </p>
                  </div>
                </div>
              )}
              {paymentStatus === "REJECTED" && (
                <div className="flex items-center bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
                  <div className="flex-shrink-0">
                    <div className="h-8 sm:h-12 w-8 sm:w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <svg
                        className="h-4 sm:h-6 w-4 sm:w-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <h4 className="text-base sm:text-lg font-medium text-red-800">
                      Rejected
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      Payment verification failed. Please upload a valid
                      screenshot.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // APPROVED state UI with NOC PDF preview
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform hover:scale-[1.01] transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          NOC Fee Payment
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed">
          Your NOC fee payment has been successfully verified. Download the NOC
          certificate below.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center shadow-md mb-4 sm:mb-6">
          <svg
            className="w-14 sm:w-16 h-14 sm:h-16 text-green-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
            NOC Fee Payment Approved
          </h3>
          <p className="text-green-700 text-sm sm:text-base">
            Your NOC fee payment has been successfully verified. Download the
            NOC certificate below.
          </p>
        </div>

        {nocFormData ? (
          <>
            <div className="mb-6 bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                NOC Certificate Preview
              </h4>
              <div
                ref={printRef}
                className="bg-white p-6 shadow-lg relative font-sans print-card"
              >
                <div className="header">
                  <img src={NocLogo} alt="NOC Logo" className="w-48 h-20" />
                  <h1>NO OBJECTION CERTIFICATE</h1>
                  <p>
                    OFFICE OF THE DIRECTORATE OF
                    <br />
                    KERALA MEGA LOTTERY,
                    <br />
                  </p>
                </div>

                <div className="date-ref">
                  <p>DATE: {formatDateForDisplay(nocFormData.date)}</p>
                  <p>REF NO: {nocFormData.refNumber}</p>
                </div>

                <div className="subject">SUBJ:- REQUESTED DO NOT OBJECT</div>

                <div className="body">
                  <p>RESPECTED SIR,</p>
                  <p>
                    THIS IS WITH REFERENCE TO MR/MRS.{" "}
                    <span className="recipient">
                      {nocFormData.recipientName}
                    </span>
                  </p>
                  <p>
                    THE AMOUNT IS DELIVERED AFTER THE COMPLETION OF ALL
                    REGULATIONS OF THE DEPARTMENT AND HE/SHE HAS CLEARED ALL
                    GOVT TAXES. I REQUEST THE INCOME TAX DEPARTMENT NOT TO
                    INQUIRE OR OBJECT.
                  </p>
                  <p>
                    Total Amount: ₹{" "}
                    {parseFloat(nocFormData.totalAmount).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                  <p>
                    NOC Charges: ₹{" "}
                    {parseFloat(nocFormData.nocCharges).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                  <p className="amount">
                    Sub-Total Amount: ₹ {calculateSubTotal(nocFormData)}
                  </p>
                  <p className="thanks">THANKS A LOT</p>
                </div>

                <div className="footer">
                  <div className="signature-container">
                    <img
                      src={DirectorSignature}
                      alt="Director Signature"
                      className="signature-img"
                    />
                  </div>
                  <div className="stamp-container">
                    <img
                      src={NotaryStamp}
                      alt="Notary Stamp"
                      className="stamp"
                    />
                  </div>
                  <div className="signature-container">
                    <img
                      src={AuthorizedSignature}
                      alt="Authorized Signature"
                      className="signature-img"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handlePrint}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 border-2 border-yellow-700 text-white hover:scale-105 transition-all duration-300 flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg"
              >
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 2a2 2 0 00-2 2v4a2 2 0 01-2 2v4a2 2 0 002 2h2v2a2 2 0 002 2h8a2 2 0 002-2v-2h2a2 2 0 002-2v-4a2 2 0 01-2-2V4a2 2 0 00-2-2H6z"
                  />
                </svg>
                Download NOC Certificate
              </button>
            </div>
          </>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center shadow-md mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-2">
              Error Loading NOC Certificate
            </h3>
            <p className="text-red-700 text-sm sm:text-base">
              Unable to generate the NOC certificate. Please contact support.
            </p>
          </div>
        )}

        {formData.screenshotUrl && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md mb-4 sm:mb-6">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Uploaded Screenshot
            </h4>
            <div className="relative w-full h-48 sm:h-64 bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <img
                src={formData.screenshotUrl}
                alt="Payment Screenshot"
                className="w-full h-full object-contain p-2 sm:p-4"
              />
              <div className="absolute top-2 right-2 sm:top-2 sm:right-2 bg-white rounded-full p-1 sm:p-2 shadow-md">
                <svg
                  className="w-4 sm:w-6 h-4 sm:h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 shadow-md">
          <h4 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3">
            Next Steps
          </h4>
          <ul className="text-blue-700 space-y-2 text-sm sm:text-base">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">
                1
              </span>
              <span>Download and save the NOC certificate</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">
                2
              </span>
              <span>
                Proceed to the next step in the loan application process
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">
                3
              </span>
              <span>Contact support if you encounter any issues</span>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        .preview-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .preview-wrapper::-webkit-scrollbar {
          display: none;
        }
        .print-card {
          width: 700px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          position: relative;
          overflow: visible;
          font-family: Arial, sans-serif;
        }
        .dark .print-card {
          background: #1f2937;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          height: 80px;
        }
        .header img {
          width: 192px;
          height: 80px;
          object-fit: contain;
        }
        .header h1 {
          color: #F89406;
          font-size: 24px;
          font-weight: 800;
          text-transform: uppercase;
          margin: 0;
          text-align: center;
          flex: 1;
        }
        .header p {
          color: #F89406;
          font-size: 14px;
          text-transform: uppercase;
          text-align: right;
          margin: 0;
          line-height: 1.2;
          max-width: 200px;
        }
        .date-ref {
          margin-bottom: 20px;
        }
        .date-ref p {
          font-size: 14px;
          color: #000;
          margin: 5px 0;
        }
        .dark .date-ref p {
          color: #fff;
        }
        .subject {
          font-size: 14px;
          color: #F89406;
          text-transform: uppercase;
          border-bottom: 1px solid #F89406;
          padding-bottom: 2px;
          margin-bottom: 20px;
        }
        .body {
          font-size: 14px;
          color: #000;
          text-transform: uppercase;
          line-height: 1.5;
        }
        .dark .body {
          color: #fff;
        }
        .body .recipient {
          border-bottom: 1px solid #F89406;
          display: inline;
        }
        .body p {
          margin: 10px 0;
        }
        .body .amount {
          font-weight: bold;
        }
        .body .thanks {
          text-align: right;
          margin-top: 20px;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
        }
        .footer .signature-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .footer .stamp-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .footer img.signature-img {
          height: 80px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .footer img.stamp {
          height: 160px;
          width: auto;
          object-fit: contain;
          display: block;
        }
      `}</style>
    </div>
  );
}
