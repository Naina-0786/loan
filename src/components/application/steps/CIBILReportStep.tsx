import { AlertCircle, CheckCircle, FileText, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getLoanApplication,
  uploadPaymentScreenshot,
} from "../../../api/loanApplicationApi";
import html2pdf from "html2pdf.js";
import GstMohar from "../../../assets/assets/gst/IMG-20250324-WA0030.jpg";
import Signature from "../../../assets/assets/gst/signature.jpeg";
import UserQRCodePayment from "../../document/test/payment";
import Satemejate from "../../../assets/assets/gst/satemejate.jpeg"
import mohar from "../../../assets/assets/gst/mohar.jpeg"

import { useFeeStore } from "../../../hooks/fee";

interface FormData {
  screenshotFile: File | null;
  screenshotUrl: string | null;
  paymentId: string;
}

interface GstFormData {
  billTo: string;
  companyName: string;
  gstNumber: string;
  invoiceNumber: string;
  date: string;
  eWayBillNumber: string;
  amount: string;
  taxType: string;
  taxRate: string;
  taxAmount: string;
  description: string;
}

export default function CibilFeeStep() {
  const [paymentStatus, setPaymentStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    screenshotFile: null,
    screenshotUrl: null,
    paymentId: "",
  });
  const [apiLoanData, setApiLoanData] = useState<any>(null);
  const [gstFormData, setGstFormData] = useState<GstFormData | null>(null);
  const hasFetched = useRef(false);
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
        const newStatus = application.cibilStatus || null;
        setPaymentStatus(newStatus);
        setApiLoanData(application);

        const hasCibilFee = application.cibilFee?.public_id;
        setIsReadOnly(hasCibilFee && newStatus !== "REJECTED");
        console.log(
          "isReadOnly set to:",
          hasCibilFee && newStatus !== "REJECTED"
        );

        if (hasCibilFee && application.cibilFee) {
          setFormData({
            screenshotFile: null,
            paymentId: application.cibilFee.paymentId || "",
            screenshotUrl: application.cibilFee.url || null,
          });
        }

        // Populate GST form data if APPROVED
        if (newStatus === "APPROVED") {
          const event = new CustomEvent("cibilFeeSubmitted", {
            detail: { isValid: true, stepId: 8 },
          });
          window.dispatchEvent(event);
          console.log("Dispatched cibilFeeSubmitted event:", {
            isValid: true,
            stepId: 8,
          });

          const amount = "500"; // Fixed CIBIL fee amount
          const taxRate = "4"; // Fixed tax rate as per Gst component
          const taxAmount = (
            (parseFloat(amount) * parseFloat(taxRate)) /
            100
          ).toFixed(2);
          setGstFormData({
            billTo: application.fullName || "Unknown Applicant",
            companyName: "Dhani finance Pvt. Ltd.",
            gstNumber: "GSTIN1234567890", // Hardcoded or fetch from backend if available
            invoiceNumber: `INV_${application.id}_${Date.now()}`,
            date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD
            eWayBillNumber: `EWB_${application.id}_${Date.now()}`,
            amount,
            taxType: "SGST/CGST",
            taxRate,
            taxAmount,
            description: "CIBIL Fee Payment for Loan Application Processing",
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

    return () => {
      hasFetched.current = false;
    };
  }, []);

  // Poll payment status when PENDING
  useEffect(() => {
    if (paymentStatus !== "PENDING") return;

    const checkPaymentStatus = async () => {
      try {
        const applicationId = localStorage.getItem("loanApplicationId");
        if (!applicationId) return false;

        const application = await getLoanApplication(parseInt(applicationId));
        const newStatus = application.cibilStatus || "PENDING";
        setPaymentStatus(newStatus);

        if (newStatus === "APPROVED") {
          const event = new CustomEvent("cibilFeeSubmitted", {
            detail: { isValid: true, stepId: 8 },
          });
          window.dispatchEvent(event);
          console.log("Dispatched cibilFeeSubmitted event:", {
            isValid: true,
            stepId: 8,
          });
          toast.success("Payment verified! You can proceed to the next step.");

          const amount = "500";
          const taxRate = "4";
          const taxAmount = (
            (parseFloat(amount) * parseFloat(taxRate)) /
            100
          ).toFixed(2);
          setGstFormData({
            billTo: application.fullName || "Unknown Applicant",
            companyName: "Smart Business Solutions",
            gstNumber: "GSTIN1234567890",
            invoiceNumber: `INV_${application.id}_${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            eWayBillNumber: `EWB_${application.id}_${Date.now()}`,
            amount,
            taxType: "SGST/CGST",
            taxRate,
            taxAmount,
            description: "CIBIL Fee Payment for Loan Application Processing",
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
        "cibilFee",
        formData.screenshotFile,
        {
          paymentMethod: "default",
          paymentId: formData.paymentId || `PAY_${Date.now()}`,
          amount: 500,
        }
      );

      setIsReadOnly(true);
      setPaymentStatus("PENDING");
      toast.success(
        "Payment screenshot uploaded successfully! Waiting for admin verification."
      );
      console.log("Payment details submitted:", formData);

      const event = new CustomEvent("cibilFeeSubmitted", {
        detail: { isValid: false, stepId: 8 },
      });
      window.dispatchEvent(event);
      console.log("Dispatched cibilFeeSubmitted event:", {
        isValid: false,
        stepId: 8,
      });
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

  // Handle PDF download
  const handlePrint = () => {
    if (printRef.current && gstFormData) {
      const element = printRef.current;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `GST_Invoice_${gstFormData.invoiceNumber}.pdf`,
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


  const { fees, fetchFees } = useFeeStore()
      
      
        useEffect(() => {
          if (!fees) fetchFees();
        }, [fees, fetchFees]);
  
  const totalLoanAmount = parseInt(apiLoanData?.loanAmount, 10) + Number(fees?.bankTransactionPaperFee) + Number(fees?.cibilFee) -99;

  // Non-APPROVED state UI
  if (paymentStatus !== "APPROVED") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            CIBIL Fee Payment
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed">
            This fee covers the CIBIL report processing for your loan
            application. It includes credit score verification and report
            generation.
          </p>

          {paymentStatus && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center shadow-md mb-4 sm:mb-6">
              <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">
                CIBIL Fee Payment{" "}
                {paymentStatus === "PENDING" ? "Pending" : "Rejected"}
              </h3>
              <p className="text-yellow-700 mb-4 text-sm sm:text-base">
                {paymentStatus === "PENDING"
                  ? "Your payment is under review. Please wait for verification."
                  : "Payment verification failed. Please upload a valid screenshot."}
              </p>
              <div className="bg-white p-3 sm:p-4 rounded-md border border-yellow-200">
                <p className="text-sm sm:text-base text-gray-600">
                  <strong>Next Steps:</strong>
                </p>
                <ul className="text-sm sm:text-base text-gray-600 mt-2 space-y-1">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    {paymentStatus === "PENDING"
                      ? "Wait for admin verification"
                      : "Upload a new payment screenshot"}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span> Download GST document upon
                    approval
                  </li>
                </ul>
              </div>
            </div>
          )}

          {!isReadOnly && (
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                {paymentStatus === null
                  ? "Submit CIBIL Fee Payment"
                  : "Resubmit CIBIL Fee Payment"}
              </h3>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Upload Payment Screenshot *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border-gray-300 hover:border-blue-500"
              />
              {!formData.screenshotFile && (
                <p className="text-red-500 text-sm mt-1 sm:mt-2">
                  Please upload a screenshot to proceed.
                </p>
              )}
              <div className="mt-4 sm:mt-6 flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.screenshotFile}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isLoading || !formData.screenshotFile
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
                  ) : (
                    "Submit Payment"
                  )}
                </button>
              </div>
            </div>
          )}

          {paymentStatus === "PENDING" && !isReadOnly && (
                      
                      <UserQRCodePayment />
          )}
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl mt-4 sm:mt-6 border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Payment to pay
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-4">
              {fees?.cibilFee}
            </p>
          </div>
          

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
                  <CheckCircle className="w-4 sm:w-6 h-4 sm:h-6 text-gray-600" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // APPROVED state UI with GST PDF preview
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 transform hover:scale-[1.01] transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          CIBIL Fee Payment
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 text-center leading-relaxed">
          Your CIBIL fee payment has been successfully verified. Download the
          GST document below.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center shadow-md mb-4 sm:mb-6">
          <CheckCircle className="w-14 sm:w-16 h-14 sm:h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
            CIBIL Fee Payment Approved
          </h3>
          <p className="text-green-700 text-sm sm:text-base">
            Your CIBIL fee payment has been successfully verified. Download the
            GST document below.
          </p>
        </div>

        {gstFormData && (
          <>
            <div className="mb-6 bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                GST Document Preview
              </h4>
              <div
                ref={printRef}
                className="bg-white p-6 shadow-lg relative font-sans print-card"
              >
                <div className="header">
                  <div className="flex justify-center items-center w-full">
                    <h1 className="text-2xl font-extrabold text-[#F89406] uppercase">
                      Goods and Services Tax Council
                    </h1>
                  </div>
                </div>

                <div className="invoice-header">
                  <div>
                    <p className="font-bold">
                      Bill To:{" "}
                      <span className="font-normal">{gstFormData.billTo}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      Invoice No.:{" "}
                      <span className="font-normal">
                        {gstFormData.invoiceNumber}
                      </span>
                    </p>
                    <p className="font-bold">
                      Date:{" "}
                      <span className="font-normal">{gstFormData.date}</span>
                    </p>
                    <p className="font-bold">
                      E-Way Bill number:{" "}
                      <span className="font-normal">
                        {gstFormData.eWayBillNumber}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th className="w-[5%]">#</th>
                        <th className="w-[20%]">Item name</th>
                        <th className="w-[15%]">Total amount</th>
                        <th className="w-[15%]">GST</th>
                        <th className="w-[20%]">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Goods & Service Tax</td>
                        <td className="text-right word-break break-all">
                          ₹
                          {totalLoanAmount}
                        </td>
                        <td className="word-break break-all">
                          {gstFormData.taxRate}% (₹
                          {parseFloat(gstFormData.taxAmount).toLocaleString(
                            "en-IN"
                          )}
                          )
                        </td>
                        <td className="text-right word-break break-all">
                          ₹
                          {totalLoanAmount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="tax-breakdown">
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th className="w-[25%]">Tax type</th>
                          <th className="w-[25%]">Taxable amount</th>
                          <th className="w-[25%]">Rate</th>
                          <th className="w-[25%]">Tax amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>SGST</td>
                          <td className="text-right word-break break-all">
                            ₹
                            {parseFloat(gstFormData.amount).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td>{gstFormData.taxRate}%</td>
                          <td className="text-right word-break break-all">
                            ₹
                            {parseFloat(gstFormData.taxAmount).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>CGST</td>
                          <td className="text-right word-break break-all">
                            ₹
                            {parseFloat(gstFormData.amount).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td>{gstFormData.taxRate}%</td>
                          <td className="text-right word-break break-all">
                            ₹
                            {parseFloat(gstFormData.taxAmount).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <table>
                      <tbody>
                        <tr>
                          <td className="font-bold w-[50%]">Sub Total</td>
                          <td className="text-right word-break break-all w-[50%]">
                            ₹
                            {(
                              parseFloat(gstFormData.amount) +
                              parseFloat(gstFormData.taxAmount)
                            ).toLocaleString("en-IN")}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold w-[50%]">Total</td>
                          <td className="text-right word-break break-all w-[50%]">
                            ₹
                            {(
                              parseFloat(gstFormData.amount) +
                              parseFloat(gstFormData.taxAmount)
                            ).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="amount-in-words">
                  <p className="font-bold">Invoice Amount In Words:</p>
                  <p className="text-lg break-words">
                    ₹
                    {(
                      parseFloat(gstFormData.amount) +
                      parseFloat(gstFormData.taxAmount)
                    ).toLocaleString("en-IN")}{" "}
                    Rupees Only
                  </p>
                </div>

                <div className="description">
                  <p className="font-bold">Description:</p>
                  <p>{gstFormData.description}</p>
                  <p>
                    Just You Need To Pay Goods & Service Tax SGST(
                    {gstFormData.taxRate}%) INR{" "}
                    {parseFloat(gstFormData.taxAmount).toLocaleString("en-IN")}
                    /- & CGST({gstFormData.taxRate}%) INR{" "}
                    {parseFloat(gstFormData.taxAmount).toLocaleString("en-IN")}
                    /- Refundable Money Only
                  </p>
                  <p>
                    5 min Through NEFT/RTGS/Online Banking/UPI in Following Bank
                    Accounts
                  </p>
                </div>

                <div className="footer">
                  <p className="font-bold">सत्यमेव जयते</p>
                  <p>Goods and Services Tax</p>
                  <div className="signature-container">
                    <img className="mohar" src={GstMohar} alt="GST Mohar" />
                    <img className="h-20 w-20" src={Satemejate} alt="" />
                    <img
                      className="signature"
                      src={Signature}
                      alt="Signature"
                    />
                  </div>

                <div className="w-full flex justify-center">
                  <img className="h-20 w-20" src={mohar} alt="" />
                 </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handlePrint}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 border-2 border-yellow-700 text-white hover:scale-105 transition-all duration-300 flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg"
              >
                <Printer className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                Download GST Document
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
                <CheckCircle className="w-4 sm:w-6 h-4 sm:h-6 text-gray-600" />
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
                <CheckCircle className="h-4 sm:h-6 w-4 sm:w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-2 sm:ml-4">
              <h4 className="text-base sm:text-lg font-medium text-green-800">
                Approved
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                Your payment has been successfully verified! Download your GST
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
              <span>Download and save the GST document</span>
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
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
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
          word-break: break-word;
        }
        .table-container thead tr {
          background-color: #3B82F6;
          color: white;
        }
        .tax-breakdown {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
        }
        .amount-in-words .font-bold {
          font-weight: bold;
          font-size: 14px;
        }
        .amount-in-words .text-lg {
          font-size: 18px;
          word-break: break-words;
        }
        .description {
          margin-bottom: 16px;
          font-size: 14px;
        }
        .description p {
          margin: 0;
          word-break: break-words;
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
        .footer .signature-container img.mohar {
          width: 128px;
          height: auto;
        }
        .footer .signature-container img.signature {
          width: 100px;
          height: auto;
        }
      `}</style>
    </div>
  );
}
