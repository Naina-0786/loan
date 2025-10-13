import { useRef, useState } from "react";
import Button from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
// import { Input } from "../../ui/Input";
import Input from "../../ui/Input";
import { Label } from "../../ui/Label";
import { cn } from "../../../lib/utils";
import { AlertCircle, Printer, FileText } from "lucide-react";
import html2pdf from "html2pdf.js";
import GstMohar from "../../assets/gst/IMG-20250324-WA0030.jpg"
import Signature from "../../assets/gst/IMG-20250324-WA0036.jpg"

interface FormData {
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

const Gst: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        billTo: "",
        companyName: "",
        gstNumber: "",
        invoiceNumber: "",
        date: "",
        eWayBillNumber: "",
        amount: "",
        taxType: "SGST/CGST",
        taxRate: "4",
        taxAmount: "",
        description: "",
    });
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const printRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "amount" || name === "taxRate") {
            const amount = name === "amount" ? parseFloat(value) || 0 : parseFloat(formData.amount) || 0;
            const taxRate = name === "taxRate" ? parseFloat(value) || 0 : parseFloat(formData.taxRate) || 0;
            const taxAmount = (amount * taxRate) / 100;
            setFormData((prev) => ({ ...prev, taxAmount: taxAmount.toFixed(2) }));
        }
    };

    const handleGeneratePreview = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors: string[] = [];
        if (!formData.billTo) errors.push("Bill To is required.");
        if (!formData.companyName) errors.push("Company Name is required.");
        if (!formData.gstNumber) errors.push("GST Number is required.");
        if (!formData.invoiceNumber) errors.push("Invoice Number is required.");
        if (!formData.date) errors.push("Date is required.");
        if (!formData.eWayBillNumber) errors.push("E-Way Bill Number is required.");
        if (!formData.amount) errors.push("Amount is required.");
        if (!formData.taxAmount) errors.push("Tax Amount is required.");
        if (!formData.description) errors.push("Description is required.");

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
                margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
                filename: `GST_Invoice_${formData.invoiceNumber}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, width: 750 }, // Fixed width for PDF
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
        <div className="w-full bg-background">
            <div className="container">
                {/* Form Section */}
                <div className="max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-6 text-center">
                        Generate GST Document
                    </h2>
                    <Card className="bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gold/30 dark:border-gold/50 rounded-lg shadow-lg">
                        <CardContent className="p-3">
                            <form onSubmit={handleGeneratePreview}>
                                <div className="space-y-4">
                                    {/* Bill To */}
                                    <div className="space-y-2">
                                        <Label htmlFor="billTo" className="text-blue-900 dark:text-blue-300 font-semibold">
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
                                                formErrors.includes("Bill To is required.") && "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Bill To is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Bill To is required.
                                            </p>
                                        )}
                                    </div>

                                    {/* Company Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName" className="text-blue-900 dark:text-blue-300 font-semibold">
                                            Company Name
                                        </Label>
                                        <Input
                                            id="companyName"
                                            name="companyName"
                                            placeholder="Enter company name..."
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            className={cn(
                                                "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                                                formErrors.includes("Company Name is required.") && "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Company Name is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Company Name is required.
                                            </p>
                                        )}
                                    </div>

                                    {/* GST Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="gstNumber" className="text-blue-900 dark:text-blue-300 font-semibold">
                                            GST Number
                                        </Label>
                                        <Input
                                            id="gstNumber"
                                            name="gstNumber"
                                            placeholder="Enter GST number..."
                                            value={formData.gstNumber}
                                            onChange={handleInputChange}
                                            className={cn(
                                                "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                                                formErrors.includes("GST Number is required.") && "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("GST Number is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                GST Number is required.
                                            </p>
                                        )}
                                    </div>

                                    {/* Invoice Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="invoiceNumber" className="text-blue-900 dark:text-blue-300 font-semibold">
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
                                                formErrors.includes("Invoice Number is required.") && "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Invoice Number is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Invoice Number is required.
                                            </p>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="text-blue-900 dark:text-blue-300 font-semibold">
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
                                                formErrors.includes("Date is required.") && "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Date is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Date is required.
                                            </p>
                                        )}
                                    </div>

                                    {/* E-Way Bill Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="eWayBillNumber" className="text-blue-900 dark:text-blue-300 font-semibold">
                                            E-Way Bill Number
                                        </Label>
                                        <Input
                                            id="eWayBillNumber"
                                            name="eWayBillNumber"
                                            placeholder="Enter E-Way bill number..."
                                            value={formData.eWayBillNumber}
                                            onChange={handleInputChange}
                                            className={cn(
                                                "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                                                formErrors.includes("E-Way Bill Number is required.") && "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("E-Way Bill Number is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                E-Way Bill Number is required.
                                            </p>
                                        )}
                                    </div>

                                    {/* Amount */}
                                    <div className="space-y-2">
                                        <Label htmlFor="amount" className="text-blue-900 dark:text-blue-300 font-semibold">
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
                                                formErrors.includes("Amount is required.") && "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Amount is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Amount is required.
                                            </p>
                                        )}
                                    </div>

                                    {/* Tax Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="taxType" className="text-blue-900 dark:text-blue-300 font-semibold">
                                            Tax Type
                                        </Label>
                                        <Input
                                            id="taxType"
                                            name="taxType"
                                            placeholder="Enter tax type (e.g., SGST/CGST)..."
                                            value={formData.taxType}
                                            onChange={handleInputChange}
                                            className="bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200"
                                        />
                                    </div>

                                    {/* Tax Rate */}
                                    <div className="space-y-2">
                                        <Label htmlFor="taxRate" className="text-blue-900 dark:text-blue-300 font-semibold">
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

                                    {/* Tax Amount (Auto-calculated) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="taxAmount" className="text-blue-900 dark:text-blue-300 font-semibold">
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
                                                formErrors.includes("Tax Amount is required.") && "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Tax Amount is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Tax Amount is required.
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-blue-900 dark:text-blue-300 font-semibold">
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
                                                formErrors.includes("Description is required.") && "border-destructive dark:border-red-500"
                                            )}
                                        />
                                        {formErrors.includes("Description is required.") && (
                                            <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                Description is required.
                                            </p>
                                        )}
                                    </div>

                                    {/* Generate PDF Preview Button */}
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

                {/* Preview Section */}
                {showPreview && (
                    <div className="container w-full mx-auto py-8 preview-wrapper">
                        <div
                            ref={printRef}
                            className="bg-white p-6 shadow-lg relative font-sans print-card"
                        >
                            {/* Header with GST Logo */}
                            <div className="header">
                                <div className="flex justify-center items-center w-full">
                                    <h1 className="text-2xl font-extrabold text-[#F89406] uppercase">
                                        Goods and Services Tax Council
                                    </h1>
                                </div>
                            </div>

                            {/* Invoice Header */}
                            <div className="invoice-header">
                                <div>
                                    <p className="font-bold">
                                        Bill To: <span className="font-normal">{formData.billTo}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">
                                        Invoice No.: <span className="font-normal">{formData.invoiceNumber}</span>
                                    </p>
                                    <p className="font-bold">
                                        Date: <span className="font-normal">{formData.date}</span>
                                    </p>
                                    <p className="font-bold">
                                        E-Way Bill number: <span className="font-normal">{formData.eWayBillNumber}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Invoice Table */}
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="w-[5%]">#</th>
                                            <th className="w-[20%]">Item name</th>
                                            {/* <th className="w-[10%]">HSN/SAC</th> */}
                                            {/* <th className="w-[15%]">Loan/amount</th> */}
                                            <th className="w-[15%]">Total amount</th>
                                            <th className="w-[15%]">GST</th>
                                            <th className="w-[20%]">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Goods & Service Tax</td>
                                            {/* <td></td> */}
                                            {/* <td className="text-right word-break break-all">
                                                ₹{parseFloat(formData.amount).toLocaleString("en-IN")}
                                            </td> */}
                                            <td className="text-right word-break break-all">
                                                ₹{parseFloat(formData.amount).toLocaleString("en-IN")}
                                            </td>
                                            <td className="word-break break-all">
                                                {formData.taxRate}% (₹{parseFloat(formData.taxAmount).toLocaleString("en-IN")})
                                            </td>
                                            <td className="text-right word-break break-all">
                                                ₹{(parseFloat(formData.amount) + parseFloat(formData.taxAmount)).toLocaleString("en-IN")}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Tax Breakdown */}
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
                                                    ₹{parseFloat(formData.amount).toLocaleString("en-IN")}
                                                </td>
                                                <td>{formData.taxRate}%</td>
                                                <td className="text-right word-break break-all">
                                                    ₹{(parseFloat(formData.taxAmount)).toLocaleString("en-IN")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>CGST</td>
                                                <td className="text-right word-break break-all">
                                                    ₹{parseFloat(formData.amount).toLocaleString("en-IN")}
                                                </td>
                                                <td>{formData.taxRate}%</td>
                                                <td className="text-right word-break break-all">
                                                    ₹{(parseFloat(formData.taxAmount)).toLocaleString("en-IN")}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Total Amounts */}
                                <div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="font-bold w-[50%]">Sub Total</td>
                                                <td className="text-right word-break break-all w-[50%]">
                                                    ₹{(parseFloat(formData.amount) + parseFloat(formData.taxAmount)).toLocaleString("en-IN")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold w-[50%]">Total</td>
                                                <td className="text-right word-break break-all w-[50%]">
                                                    ₹{(parseFloat(formData.amount) + parseFloat(formData.taxAmount)).toLocaleString("en-IN")}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Invoice Amount in Words */}
                            <div className="amount-in-words">
                                <p className="font-bold">Invoice Amount In Words:</p>
                                <p className="text-lg break-words">
                                    ₹{(parseFloat(formData.amount) + parseFloat(formData.taxAmount)).toLocaleString("en-IN")} Rupees Only
                                </p>
                            </div>

                            {/* Description */}
                            <div className="description">
                                <p className="font-bold">Description:</p>
                                <p>{formData.description}</p>
                                <p>
                                    Just You Need To Pay Goods & Service Tax SGST({formData.taxRate}%) INR{" "}
                                    {(parseFloat(formData.taxAmount)).toLocaleString("en-IN")}/- & CGST({formData.taxRate}%) INR{" "}
                                    {(parseFloat(formData.taxAmount)).toLocaleString("en-IN")}/- Refundable Money Only
                                </p>
                                <p>5 min Through NEFT/RTGS/Online Banking/UPI in Following Bank Accounts</p>
                            </div>

                            {/* Footer */}
                            <div className="footer">
                                <p className="font-bold">सत्यमेव जयते</p>
                                <p>Goods and Services Tax</p>
                                <div className="signature-container">
                                    <img className="mohar" src={GstMohar} alt="GST Mohar" />
                                    <img className="signature" src={Signature} alt="Signature" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Print Button */}
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

            {/* Inline Styles */}
            <style>{`
                .preview-wrapper {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE and Edge */
                }
                .preview-wrapper::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, and Opera */
                }
                .print-card {
                    width: 700px; /* Fixed width for desktop layout */
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
};

export default Gst;

