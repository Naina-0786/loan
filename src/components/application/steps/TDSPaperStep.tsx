import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getLoanApplication,
  uploadPaymentScreenshot,
} from "../../../api/loanApplicationApi";
import html2pdf from "html2pdf.js";
// import Signature from "../../assets/gst/IMG-20250324-WA0036.jpg";
// import TdsLogo from "../../assets/Tds/Tds images.png";

import Signature from "../../../assets/assets/Tds/signature.jpeg";
import TdsLogo from "../../../assets/assets/Tds/Logo.jpeg";
import Mohar from "../../../assets/assets/Tds/mohar.jpeg";
import Satemejate from "../../../assets/assets/Tds/satemejate.jpeg"
import UserQRCodePayment from "../../document/test/payment";
import { useFeeStore } from "../../../hooks/fee";

interface FormData {
  screenshotFile: File | null;
  paymentId: string;
  screenshotUrl: string | null;
}

interface TdsFormData {
  billTo: string;
  invoiceNumber: string;
  date: string;
  amount: string;
  taxRate: string;
  taxAmount: string;
  description: string;
}

export default function TdsFeeStep() {
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
  const [tdsFormData, setTdsFormData] = useState<TdsFormData | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

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
        setApiLoanData(application);
        const newStatus = application.tdsStatus || null;
        setPaymentStatus(newStatus);

        const hasTdsFee = application.tdsFee?.public_id;
        setIsReadOnly(hasTdsFee && newStatus !== "REJECTED");
        console.log(
          "isReadOnly set to:",
          hasTdsFee && newStatus !== "REJECTED"
        );

        if (hasTdsFee && application.tdsFee) {
          setFormData({
            screenshotFile: null,
            paymentId: application.tdsFee.paymentId || "",
            screenshotUrl: application.tdsFee.url || null,
          });
        }

        // Populate TDS form data if APPROVED
        if (newStatus === "APPROVED") {
          const event = new CustomEvent("tdsFeeSubmitted", {
            detail: { isValid: true, stepId: 9 },
          });
          window.dispatchEvent(event);
          console.log("Dispatched tdsFeeSubmitted event:", {
            isValid: true,
            stepId: 9,
          });

          const amount = "300"; // Fixed TDS fee amount
          const taxRate = "1"; // Fixed tax rate as per Tds component
          const taxAmount = (
            (parseFloat(amount) * parseFloat(taxRate)) /
            100
          ).toFixed(2);
          setTdsFormData({
            billTo: application.fullName || "Unknown Applicant",
            invoiceNumber: `TDS_INV_${application.id}_${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            amount,
            taxRate,
            taxAmount,
            description: "TDS Fee Payment for Loan Application Processing",
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
        const newStatus = application.tdsStatus || "PENDING";
        setPaymentStatus(newStatus);

        if (newStatus === "APPROVED") {
          const event = new CustomEvent("tdsFeeSubmitted", {
            detail: { isValid: true, stepId: 9 },
          });
          window.dispatchEvent(event);
          console.log("Dispatched tdsFeeSubmitted event:", {
            isValid: true,
            stepId: 9,
          });
          toast.success("Payment verified! You can proceed to the next step.");

          const amount = "300";
          const taxRate = "1";
          const taxAmount = (
            (parseFloat(amount) * parseFloat(taxRate)) /
            100
          ).toFixed(2);
          setTdsFormData({
            billTo: application.fullName || "Unknown Applicant",
            invoiceNumber: `TDS_INV_${application.id}_${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            amount,
            taxRate,
            taxAmount,
            description: "TDS Fee Payment for Loan Application Processing",
          });
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
        "tdsFee",
        formData.screenshotFile,
        {
          paymentMethod: "default",
          paymentId: formData.paymentId || `PAY_${Date.now()}`,
          amount: 300,
        }
      );

      setIsReadOnly(true);
      setPaymentStatus("PENDING");
      toast.success(
        "Payment screenshot uploaded successfully! Waiting for admin verification."
      );
      console.log("Payment details submitted:", formData);

      const event = new CustomEvent("tdsFeeSubmitted", {
        detail: { isValid: false, stepId: 9 },
      });
      window.dispatchEvent(event);
      console.log("Dispatched tdsFeeSubmitted event:", {
        isValid: false,
        stepId: 9,
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

  // Handle PDF download
  const handlePrint = () => {
    if (printRef.current && tdsFormData) {
      const element = printRef.current;
      const opt = {
        margin: [1, 1, 1, 1] as [number, number, number, number],
        filename: `TDS_Invoice_${tdsFormData.invoiceNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 1, useCORS: true, width: 680 },
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

  const { fees, fetchFees } = useFeeStore()
        
        
          useEffect(() => {
            if (!fees) fetchFees();
          }, [fees, fetchFees]);
    

  const totalLoanAmount = parseInt(apiLoanData?.loanAmount, 10) + Number(fees?.bankTransactionPaperFee) + Number(fees?.cibilFee) + Number(fees?.tdsFee) - 99;
  
  // Non-APPROVED state UI
  if (paymentStatus !== "APPROVED") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            TDS Fee Payment
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed">
            This fee covers the Tax Deducted at Source (TDS) processing for your
            loan application. It includes tax compliance verification.
          </p>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 border border-gray-200 shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Payment Details
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-4">
              Amount to Pay: ₹{fees?.tdsFee}
            </p>
          </div>

          {paymentStatus === "PENDING" && !isReadOnly && (

            <UserQRCodePayment />
          )}


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
                "Submit Payment"
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
              {/* Removed unreachable paymentStatus === "APPROVED" block to fix type error */}
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

  // APPROVED state UI with TDS PDF preview
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform hover:scale-[1.01] transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          TDS Fee Payment
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed">
          Your TDS fee payment has been successfully verified. Download the TDS
          document below.
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
            TDS Fee Payment Approved
          </h3>
          <p className="text-green-700 text-sm sm:text-base">
            Your TDS fee payment has been successfully verified. Download the
            TDS document below.
          </p>
        </div>

        {tdsFormData && (
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
                TDS Document Preview
              </h4>
              <div
                ref={printRef}
                className="sm:max-w-[640px] mx-auto bg-white p-4 sm:p-5 border shadow-lg relative font-sans print-card"
              >
                <div className="tds-stamp">TDS</div>
                <div className="content">
                  <div className="header">
                    <img
                      src={TdsLogo}
                      alt="TDS Logo"
                      className="w-[100px] mb-[10px] mx-auto"
                    />
                    <p className="text-[12px] text-[#333] text-center mb-0">
                      Address: Second floor Victoria Building dhani finance Uttam Nagar Delhi ,110013
                    </p>
                    <h3 className="text-[#F89406] text-[24px] font-extrabold uppercase my-[5px] text-center">
                      Tax Deduction At Source
                    </h3>
                    <h4 className="text-[18px] font-bold my-[5px] text-center">
                      INVOICE
                    </h4>
                  </div>

                  <div className="invoice-header">
                    <div>
                      <p className="font-bold mb-[8px]">
                        Bill To:{" "}
                        <span className="font-normal">
                          {tdsFormData.billTo}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold mb-[8px]">
                        Invoice No.:{" "}
                        <span className="font-normal">
                          {tdsFormData.invoiceNumber}
                        </span>
                      </p>
                      <p className="font-bold mb-[8px]">
                        Date:{" "}
                        <span className="font-normal">{tdsFormData.date}</span>
                      </p>
                    </div>
                  </div>

                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>#</th>
                          <th style={{ width: "120px" }}>Item name</th>
                          <th style={{ width: "60px" }}>Quantity</th>
                          <th style={{ width: "120px" }}>Total amount</th>
                          <th style={{ width: "120px" }}>TDS TAX</th>
                          <th style={{ width: "150px" }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Tax Deduction Tax</td>
                          <td>1</td>
                          <td className="text-right word-break break-all">
                            ₹
                            {totalLoanAmount}
                          </td>
                          <td className="word-break break-all">
                            ₹
                            {parseFloat(tdsFormData.taxAmount).toLocaleString(
                              "en-IN"
                            )}{" "}
                            ({tdsFormData.taxRate}%)
                          </td>
                          <td className="text-right word-break break-all">
                            ₹
                            {totalLoanAmount}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold" colSpan={2}>
                            TOTAL
                          </td>
                          <td>1</td>
                          <td className="text-right word-break break-all">
                            ₹
                            {totalLoanAmount}
                          </td>
                          <td className="word-break break-all">
                            ₹
                            {parseFloat(tdsFormData.taxAmount).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td className="text-right word-break break-all">
                            ₹
                            {(
                              parseFloat(tdsFormData.amount) +
                              parseFloat(tdsFormData.taxAmount)
                            ).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="tax-breakdown">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: "90px" }}>Tax Type</th>
                          <th style={{ width: "120px" }}>Taxable amount</th>
                          <th style={{ width: "60px" }}>Rate</th>
                          <th style={{ width: "90px" }}>Tax amount</th>
                          <th style={{ width: "120px" }}>Sub Total</th>
                          <th style={{ width: "120px" }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Tax Deduction At Source</td>
                          <td className="text-right word-break break-all">
                            ₹
                            {parseFloat(tdsFormData.amount).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td>{tdsFormData.taxRate}%</td>
                          <td className="text-right word-break break-all">
                            ₹
                            {parseFloat(tdsFormData.taxAmount).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td className="text-right word-break break-all">
                            ₹
                            {(
                              parseFloat(tdsFormData.amount) +
                              parseFloat(tdsFormData.taxAmount)
                            ).toLocaleString("en-IN")}
                          </td>
                          <td className="text-right word-break break-all">
                            ₹
                            {totalLoanAmount}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="amount-in-words">
                    <p className="font-bold">Invoice Amount In Words:</p>
                    <p className="text-lg break-words">
                      ₹
                      {(
                        parseFloat(tdsFormData.amount) +
                        parseFloat(tdsFormData.taxAmount)
                      ).toLocaleString("en-IN")}{" "}
                      Rupees Only
                    </p>
                  </div>

                  <div className="description">
                    <p className="font-bold">Description:</p>
                    <p>
                      Just You Need To Pay Tax Deduction at Source INR{" "}
                      {parseFloat(tdsFormData.taxAmount).toLocaleString(
                        "en-IN"
                      )}
                      /- Refundable Money Only
                    </p>
                    <p>
                      2 min Through NEFT/RTGS/Online Banking/UPI in Following
                      Bank Accounts
                    </p>
                    <p className="font-bold mt-2">Terms and Conditions:</p>
                    <p>Thank you for Choosing Tax Deduction At Source.</p>
                  </div>

                  <div className="footer">
                    <p>Tax Deduction At Source</p>
                    <div className="w-full flex justify-center">
                      <img className="h-20 w-20" src={Satemejate} alt="" />
                    </div>
                    <div className="signature-container">
                      <img
                        className="signature"
                        src={Signature}
                        alt="Signature"
                      />
                      <div></div>
                      <img className="h-20 w-20" src={Mohar} alt="" />
                    </div>
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
                Download TDS Document
              </button>
            </div>
          </>
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

        <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Payment Status
          </h3>
          <div className="flex items-center bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
            <div className="flex-shrink-0">
              <div className="h-8 sm:h-12 w-8 sm:w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-4 sm:h-6 w-4 sm:w-6 text-green-600"
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
            <div className="ml-2 sm:ml-4">
              <h4 className="text-base sm:text-lg font-medium text-green-800">
                Approved
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Your payment has been successfully verified! Download your TDS
                document above.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 shadow-md">
          <h4 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3">
            Next Steps
          </h4>
          <ul className="text-blue-700 space-y-2 text-sm sm:text-base">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">
                1
              </span>
              <span>Download and save the TDS document</span>
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
          border: 2px solid #d4af37;
          padding: 20px;
          border-radius: 10px;
          max-width: 640px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }
        .dark .print-card {
          background: #1f2937;
        }
        .tds-stamp {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          color: #0000ff;
          font-size: 72px;
          font-weight: bold;
          opacity: 0.2;
          z-index: 1;
        }
        .content {
          position: relative;
          z-index: 2;
        }
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 16px;
        }
        .header img {
          width: 100px;
          margin-bottom: 10px;
        }
        .header p {
          font-size: 12px;
          color: #333;
          margin: 0;
          text-align: center;
          word-wrap: break-word;
        }
        .header h3 {
          color: #F89406;
          font-size: 24px;
          font-weight: 800;
          text-transform: uppercase;
          margin: 5px 0;
          text-align: center;
        }
        .header h4 {
          font-size: 18px;
          font-weight: bold;
          margin: 5px 0;
          text-align: center;
        }
        .invoice-header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 16px;
          border-bottom: 1px solid #000;
          padding-bottom: 8px;
          font-size: 14px;
        }
        .invoice-header p {
          margin: 0;
          margin-bottom: 8px;
          word-wrap: break-word;
        }
        .invoice-header .font-bold {
          font-weight: bold;
        }
        .invoice-header .font-normal {
          font-weight: normal;
        }
        .invoice-header .text-right {
          text-align: right;
        }
        .table-container {
          width: 100%;
          margin-bottom: 16px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: center;
          font-size: 14px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .table-container thead tr {
          background-color: #3B82F6;
          color: white;
        }
        .tax-breakdown {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .tax-breakdown thead tr {
          background-color: #22C55E;
          color: white;
        }
        .amount-in-words {
          margin-bottom: 16px;
        }
        .amount-in-words p {
          margin: 0;
          word-wrap: break-word;
        }
        .amount-in-words .font-bold {
          font-weight: bold;
          font-size: 14px;
        }
        .amount-in-words .text-lg {
          font-size: 18px;
          word-wrap: break-word;
        }
        .description {
          margin-bottom: 16px;
          font-size: 14px;
        }
        .description p {
          margin: 0;
          word-wrap: break-word;
        }
        .description .font-bold {
          font-weight: bold;
        }
        .footer {
          margin-top: 24px;
          text-align: center;
        }
        .footer p {
          font-size: 14px;
          margin: 0;
          word-wrap: break-word;
        }
        .footer .font-bold {
          font-weight: bold;
        }
        .footer .signature-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 16px;
          align-items: center;
        }
        .footer .signature-container img.signature {
          width: 100px;
          height: auto;
        }
        @media screen and (max-width: 640px) {
          .print-card {
            padding: 15px;
          }
          .header {
            flex-direction: column;
            text-align: center;
          }
          .header h3 {
            font-size: 18px;
            margin-top: 8px;
          }
          .header h4 {
            font-size: 14px;
          }
          .invoice-header {
            flex-direction: column;
            text-align: left;
          }
          .invoice-header .text-right {
            text-align: left;
          }
          .invoice-header p {
            font-size: 12px;
          }
          th, td {
            font-size: 12px;
            padding: 4px;
          }
          .tax-breakdown {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .amount-in-words .font-bold {
            font-size: 12px;
          }
          .amount-in-words .text-lg {
            font-size: 14px;
          }
          .description {
            font-size: 12px;
          }
          .footer p {
            font-size: 12px;
          }
          .footer .signature-container {
            flex-direction: row;
            justify-content: space-between;
          }
          .footer .signature-container img.signature {
            width: 80px;
          }
        }
      `}</style>
    </div>
  );
}
