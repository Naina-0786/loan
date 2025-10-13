import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  FileText,
} from "lucide-react";
import {
  getLoanApplication,
  uploadPaymentScreenshot,
} from "../../../api/loanApplicationApi";
import html2pdf from "html2pdf.js";
import { useStepper } from "../../../contexts/StepperContext";
import UserQRCodePayment from "../../document/test/payment";
import { useFeeStore } from "../../../hooks/fee";

import SignatureMd from "../../../assets/assets/Insuranse/signature.jpeg"
import Mohar from "../../../assets/assets/Insuranse/mohar.jpeg"
import Logo from "../../../assets/assets/Insuranse/logo.jpeg"
import Barcode from "../../../assets/assets/Insuranse/barcode.jpeg"
import { formatCurrency } from "../../../utils/utils";
import { useAccountStore } from "../../../hooks/accounts";

interface FormData {
  screenshotFile: File | null;
  screenshotUrl: string | null;
  paymentId: string;
  customerName: string;
  accountNumber: string;
  amount: string;
  date: string;
  fromAccount: string;
  neftRef: string;
  holdAmount: string;
}

export default function InsuranceFeeReceiptStep() {
  const { updateStepData, state, dispatch } = useStepper();
  const [paymentStatus, setPaymentStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [apiLoanData, setApiLoanData] = useState<any>(null);

  const { account, fetchAccount } = useAccountStore()
  
  useEffect(() => {
    if(account) {
      fetchAccount()
    }
  }, [])


  const [formData, setFormData] = useState<FormData>({
    screenshotFile: null,
    screenshotUrl: null,
    paymentId: "",
    customerName: `${apiLoanData?.fullName}`,
    accountNumber: `${apiLoanData?.accountNumber}`,
    amount: "504330/-",
    date: "22/08/2025",
    fromAccount: "XXXXXXX7367",
    neftRef: "264875152390",
    holdAmount: "7263/-",
  });
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // Clean up screenshotUrl to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.screenshotUrl) {
        URL.revokeObjectURL(formData.screenshotUrl);
      }
    };
  }, [formData.screenshotUrl]);

  // Handle input changes for receipt details
  const handleInputChange = (field: keyof FormData, value: string) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
        const newStatus = application.insuranceStatus || null;
        setPaymentStatus(newStatus);
        setApiLoanData(application);

        if (newStatus === "APPROVED") {
          markStepAsCompleted();
        }
        const hasInsuranceFee = application.insuranceFee?.public_id;
        setIsReadOnly(hasInsuranceFee && newStatus !== "REJECTED");

        if (hasInsuranceFee && application.insuranceFee) {
          setFormData((prev) => ({
            ...prev,
            paymentId: application.insuranceFee.paymentId || "",
            screenshotUrl: application.insuranceFee.url || null,
          }));
        }
        if (newStatus === "APPROVED") {
          const event = new CustomEvent("insuranceFeeSubmitted", {
            detail: { isValid: true, stepId: 7 },
          });
          window.dispatchEvent(event);
          console.log("Dispatched insuranceFeeSubmitted event:", {
            isValid: true,
            stepId: 7,
          });
        } else if (newStatus === "REJECTED") {
          toast.error(
            "Payment verification failed. Please upload a valid screenshot."
          );
        }
      } catch (error: unknown) {
        console.error("Failed to load payment status:", error);
        toast.error("Failed to load payment status");
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
        const newStatus = application.insuranceStatus || "PENDING";
        setPaymentStatus(newStatus);

        if (newStatus === "APPROVED") {
          markStepAsCompleted();
          return true;
        } else if (newStatus === "REJECTED") {
          setIsReadOnly(false);
          toast.error(
            "Payment verification failed. Please upload a valid screenshot."
          );
          return true;
        }
      } catch (error: unknown) {
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
        "insuranceFee",
        formData.screenshotFile,
        {
          paymentMethod: "default",
          paymentId: formData.paymentId || `PAY_${Date.now()}`,
          amount: 1500, // Consider making this dynamic
        }
      );

      setIsReadOnly(true);
      setPaymentStatus("PENDING");
      toast.success(
        "Payment screenshot uploaded successfully! Waiting for admin verification."
      );
      const event = new CustomEvent("insuranceFeeSubmitted", {
        detail: { isValid: false, stepId: 7 },
      });
      window.dispatchEvent(event);
      dispatch({
        type: "SET_STEP_VALID",
        payload: { stepId: 7, isValid: false },
      });
      dispatch({ type: "SET_CAN_PROCEED", payload: false });

      updateStepData(7, {
        status: "PENDING",
        completed: false,
        isValid: false,
        canProceed: false,
        paymentId: formData.paymentId,
      });
    } catch (error: unknown) {
      console.error("Failed to upload payment screenshot:", error);
      toast.error(
        (error as any).response?.data?.message ||
          "Failed to upload payment screenshot"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate and download PDF
  const downloadPDF = () => {
    const element = pdfContentRef.current;
    if (!element) {
      console.error("PDF content element not found");
      toast.error("Failed to generate PDF: Content not found");
      return;
    }

    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `SBI_Life_Receipt_${formData.neftRef}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .catch((error: unknown) => {
        console.error("PDF generation failed:", error);
        toast.error("Failed to generate PDF");
      });
  };

  // Add this function to handle step completion
  const markStepAsCompleted = () => {
    dispatch({ type: "SET_STEP_VALID", payload: { stepId: 7, isValid: true } });
    dispatch({
      type: "SET_STEP_COMPLETED",
      payload: { stepId: 7, completed: true },
    });
    dispatch({ type: "SET_CAN_PROCEED", payload: true });

    updateStepData(7, {
      status: "APPROVED",
      completed: true,
      isValid: true,
      canProceed: true,
      paymentId: formData.paymentId,
      approvalDate: new Date().toISOString(),
    });
  };



  const { fees, fetchFees } = useFeeStore()
    
    
      useEffect(() => {
        if (!fees) fetchFees();
      }, [fees, fetchFees]);
  
  const totalLoanAmount = parseInt(apiLoanData?.loanAmount, 10) + Number(fees?.bankTransactionPaperFee);

  // Show pending message if payment is not approved
  if (paymentStatus !== "APPROVED") {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">
            Insurance Fee Payment Pending
          </h3>
          <p className="text-yellow-700 mb-4 text-sm sm:text-base">
            Please complete the insurance fee payment to generate and download
            the SBI Life Receipt.
          </p>
          <div className="bg-white p-3 sm:p-4 rounded-md border border-yellow-200">
            <p className="text-sm sm:text-base text-gray-600">
              <strong>Next Steps:</strong>
            </p>
            <ul className="text-sm sm:text-base text-gray-600 mt-2 space-y-1">
              <li className="flex items-center">
                <span className="mr-2">•</span> Upload payment screenshot
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Wait for admin verification
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Download receipt upon approval
              </li>
            </ul>
          </div>

          {/* File Upload */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mt-4 sm:mt-6">
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

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl mt-4 sm:mt-6 border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Payment to pay
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-4">
              {fees?.insuranceFee}
            </p>
          </div>
          
          {paymentStatus === "PENDING" && !isReadOnly && (
                      
                      <UserQRCodePayment />
                  )}

          
          
          {/* Screenshot Preview */}
          {formData.screenshotUrl && (
            <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
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
                  <CheckCircle className="w-4 sm:w-6 h-4 sm:h-6 text-gray-600" />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
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
                "Submit Payment"
              )}
            </button>
          </div>

          {/* Payment Status */}
          {paymentStatus && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl shadow-lg border">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Payment Status
              </h3>
              {paymentStatus === "PENDING" && (
                <div className="flex items-center bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                  <div className="flex-shrink-0">
                    <div className="h-8 sm:h-12 w-8 sm:w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Clock className="h-4 sm:h-6 w-4 sm:w-6 text-yellow-600 animate-pulse" />
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

  // Render when paymentStatus is APPROVED
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform hover:scale-101 transition-all duration-300">
        {/* Inline styles for PDF content */}
        <style>
          {`
            #sbi-receipt-content {
              font-family: Arial, sans-serif;
              background: white;
              border: 1px solid #e5e7eb;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              max-width: 210mm;
              margin: 0 auto 24px;
              box-sizing: border-box;
            }
            #sbi-receipt-content .bg-blue-700 { background-color: #1e40af; }
            #sbi-receipt-content .text-blue-700 { color: #1e40af; }
            #sbi-receipt-content .bg-orange-400 { background-color: #f97316; }
            #sbi-receipt-content .text-purple-600 { color: #7c3aed; }
            #sbi-receipt-content .text-pink-600 { color: #db2777; }
            #sbi-receipt-content .bg-gradient-to-br { background: linear-gradient(135deg, #00bcd4, #2196f3); }
          `}
        </style>

        {/* Receipt Preview */}
        <div className="mb-6">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            SBI Life Receipt Preview
          </h4>
          <div id="sbi-receipt-content" ref={pdfContentRef} className="p-5">
            {/* Header with SBI Life Logo */}
            <div className="text-center py-5 bg-white">
              <div className="flex items-center justify-center gap-2 mb-1">
                
                <img className="w-28 h-16" src={Logo} alt="" />
              </div>
              <div className="text-sm text-gray-600 italic mt-1">
                Apne liye. Apno ke liye.
              </div>
            </div>

            {/* Black Divider Line */}
            <div className="h-0.5 bg-black mx-0 mb-8"></div>

            {/* Main Message */}
            <div className="px-5 text-center text-base leading-relaxed text-black mb-16">
              Dear {apiLoanData.fullName}, Your a/c no.{" "}
              {apiLoanData.accountNumber} is credited INR {totalLoanAmount} on{" "}
              {formData.date} by a/c {account?.accountNumber} (NEFT Ref. no.{" "}
              {formData.neftRef}). Balance is held with insurance charge, pay
              only {fees?.insuranceFee}. This balance will be refunded after
              completing the transaction.
              <br />
              <br />
              Have a nice day
            </div>

            {/* Stamp and Barcode Section */}
            <div className="flex justify-between items-center px-10 mb-16">
              <div className="w-32 h-32">
                <img src={SignatureMd} alt="" />
              </div>
              <div className="flex-1 text-center ml-10">
                <img src={Barcode} alt="" />
              </div>
            </div>

            {/* LIC Footer Section */}
            <div className="flex justify-center items-center gap-0 mb-8">
              <div className="w-36 h-24 bg-blue-700 flex flex-col items-center justify-center text-white rounded">
                <div className="w-10 h-7 border-2 border-white rounded-t-full mb-1 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="text-xs text-center leading-tight font-bold">
                  नियामक एवं विकास
                  <br />
                  प्राधिकरण
                </div>
              </div>
              <div className="w-36 h-24 bg-orange-400 flex items-center justify-center text-blue-700 text-5xl font-bold rounded">
                LIC
              </div>
            </div>

            {/* Company Information */}
            <div className="text-center pb-5">
              <div className="text-blue-700 text-xl font-bold mb-2">
                भारतीय जीवन बीमा निगम
              </div>
              <div className="text-blue-700 text-base font-bold tracking-widest">
                LIFE INSURANCE CORPORATION OF INDIA
              </div>
            </div>
          </div>
        </div>

        {/* Main UI */}
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
            <CheckCircle className="w-14 sm:w-16 h-14 sm:h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
              Insurance Fee Payment Approved
            </h3>
            <p className="text-green-700 text-sm sm:text-base">
              Your insurance fee payment has been successfully verified.
              Download the SBI Life Receipt below.
            </p>
          </div>

          {/* Receipt Details Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Edit Receipt Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Customer Name", key: "customerName" },
                { label: "Account Number", key: "accountNumber" },
                { label: "Amount", key: "amount" },
                { label: "Date", key: "date" },
                { label: "From Account", key: "fromAccount" },
                { label: "NEFT Reference", key: "neftRef" },
                { label: "Hold Amount", key: "holdAmount" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={formData[key as keyof FormData] as string}
                    onChange={(e) =>
                      handleInputChange(key as keyof FormData, e.target.value)
                    }
                    disabled={isReadOnly}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      isReadOnly
                        ? "bg-gray-100 cursor-not-allowed border-gray-300"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={downloadPDF}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Download SBI Life Receipt
            </button>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Keep this receipt for your records
            </p>
          </div>

          {/* Payment Status */}
          <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl shadow-lg border">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Payment Status
            </h3>
            <div className="flex items-center bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
              <div className="flex-shrink-0">
                <div className="h-8 sm:h-12 w-8 sm:w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 sm:h-6 w-4 sm:w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-2 sm:ml-4">
                <h4 className="text-base sm:text-lg font-medium text-green-800">
                  Approved
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  Your payment has been successfully verified! Download your
                  receipt above.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 shadow-md">
            <h4 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              Next Steps
            </h4>
            <ul className="text-blue-700 space-y-2 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">
                  1
                </span>
                <span>Download and save the SBI Life Receipt</span>
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
      </div>
    </div>
  );
}
