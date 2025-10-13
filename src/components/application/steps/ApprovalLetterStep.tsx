import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Stamp,
} from "lucide-react";

import { useEffect, useState, useRef } from "react";
import { useStepper } from "../../../contexts/StepperContext";
import api from "../../../api/apiClient";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";
import { useAccountStore } from "../../../hooks/accounts";
import ApproveMohar from "../../../assets/assets/mohar/approval-mohar.jpeg";
import LoanApprovedMohar from "../../../assets/assets/mohar/loanApproval.jpeg";
import ApprovalSignature from "../../../assets/assets/signature/approval-signature.jpeg";
import IndiaBulls from "../../../assets/assets/logo/IndiaBulls.jpeg";
import DhaniOverlay from "../../../assets/assets/dhaniOverlay.jpeg";

export default function ApprovalLetterStep() {
  const { updateStepData, state } = useStepper();
  const [approvalStatus, setApprovalStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED"
  >("PENDING");
  const [isLoading, setIsLoading] = useState(false);
  const [backendProcessingFeeStatus, setBackendProcessingFeeStatus] =
    useState("PENDING");
  const [apiLoanData, setApiLoanData] = useState<any>(null); // Store API response
  const hasFetched = useRef(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const { account, fetchAccount } = useAccountStore();

  useEffect(() => {
    if (!account) fetchAccount();
  }, []);

  // Fetch processingFeeStatus and loan data from backend
  useEffect(() => {
    if (hasFetched.current) {
      console.log("API already called, skipping...");
      return;
    }

    const fetchProcessingFeeStatus = async () => {
      const applicationId = localStorage.getItem("loanApplicationId");
      if (!applicationId) {
        console.log("No loanApplicationId found");
        toast.error("Loan application ID not found");
        return;
      }

      try {
        console.log(
          `Calling API: /loan-applications/${applicationId} at ${new Date().toISOString()}`
        );
        const response = await api.get(`/loan-applications/${applicationId}`);
        const { data } = response.data;
        console.log("Fetched loan application:", data);

        hasFetched.current = true;
        setBackendProcessingFeeStatus(data.processingFeeStatus || "PENDING");
        setApiLoanData(data); // Store API data

        // Debug logs
        console.log("Backend Processing Fee Status:", data.processingFeeStatus);
        console.log("API Loan Data:", data);
        console.log("StepperContext Steps:", state.steps);
      } catch (error: any) {
        console.error("Failed to fetch processing fee status:", error);
        toast.error(
          error?.response?.data?.message ||
          "Failed to fetch processing fee status"
        );
      }
    };

    fetchProcessingFeeStatus();

    return () => {
      hasFetched.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      backendProcessingFeeStatus === "APPROVED" &&
      approvalStatus === "PENDING"
    ) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setApprovalStatus("APPROVED");
        const approvalData = {
          status: "APPROVED",
          approvalDate: new Date().toISOString(),
          approvalNumber: `LOAN_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 6)
            .toUpperCase()}`,
        };
        updateStepData(5, approvalData);
        setIsLoading(false);
        const event = new CustomEvent("approvalLetterSubmitted", {
          detail: { isValid: true, stepId: 5 },
        });
        window.dispatchEvent(event);
        console.log("Dispatched approvalLetterSubmitted event:", {
          isValid: true,
          stepId: 5,
        });
      }, 3000);

      return () => clearTimeout(timer);
    } else if (backendProcessingFeeStatus !== "APPROVED") {
      setApprovalStatus("PENDING");
      updateStepData(5, { status: "PENDING" });
    } else if (
      backendProcessingFeeStatus === "APPROVED" &&
      approvalStatus === "APPROVED"
    ) {
      const event = new CustomEvent("approvalLetterSubmitted", {
        detail: { isValid: true, stepId: 5 },
      });
      window.dispatchEvent(event);
    }
  }, [backendProcessingFeeStatus, approvalStatus, updateStepData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateForPDF = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return amount?.toLocaleString("en-IN") || "0";
  };

  const getCurrentDate = () => {
    return new Date()
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  const calculateEMI = (
    loanAmount: number,
    interestRate: number,
    tenure: number
  ) => {
    const monthlyRate = interestRate / 100 / 12;
    const emi = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
    );
    return emi;
  };

  const downloadPDF = () => {
    const approvalStep = state.steps.find((step) => step.id === 5);

    // Use API data if available, otherwise fallback to context
    const loanData = {
      applicantName: apiLoanData?.fullName || "N/A",
      phoneNumber: apiLoanData?.phone || "N/A",
      loanAmount: Number(apiLoanData?.loanAmount) || 0,
      interestRate: Number(apiLoanData?.interest) || 0,
      tenure: Number(apiLoanData?.loanTenure) || 0,
      calculatedEMI:
        apiLoanData?.loanAmount &&
          apiLoanData?.interest &&
          apiLoanData?.loanTenure
          ? calculateEMI(
            Number(apiLoanData.loanAmount),
            Number(apiLoanData.interest),
            Number(apiLoanData.loanTenure)
          )
          : 0,
      bankName: apiLoanData?.bankName || "N/A",
      accountNumber: apiLoanData?.accountNumber || "N/A",
      ifscCode: apiLoanData?.ifscCode || "N/A",
      approvalNumber: approvalStep?.data?.approvalNumber || "N/A",
      approvalDate:
        approvalStep?.data?.approvalDate || new Date().toISOString(),
      referenceNumber: `Dhani/${Date.now()}`,
      applicationNumber: `Dhani/${Date.now() + 1000}`,
    };

    const element = pdfContentRef.current;
    if (!element) {
      console.error("PDF content element not found");
      toast.error("Failed to generate PDF: Content not found");
      return;
    }

    // Debug: Log element content
    console.log("PDF Content Element:", element.innerHTML);

    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `Loan_Approval_Letter_${loanData.approvalNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true,
        onclone: (document: Document) => {
          console.log(
            "html2canvas cloned document:",
            document.querySelector("#loan-approval-content")?.innerHTML
          );
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Ensure DOM is rendered before generating PDF
    setTimeout(() => {
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .catch((error: any) => {
          console.error("PDF generation failed:", error);
          toast.error("Failed to generate PDF");
        });
    }, 100); // 100ms delay to ensure rendering
  };

  if (backendProcessingFeeStatus !== "APPROVED") {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2">
            Payment Pending
          </h3>
          <p className="text-yellow-700 mb-4 text-sm sm:text-base">
            Please complete the processing fee payment in the previous step to
            proceed with the approval process.
          </p>
          <div className="bg-white p-3 sm:p-4 rounded-md border border-yellow-200">
            <p className="text-sm sm:text-base text-gray-600">
              <strong>Next Steps:</strong>
            </p>
            <ul className="text-sm sm:text-base text-gray-600 mt-2 space-y-1">
              <li className="flex items-center">
                <span className="mr-2">•</span> Go back to Step 4
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Complete the processing fee
                payment
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Upload payment screenshot
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Return here for approval letter
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (approvalStatus === "PENDING") {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
          <div className="animate-spin w-10 sm:w-12 h-10 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">
            Processing Your Application
          </h3>
          <p className="text-blue-700 mb-4 text-sm sm:text-base">
            We are reviewing your documents and processing fee payment. This
            usually takes a few moments.
          </p>
          <div className="bg-white p-3 sm:p-4 rounded-md border border-blue-200">
            <div className="flex items-center justify-center space-x-2 text-sm sm:text-base text-gray-600">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Estimated time: 2-3 minutes</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const approvalData = state.steps.find((step) => step.id === 5)?.data;

  // Use API data for rendering PDF content
  const loanData = {
    applicantName: apiLoanData?.fullName || "N/A",
    phoneNumber: apiLoanData?.phone || "N/A",
    loanAmount: Number(apiLoanData?.loanAmount) || 0,
    interestRate: Number(apiLoanData?.interest) || 0,
    tenure: Number(apiLoanData?.loanTenure) || 0,
    calculatedEMI:
      apiLoanData?.loanAmount &&
        apiLoanData?.interest &&
        apiLoanData?.loanTenure
        ? calculateEMI(
          Number(apiLoanData.loanAmount),
          Number(apiLoanData.interest),
          Number(apiLoanData.loanTenure)
        )
        : 0,
    bankName: apiLoanData?.bankName || "N/A",
    accountNumber: apiLoanData?.accountNumber || "N/A",
    ifscCode: apiLoanData?.ifscCode || "N/A",
    approvalNumber: approvalData?.approvalNumber || "N/A",
    approvalDate: approvalData?.approvalDate || new Date().toISOString(),
    referenceNumber: `Dhani/${Date.now()}`,
    applicationNumber: `Dhani/${Date.now() + 1000}`,
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Inline styles for PDF content */}
      <style>
        {`
                    #loan-approval-content {
                        font-family: Arial, sans-serif;
                        background: white;
                        border: 1px solid #e5e7eb;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                        max-width: 210mm;
                        margin: 0 auto 24px;
                        box-sizing: border-box;
                    }
                    #loan-approval-content .bg-blue-600 { background-color: #2563eb; }
                    #loan-approval-content .text-blue-600 { color: #2563eb; }
                    #loan-approval-content .bg-green-50 { background-color: #f0fdf4; }
                    #loan-approval-content .border-green-300 { border-color: #86efac; }
                    #loan-approval-content .text-green-800 { color: #15803d; }
                    #loan-approval-content .bg-red-100 { background-color: #fee2e2; }
                    #loan-approval-content .border-red-300 { border-color: #fca5a5; }
                    #loan-approval-content .text-red-600 { color: #dc2626; }
                    #loan-approval-content .bg-gray-50 { background-color: #f9fafb; }
                    #loan-approval-content .border-gray-400 { border-color: #9ca3af; }
                    #loan-approval-content .text-gray-600 { color: #4b5563; }
                    #loan-approval-content .bg-green-600 { background-color: #16a34a; }
                    #loan-approval-content .text-white { color: #ffffff; }
                    #loan-approval-content .bg-gradient-to-r { background: linear-gradient(to right, #22c55e, #3b82f6); }
                    // .table-with-overlay {
                    //     background-image: url(${DhaniOverlay});
                    //     background-size: cover;
                    //     background-position: center;
                    //     background-repeat: no-repeat;
                    // }
                `}
      </style>

      {/* Visible PDF Preview */}
      <div className="mb-6">
        <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Loan Approval Letter Preview
        </h4>
        <div id="loan-approval-content" ref={pdfContentRef} className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white p-2 rounded-full">
                <FileText size={24} />
              </div>
              <div>
                <img
                  className="h-10 w-auto object-contain"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6S4MCoi-TuAFNAd1V-U-uscxa9w2HIchmPA&s"
                  alt=""
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="">
                <img className="h-10 w-auto object-contain" src={IndiaBulls} alt="" />
              </div>
              <div className="text-right"></div>
            </div>
          </div>
          <div className="bg-blue-600 text-white text-center py-2 mb-6">
            <span className="font-bold text-sm">LOAN APPROVAL LETTER</span>
          </div>
          <div className="mb-6 text-sm">
            <div>
              <strong>Br Office:</strong>
            </div>
            <div>Second floor Victoria Building dhani finance Uttam Nagar Delhi ,110013</div>
          </div>
          <div className="mb-6 text-sm">
            <div>
              <strong>Dear :</strong> {loanData.applicantName.toUpperCase()}
            </div>
          </div>
          <div className="mb-6 text-sm leading-relaxed">
            <p>
              <strong>Dhani Finance Ltd acknowledges you.</strong> We are
              pleased to inform you that your application for an amount of Rs.
              {formatCurrency(loanData.loanAmount)} has been activated. The
              information mentioned by you has been investigated secretly by the
              company team through online verification/PAN no/Voter card &
              Aadhar card (s.below). Application detail below.
            </p>
          </div>
          <div>
            <table className="w-full border-collapse border border-gray-400 mb-6 text-sm table-with-overlay">
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold bg-gray-50">
                    Reference No.
                  </td>
                  <td className="border border-gray-400 p-2">
                    {loanData.referenceNumber}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold bg-gray-50">
                    Application No.
                  </td>
                  <td className="border border-gray-400 p-2">
                    {loanData.applicationNumber}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold bg-gray-50">
                    Bank Name
                  </td>
                  <td className="border border-gray-400 p-2">
                    {loanData.bankName.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold bg-gray-50">
                    Account No.
                  </td>
                  <td className="border border-gray-400 p-2">
                    {loanData.accountNumber}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 font-semibold bg-gray-50">
                    IFSC code.
                  </td>
                  <td className="border border-gray-400 p-2">
                    {loanData.ifscCode}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-green-50 border border-green-300 p-4 mb-6">
            <h3 className="text-center text-lg font-bold text-green-800 mb-3">
              EMI AND LOAN AMOUNT APPROVED
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">
                  EMI-{formatCurrency(loanData.calculatedEMI)}
                </div>
                <div>LOAN AMOUNT-{formatCurrency(loanData.loanAmount)}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">TENURE-{loanData.tenure}</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">
                  INTEREST RATE: {loanData.interestRate}%
                </div>
              </div>
            </div>
            <div className="bg-red-100 border border-red-300 p-2 mt-3 text-center text-xs">
              <strong>NOTE:</strong> AGREEMENT BEFORE EMI RS.
              {Math.round((loanData.calculatedEMI || 0) * 0.79)} IS COMPLETELY
              DUE IN ADVANCE & PROCESSING DAYS.
            </div>
          </div>
          <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
            <tbody>
              <tr>
                <td className="border border-gray-400 p-2 font-semibold bg-gray-50">
                  Account holder Name
                </td>
                <td className="border border-gray-400 p-2">
                  DHANI FINANCE Pvt. Ltd.
                </td>
                <td className="border border-gray-400 p-2 font-semibold bg-gray-50">
                  BANK
                </td>
                <td className="border border-gray-400 p-2">{account?.bankName}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-2 font-semibold bg-gray-50">
                  ACCOUNT Number
                </td>
                <td className="border border-gray-400 p-2">{account?.accountNumber}</td>
                <td className="border border-gray-400 p-2 font-semibold bg-gray-50">
                  IFSC CODE
                </td>
                <td className="border border-gray-400 p-2">{account?.ifscCode}</td>
              </tr>
            </tbody>
          </table>
          <div className="mb-6 text-xs">
            <div>
              <strong>PAYMENT MODE:</strong> You can make Payment Through
              NEFT/RTGS/IMPS/UPI/Net Banking and other payment mode.
            </div>
            <div>
              <strong>NOTE:</strong> CASH DEPOSITS ARE NOT ALLOWED AS PER
              COMPANY RULES AND REGULATIONS.
            </div>
          </div>
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img className="w-20 h-20" src={ApproveMohar} alt="" />
              </div>
            </div>

            <div className="relative">
              <img className="w-20 h-20" src={LoanApprovedMohar} alt="" />
            </div>
            <div className="text-right">
              <div className="mb-2 text-sm italic">Yours faithfully</div>
              <div className="mb-4">
                <div className="text-lg font-bold">Dhani Finance Ltd</div>
                <div className="w-32 h-0.5 bg-black mb-2"></div>
              </div>
              <div className="ml-5">
                <img className="w-12 h-12 mr-3" src={ApprovalSignature} alt="" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 mb-4">
            <div className="bg-green-600 text-white px-4 py-2 rounded transform -rotate-12 font-bold text-sm flex items-center">
              <CheckCircle className="inline mr-1" size={16} />
              LOAN APPROVED
            </div>
          </div>
          <div className="mt-8">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 h-8 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                dhani services
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main UI */}
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
          <CheckCircle className="w-14 sm:w-16 h-14 sm:h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
            Congratulations! Your Loan is Pre-Approved
          </h3>
          <p className="text-green-700 text-sm sm:text-base">
            Your loan application has been successfully reviewed and
            pre-approved. Please proceed with the next steps to complete the
            process.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Approval Details
          </h4>
          <div className="grid gap-4 sm:gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm sm:text-base font-medium text-gray-600">
                  Approval Number
                </label>
                <p className="text-lg sm:text-xl font-mono text-gray-800">
                  {approvalData?.approvalNumber}
                </p>
              </div>
              <div>
                <label className="text-sm sm:text-base font-medium text-gray-600">
                  Approval Date
                </label>
                <p className="text-gray-800 text-sm sm:text-base">
                  {formatDate(approvalData?.approvalDate)}
                </p>
              </div>
              <div>
                <label className="text-sm sm:text-base font-medium text-gray-600">
                  Status
                </label>
                <div className="flex items-center space-x-2">
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm sm:text-base font-medium">
                    Pre-Approved
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm sm:text-base font-medium text-gray-600">
                  Valid Until
                </label>
                <p className="text-gray-800 text-sm sm:text-base">
                  {formatDate(
                    new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000
                    ).toISOString()
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Pre-Approved Loan Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-white rounded-md border">
              <p className="text-sm sm:text-base text-gray-600 mb-1">
                Loan Amount
              </p>
              <p className="text-lg sm:text-xl font-bold text-blue-600">
                {apiLoanData?.loanAmount
                  ? `₹${Number(apiLoanData.loanAmount).toLocaleString("en-IN")}`
                  : "N/A"}
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-md border">
              <p className="text-sm sm:text-base text-gray-600 mb-1">
                Interest Rate
              </p>
              <p className="text-lg sm:text-xl font-bold text-green-600">
                {apiLoanData?.interest || "N/A"}% p.a.
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white rounded-md border">
              <p className="text-sm sm:text-base text-gray-600 mb-1">
                Monthly EMI
              </p>
              <p className="text-lg sm:text-xl font-bold text-purple-600">
                {apiLoanData?.loanAmount &&
                  apiLoanData?.interest &&
                  apiLoanData?.loanTenure
                  ? `₹${calculateEMI(
                    Number(apiLoanData.loanAmount),
                    Number(apiLoanData.interest),
                    Number(apiLoanData.loanTenure)
                  ).toLocaleString("en-IN")}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={downloadPDF}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Download Approval Letter
          </button>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Keep this approval letter for your records
          </p>
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
              <span>Complete the remaining documentation and fee payments</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">
                2
              </span>
              <span>Submit all required documents and payments</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 sm:w-6 h-5 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium mr-2 sm:mr-3 mt-0.5">
                3
              </span>
              <span>Final verification and loan disbursal</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}