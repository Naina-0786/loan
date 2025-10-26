import { useEffect, useState, useRef } from "react";
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

import Mohar from "../../../assets/assets/mohar/approval-mohar.jpeg"
import Mohar2 from "../../../assets/assets/mohar/loanApproval.jpeg"
import Signature from "../../../assets/assets/Tds/signature.jpeg"
 

interface FormData {
  screenshotFile: File | null;
  screenshotUrl: string | null;
  paymentId: string;
}

export default function BankTransactionPaperFeeStep() {
  const { updateStepData, state, dispatch } = useStepper();
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
  const [apiLoanData, setApiLoanData] = useState<any>(null);
  const hasFetched = useRef(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

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
    if (hasFetched.current) {
      console.log("API already called, skipping...");
      return;
    }

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
        const newStatus = application.bankTransactionStatus || "PENDING";
        setPaymentStatus(newStatus);
        setApiLoanData(application);

        const hasBankTransactionFee =
          application.bankTransactionPaperFee?.public_id;
        setIsReadOnly(hasBankTransactionFee && newStatus !== "REJECTED");

        if (hasBankTransactionFee && application.bankTransactionPaperFee) {
          setFormData({
            screenshotFile: null,
            paymentId: application.bankTransactionPaperFee.paymentId || "",
            screenshotUrl: application.bankTransactionPaperFee.url || null,
          });
        }
        dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 7, isValid: newStatus === "APPROVED" } });
        if (newStatus === "APPROVED") {
          updateStepData(7, {
            status: "APPROVED",
            approvalDate: new Date().toISOString(),
          });
        } else if (newStatus === "REJECTED") {
          toast.error(
            "Payment verification failed. Please upload a valid screenshot."
          );
        }
      } catch (error: unknown) {
        console.error("Failed to load payment status:", error);
        toast.error(
          (error as any)?.response?.data?.message ||
          "Failed to load payment status"
        );
      } finally {
        setIsLoading(false);
        hasFetched.current = true;
      }
    };

    loadExistingData();

  }, [dispatch]);

  const { fees, fetchFees } = useFeeStore()


  useEffect(() => {
    if (!fees) fetchFees();
  }, [fees, fetchFees]);

  // Poll payment status when PENDING
  useEffect(() => {
    if (paymentStatus !== "PENDING") return;

    const checkPaymentStatus = async () => {
      try {
        const applicationId = localStorage.getItem("loanApplicationId");
        if (!applicationId) return false;

        const application = await getLoanApplication(parseInt(applicationId));
        const newStatus = application.bankTransactionStatus || "PENDING";
        setPaymentStatus(newStatus);
        dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 7, isValid: newStatus === "APPROVED" } });

        if (newStatus === "APPROVED") {
          toast.success("Payment verified! You can proceed to the next step.");
          updateStepData(7, {
            status: "APPROVED",
            approvalDate: new Date().toISOString(),
          });
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
  }, [paymentStatus, dispatch]);

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
        "bankTransactionPaperFee",
        formData.screenshotFile,
        {
          paymentMethod: "default",
          paymentId: formData.paymentId || `PAY_${Date.now()}`,
          amount: 1000,
        }
      );

      setIsReadOnly(true);
      setPaymentStatus("PENDING");
      dispatch({ type: 'SET_STEP_VALID', payload: { stepId: 7, isValid: false } });
      toast.success(
        "Payment screenshot uploaded successfully! Waiting for admin verification."
      );
      console.log("Payment details submitted:", formData);
    } catch (error: unknown) {
      console.error("Failed to upload payment screenshot:", error);
      toast.error(
        (error as any)?.response?.data?.message ||
        "Failed to upload payment screenshot"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  // Format date for PDF
  const formatDateForPDF = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
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
      filename: `CTS_Document_${formData.paymentId || Date.now()}.pdf`,
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

  // CTS document data
  const ctsData = {
    applicantName: apiLoanData?.fullName || "Komal Kumar",
    aadharNumber: apiLoanData?.aadharNumber || "222316948849",
    accountNumber: apiLoanData?.accountNumber || "55555555555",
    loanAmount: Number(apiLoanData?.loanAmount),
    ctsFee: Number(fees?.bankTransactionPaperFee),
    approvalDate:
      state.steps.find((step) => step.id === 7)?.data?.approvalDate ||
      new Date().toISOString(),
  };

  // Non-APPROVED state UI
  if (paymentStatus !== "APPROVED") {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">
            Bank Transaction Paper Fee Payment Pending
          </h3>
          <p className="text-yellow-700 mb-4 text-sm sm:text-base">
            Please complete the CTS fee payment to generate and download the
            Cheque Truncation System document.
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
                <span className="mr-2">•</span> Download CTS document upon
                approval
              </li>
            </ul>
          </div>

          {/* Payment Details */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl mt-4 sm:mt-6 border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Amount To Pay
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-4">
              {fees?.bankTransactionPaperFee}
            </p>
          </div>

          {paymentStatus === "PENDING" && !isReadOnly && (

            <UserQRCodePayment />
          )}

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
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isReadOnly
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
              className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isLoading || isReadOnly || !formData.screenshotFile
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

  // APPROVED state UI with CTS document preview
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform hover:scale-101 transition-all duration-300">
        {/* Inline styles for PDF content */}
        <style>
          {`
            #cts-content {
              font-family: Arial, sans-serif;
              background: white;
              border: 2px solid #000;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              max-width: 210mm;
              margin: 0 auto 24px;
              box-sizing: border-box;
            }
            #cts-content .bg-red-600 { background-color: #e53e3e; }
            #cts-content .text-red-600 { color: #e53e3e; }
            #cts-content .bg-gray-800 { background-color: #2d3748; }
            #cts-content .text-green-600 { color: #48bb78; }
            #cts-content .border-green-600 { border-color: #48bb78; }
            #cts-content .bg-green-600 { background-color: #48bb78; }
            #cts-content .bg-gradient-to-br { background: linear-gradient(135deg, #48bb78, #38a169); }
            #cts-content .text-white { color: #ffffff; }
          `}
        </style>

        {/* CTS Document Preview */}
        <div className="mb-6">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            CTS Document Preview
          </h4>
          <div id="cts-content" ref={pdfContentRef} className="p-5">
            {/* Header Section */}
            <div className="bg-red-600 text-white p-2 text-center">
              <div className="text-2xl font-bold tracking-wider">CTS</div>
            </div>
            <div className="bg-gray-800 p-3 text-center relative">
              <div className="text-red-600 text-lg font-bold tracking-wider">
                CHEQUE
              </div>
              <div className="text-red-600 text-lg font-bold tracking-wider mt-1">
                TRUNCATION SYSTEM
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 font-bold italic text-sm">
                SuccessCTS
              </div>
            </div>

            {/* Address */}
            <div className="text-center p-4 text-sm font-bold border-b border-black">
              Second floor Victoria Building dhani finance Uttam Nagar Delhi ,110013
            </div>

            {/* Date */}
            <div className="text-right p-4 pb-2 text-sm font-bold">
              Date: {formatDateForPDF(ctsData.approvalDate)} at
              <br />
              11:16:13 AM
            </div>

            {/* Main Content */}
            <div className="p-5 relative min-h-[600px]">
              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] text-[120px] text-gray-300 font-bold z-0 pointer-events-none">
                RBI
              </div>

              {/* Fully Insured Stamp */}
              <div className="absolute top-5 right-5">
                <img className="w-28 h-20" src={Mohar2} alt="" />
              </div>

              <div className="relative z-10 text-sm leading-relaxed">
                <div className="mb-5">
                  <strong>To,</strong>
                </div>
                <div className="mb-4 space-y-2">
                  <div>
                    <strong>{ctsData.applicantName}</strong>
                  </div>

                  <div>
                    <strong>Aadhar No. {ctsData.aadharNumber}</strong>
                  </div>
                  <div>
                    <strong>Bank Account No. {ctsData.accountNumber}</strong>
                  </div>
                </div>
                <div className="my-5 font-bold">
                  <strong>
                    Subject: For transferring Amount of{" "}
                    {formatCurrency(ctsData.loanAmount + Number(fees?.bankTransactionPaperFee) - 99)}/- along with submitted
                    fee Bank Transction of {formatCurrency(ctsData.ctsFee)}/-
                  </strong>
                </div>
                <div className="my-5 font-bold">
                  <strong>Dear Sir/Madam,</strong>
                </div>
                <div className="my-5 text-justify">
                  As per your application, your loan amount of{" "}
                  {formatCurrency(ctsData.loanAmount + Number(fees?.bankTransactionPaperFee))} and submitted amount of{" "}
                  {formatCurrency(ctsData.ctsFee)} (total transferable amount is{" "}
                  {formatCurrency(ctsData.loanAmount + ctsData.ctsFee)}/-) has
                  been sanctioned. Your loan amount will be transferred to the
                  provided bank account no. {ctsData.accountNumber}. The
                  transfer will be processed from our Mumbai Branch through All
                  Finance to your account. Due to regulations for fund transfers
                  across states, you have submitted a CTS charge of{" "}
                  {formatCurrency(ctsData.ctsFee)}/-.
                </div>
                <div className="my-5 text-justify">
                  The CTS late fine charge amount is refundable within 30
                  minutes after verification. Kindly ensure all required
                  payments and documents are submitted to release your loan
                  amount.
                </div>
                <div className="my-8">
                  <div className="font-bold underline mb-2">Cc to:</div>
                  <ul className="list-disc ml-8 space-y-2">
                    <li>MD, Dhani finance pvt. ltd</li>
                    <li>Accountant, dhani finance</li>
                  </ul>
                </div>
              </div>

              {/* Footer Section */}
              <div className="flex justify-between items-end mt-12 pt-5">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20">
                      <img src={Mohar} alt="" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800">
                        Smart Business Solutions
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-600 text-white p-2 text-center mt-2 font-bold text-xs">
                    TAXES & ACCOUNTING
                    <br />
                    SERVICES
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-2 font-bold">Thanks & Regards</div>
                 <img className="w-28 h-20 ml-5"  src={Signature} alt="" />
                  <div className="text-xs mb-2">Reserve Bank of India</div>
                  <div className="w-24 h-0.5 bg-black mx-auto mb-1"></div>
                  <div className="text-xs">
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main UI */}
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
            <CheckCircle className="w-14 sm:w-16 h-14 sm:h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
              CTS Fee Payment Approved
            </h3>
            <p className="text-green-700 text-sm sm:text-base">
              Your CTS fee payment has been successfully verified. Download the
              Cheque Truncation System document below.
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Payment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm sm:text-base font-medium text-gray-600">
                  Payment ID
                </label>
                <p className="text-lg sm:text-xl font-mono text-gray-800">
                  {formData.paymentId || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm sm:text-base font-medium text-gray-600">
                  Status
                </label>
                <div className="flex items-center space-x-2">
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm sm:text-base font-medium">
                    Approved
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot Preview */}
          {formData.screenshotUrl && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
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
                  <CheckCircle className="w-4 sm:w-6 h-4 sm:h-6 text-gray-600" />
                </div>
              </div>
            </div>
          )}

          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={downloadPDF}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Download CTS Document
            </button>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Keep this document for your records
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
                  Your payment has been successfully verified! Download your CTS
                  document above.
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
                <span>Download and save the CTS document</span>
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