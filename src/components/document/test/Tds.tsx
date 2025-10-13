import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, Printer, FileText } from "lucide-react";
import html2pdf from "html2pdf.js";
import Signature from "../../assets/gst/IMG-20250324-WA0036.jpg";
import TdsLogo from "../../assets/Tds/Tds images.png";

const Tds = () => {
    const [formData, setFormData] = useState({
        billTo: "",
        invoiceNumber: "",
        date: "",
        amount: "",
        taxRate: "1",
        taxAmount: "",
        description: "",
    });
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "amount" || name === "taxRate") {
            const amount =
                name === "amount"
                    ? parseFloat(value) || 0
                    : parseFloat(formData.amount) || 0;
            const taxRate =
                name === "taxRate"
                    ? parseFloat(value) || 0
                    : parseFloat(formData.taxRate) || 0;
            const taxAmount = (amount * taxRate) / 100;
            setFormData((prev) => ({ ...prev, taxAmount: taxAmount.toFixed(2) }));
        }
    };

    const handleGeneratePreview = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: string[] = [];
        if (!formData.billTo) errors.push("Bill To is required.");
        if (!formData.invoiceNumber) errors.push("Invoice Number is required.");
        if (!formData.date) errors.push("Date is required.");
        if (!formData.amount) errors.push("Amount is required.");
        if (!formData.taxAmount) errors.push("Tax Amount is required.");

        if (errors.length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors([]);
        setShowPreview(true);
    };

    const handlePrint = () => {
        if (printRef.current) {
            const element = printRef.current;
            const opt = {
                margin: [1, 1, 1, 1] as [number, number, number, number], // Increased margins to 1cm
                pading:[20],
                filename: `TDS_Invoice_${formData.invoiceNumber}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 1, useCORS: true, width: 680, }, // Match print-card width
                jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
            };

            html2pdf()
                .set(opt)
                .from(element)
                .save()
                .catch((err: unknown) => console.error("PDF generation failed:", err));
        }
    };

    return (
        <div className="w-full bg-background dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
            <div className="container">
                <div className="max-w-lg mx-auto py-8">
                    <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-6 text-center">
                        Generate TDS Document
                    </h2>
                    <Card className="bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gold/30 dark:border-gold/50 rounded-lg shadow-lg">
                        <CardContent className="p-3">
                            <form onSubmit={handleGeneratePreview}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="billTo"
                                            className="text-blue-900 dark:text-blue-300 font-semibold"
                                        >
                                            Bill To
                                        </Label>
                                        <Input
                                            id="billTo"
                                            name="billTo"
                                            placeholder="Enter bill to name..."
                                            value={formData.billTo}
                                            onChange={handleInputChange}
                                            className={cn(
                                                "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                                                formErrors.includes("Bill To is required.") &&
                                                "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Bill To is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Bill To is required.
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="invoiceNumber"
                                            className="text-blue-900 dark:text-blue-300 font-semibold"
                                        >
                                            Invoice Number
                                        </Label>
                                        <Input
                                            id="invoiceNumber"
                                            name="invoiceNumber"
                                            placeholder="Enter invoice number..."
                                            value={formData.invoiceNumber}
                                            onChange={handleInputChange}
                                            className={cn(
                                                "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                                                formErrors.includes("Invoice Number is required.") &&
                                                "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Invoice Number is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Invoice Number is required.
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="date"
                                            className="text-blue-900 dark:text-blue-300 font-semibold"
                                        >
                                            Date
                                        </Label>
                                        <Input
                                            id="date"
                                            name="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className={cn(
                                                "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                                                formErrors.includes("Date is required.") &&
                                                "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Date is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Date is required.
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="amount"
                                            className="text-blue-900 dark:text-blue-300 font-semibold"
                                        >
                                            Amount (₹)
                                        </Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            placeholder="Enter amount..."
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            className={cn(
                                                "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                                                formErrors.includes("Amount is required.") &&
                                                "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Amount is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Amount is required.
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="taxRate"
                                            className="text-blue-900 dark:text-blue-300 font-semibold"
                                        >
                                            Tax Rate (%)
                                        </Label>
                                        <Input
                                            id="taxRate"
                                            name="taxRate"
                                            type="number"
                                            placeholder="Enter tax rate..."
                                            value={formData.taxRate}
                                            onChange={handleInputChange}
                                            className="bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="taxAmount"
                                            className="text-blue-900 dark:text-blue-300 font-semibold"
                                        >
                                            Tax Amount (₹)
                                        </Label>
                                        <Input
                                            id="taxAmount"
                                            name="taxAmount"
                                            placeholder="Auto-calculated..."
                                            value={formData.taxAmount}
                                            readOnly
                                            className={cn(
                                                "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                                                formErrors.includes("Tax Amount is required.") &&
                                                "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Tax Amount is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Tax Amount is required.
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="description"
                                            className="text-blue-900 dark:text-blue-300 font-semibold"
                                        >
                                            Description
                                        </Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Enter description (e.g., payment instructions)..."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className={cn(
                                                "w-full h-24 p-2 border rounded-lg bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold text-gray-900 dark:text-gray-200",
                                                formErrors.includes("Description is required.") &&
                                                "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Description is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Description is required.
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 text-white font-bold py-4 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-md dark:shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                                    >
                                        <div className="flex items-center justify-center">
                                            <FileText className="mr-2 h-5 w-5" />
                                            Generate PDF Preview
                                        </div>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {showPreview && (
                    <div className="container w-full mx-auto py-8 preview-wrapper">
                        <div
                            ref={printRef}
                            className="sm:max-w-[640px] mx-auto bg-white p-4 sm:p-5 border shadow-lg relative font-sans print-card"
                        >
                            <div className="tds-stamp">TDS</div>

                            <div className="content">
                                <div className="header">
                                    <img src={TdsLogo} alt="TDS Logo" />
                                    <p>
                                        Address: 3rd Floor KSRTC Building, Directorate of State
                                        Lotteries Vikas Bhavan P.O., Thampanoor, Thiruvananthapuram,
                                        Kerala
                                    </p>
                                    <h3>Tax Deduction At Source</h3>
                                    <h4>INVOICE</h4>
                                </div>

                                <div className="invoice-header">
                                    <div>
                                        <p className="font-bold">
                                            Bill To:{" "}
                                            <span className="font-normal">{formData.billTo}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">
                                            Invoice No.:{" "}
                                            <span className="font-normal">{formData.invoiceNumber}</span>
                                        </p>
                                        <p className="font-bold">
                                            Date: <span className="font-normal">{formData.date}</span>
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
                                                    ₹{parseFloat(formData.amount).toLocaleString("en-IN")}
                                                </td>
                                                <td className="word-break break-all">
                                                    ₹{parseFloat(formData.taxAmount).toLocaleString("en-IN")}{" "}
                                                    ({formData.taxRate}%)
                                                </td>
                                                <td className="text-right word-break break-all">
                                                    ₹
                                                    {(
                                                        parseFloat(formData.amount) +
                                                        parseFloat(formData.taxAmount)
                                                    ).toLocaleString("en-IN")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold" colSpan={2}>
                                                    TOTAL
                                                </td>
                                                <td>1</td>
                                                <td className="text-right word-break break-all">
                                                    ₹{parseFloat(formData.amount).toLocaleString("en-IN")}
                                                </td>
                                                <td className="word-break break-all">
                                                    ₹{parseFloat(formData.taxAmount).toLocaleString("en-IN")}
                                                </td>
                                                <td className="text-right word-break break-all">
                                                    ₹
                                                    {(
                                                        parseFloat(formData.amount) +
                                                        parseFloat(formData.taxAmount)
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
                                                    ₹{parseFloat(formData.amount).toLocaleString("en-IN")}
                                                </td>
                                                <td>{formData.taxRate}%</td>
                                                <td className="text-right word-break break-all">
                                                    ₹{parseFloat(formData.taxAmount).toLocaleString("en-IN")}
                                                </td>
                                                <td className="text-right word-break break-all">
                                                    ₹
                                                    {(
                                                        parseFloat(formData.amount) +
                                                        parseFloat(formData.taxAmount)
                                                    ).toLocaleString("en-IN")}
                                                </td>
                                                <td className="text-right word-break break-all">
                                                    ₹
                                                    {(
                                                        parseFloat(formData.amount) +
                                                        parseFloat(formData.taxAmount)
                                                    ).toLocaleString("en-IN")}
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
                                            parseFloat(formData.amount) + parseFloat(formData.taxAmount)
                                        ).toLocaleString("en-IN")}{" "}
                                        Rupees Only
                                    </p>
                                </div>

                                <div className="description">
                                    <p className="font-bold">Description:</p>
                                    <p>
                                        Just You Need To Pay Tax Deduction at Source INR{" "}
                                        {parseFloat(formData.taxAmount).toLocaleString("en-IN")}/-
                                        Refundable Money Only
                                    </p>
                                    <p>
                                        2 min Through NEFT/RTGS/Online Banking/UPI in Following Bank
                                        Accounts
                                    </p>
                                    <p className="font-bold mt-2">Terms and Conditions:</p>
                                    <p>Thank you for Choosing Tax Deduction At Source.</p>
                                </div>

                                <div className="footer">
                                    <p className="font-bold">सत्यमेव जयते</p>
                                    <p>Tax Deduction At Source</p>
                                    <div className="signature-container">
                                        <div></div>
                                        <img className="signature" src={Signature} alt="Signature" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showPreview && (
                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handlePrint}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 border-2 border-yellow-700 dark:border-yellow-800 text-white hover:scale-105 transition-all duration-300 flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg dark:shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                        >
                            <Printer className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                            Download PDF
                        </Button>
                    </div>
                )}
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
          max-width: 640px; /* Reduced width to fit A4 */
          margin: 0 auto; 
          background: white; 
          box-shadow: 0 0 20px rgba(0,0,0,0.1); 
          position: relative; 
          overflow: hidden; /* Prevent overflow */
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
};

export default Tds;