import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, Printer, FileText } from "lucide-react";
import html2pdf from "html2pdf.js";
import StampPaper from "../../assets/stamp/kerela_stamp_papper.jpg";
import Mohar from "../../assets/certificate/IMG-20250324-WA0029.png";

interface FormData {
  date: string;
  winnerName: string;
  aadharNumber: string;
  winningAmount: string;
  ifscCode: string;
  bankName: string;
  accountNumber: string;
  stampPaperFee: string;
  state: string;
  upiNumber: string;
  keralaGovAccountNumber: string;
  KerelaGovIfscCode: string;
  KerelaGovBankName: string;
  helpLineNumber: string;
}

const WinnerCertificate: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    date: "",
    winnerName: "",
    aadharNumber: "",
    winningAmount: "",
    ifscCode: "",
    bankName: "",
    accountNumber: "",
    stampPaperFee: "",
    helpLineNumber: "",
    upiNumber: "",
    state: "",
    keralaGovAccountNumber: "",
    KerelaGovIfscCode: "",
    KerelaGovBankName: "",
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "winningAmount") {
      let numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue) {
        const formattedValue = `Rs. ${parseFloat(numericValue).toLocaleString("en-IN")}`;
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (name === "stampPaperFee") {
      let numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue) {
        const formattedValue = parseFloat(numericValue).toLocaleString("en-IN");
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGeneratePreview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!formData.date) errors.push("Date is required.");
    if (!formData.winnerName) errors.push("Winner Name is required.");
    if (!formData.aadharNumber) errors.push("Aadhar Number is required.");
    if (!formData.winningAmount) errors.push("Winning Amount is required.");
    if (!formData.ifscCode) errors.push("IFSC Code is required.");
    if (!formData.bankName) errors.push("Bank Name is required.");
    if (!formData.accountNumber) errors.push("Account Number is required.");
    if (!formData.stampPaperFee) errors.push("Stamp Paper Fee is required.");
    if (!formData.helpLineNumber) errors.push("Help Line Number is required.");
    if (!formData.upiNumber) errors.push("UPI Number is required.");
    if (!formData.state) errors.push("State is required.");
    if (!formData.keralaGovAccountNumber) errors.push("Kerala Gov Account Number is required.");
    if (!formData.KerelaGovIfscCode) errors.push("Kerala Gov IFSC Code is required.");
    if (!formData.KerelaGovBankName) errors.push("Kerala Gov Bank Name is required.");

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
        filename: `Winner_Certificate_${formData.winnerName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, width: 750 },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: "avoid-all" },
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
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-6 text-center">
            Generate Winner Certificate
          </h2>
          <Card className="bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gold/30 dark:border-gold/50 rounded-lg shadow-lg">
            <CardContent className="p-3">
              <form onSubmit={handleGeneratePreview}>
                <div className="space-y-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="winnerName" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Winner Name
                    </Label>
                    <Input
                      id="winnerName"
                      name="winnerName"
                      placeholder="Enter winner name..."
                      value={formData.winnerName}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("Winner Name is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("Winner Name is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Winner Name is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadharNumber" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Winner Aadhar Number
                    </Label>
                    <Input
                      id="aadharNumber"
                      name="aadharNumber"
                      placeholder="Enter Aadhar number..."
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("Aadhar Number is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("Aadhar Number is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Aadhar Number is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="winningAmount" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Winning Amount (₹)
                    </Label>
                    <Input
                      id="winningAmount"
                      name="winningAmount"
                      type="text"
                      placeholder="Enter winning amount (e.g., 100000)..."
                      value={formData.winningAmount}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("Winning Amount is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("Winning Amount is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Winning Amount is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifscCode" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Winner IFSC Code
                    </Label>
                    <Input
                      id="ifscCode"
                      name="ifscCode"
                      placeholder="Enter IFSC code..."
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("IFSC Code is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("IFSC Code is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        IFSC Code is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Winner Bank Name
                    </Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      placeholder="Enter bank name..."
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("Bank Name is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("Bank Name is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Bank Name is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Winner Account Number
                    </Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      placeholder="Enter account number..."
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("Account Number is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("Account Number is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Account Number is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Winner State
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Enter state..."
                      value={formData.state}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("State is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("State is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        State is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stampPaperFee" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Stamp Paper Fee (₹)
                    </Label>
                    <Input
                      id="stampPaperFee"
                      name="stampPaperFee"
                      type="text"
                      placeholder="Enter stamp paper fee (e.g., 1000)..."
                      value={formData.stampPaperFee}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("Stamp Paper Fee is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("Stamp Paper Fee is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Stamp Paper Fee is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="helpLineNumber" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Help Line Number
                    </Label>
                    <Input
                      id="helpLineNumber"
                      name="helpLineNumber"
                      placeholder="Enter help line number..."
                      value={formData.helpLineNumber}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("Help Line Number is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("Help Line Number is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Help Line Number is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keralaGovAccountNumber" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Kerala Gov Account Number
                    </Label>
                    <Input
                      id="keralaGovAccountNumber"
                      name="keralaGovAccountNumber"
                      placeholder="Enter Kerala Gov account number..."
                      value={formData.keralaGovAccountNumber}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("Kerala Gov Account Number is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("Kerala Gov Account Number is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Kerala Gov Account Number is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="KerelaGovIfscCode" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Kerala Gov IFSC Code
                    </Label>
                    <Input
                      id="KerelaGovIfscCode"
                      name="KerelaGovIfscCode"
                      placeholder="Enter Kerala Gov IFSC Code..."
                      value={formData.KerelaGovIfscCode}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("Kerala Gov IFSC Code is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("Kerala Gov IFSC Code is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Kerala Gov IFSC Code is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="KerelaGovBankName" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Kerala Gov Bank Name
                    </Label>
                    <Input
                      id="KerelaGovBankName"
                      name="KerelaGovBankName"
                      placeholder="Enter Kerala Gov bank name..."
                      value={formData.KerelaGovBankName}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("Kerala Gov Bank Name is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("Kerala Gov Bank Name is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Kerala Gov Bank Name is required.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upiNumber" className="text-blue-900 dark:text-blue-300 font-semibold">
                      Kerala Gov UPI Number
                    </Label>
                    <Input
                      id="upiNumber"
                      name="upiNumber"
                      placeholder="Enter UPI number..."
                      value={formData.upiNumber}
                      onChange={handleInputChange}
                      className={cn(
                        "bg-white/50 dark:bg-gray-700/50 border-gold/30 dark:border-gold/50 focus:border-gold dark:focus:border-gold rounded-lg text-gray-900 dark:text-gray-200",
                        formErrors.includes("UPI Number is required.") && "border-destructive dark:border-red-500"
                      )}
                    />
                    {formErrors.includes("UPI Number is required.") && (
                      <p className="text-destructive dark:text-red-400 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        UPI Number is required.
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
          <div className="container w-full mx-auto py-4 preview-wrapper">
            <div ref={printRef} className="bg-white p-4 shadow-lg relative font-sans print-card">
              <div className="stamp-paper flex justify-center items-center">
                <img src={StampPaper} alt="Stamp Paper" className="stamp-image" />
              </div>

              <div className="header">
                <h1 className="text-lg font-bold text-center">
                  KERALA STATE GOVERNMENT MEGA LOTTERY
                </h1>
                <div className="flex justify-between mt-1">
                  <p className="font-bold" style={{ width: "50%" }}>
                    <span className="font-bold">DATE:</span> {formData.date}
                  </p>
                  <p style={{ width: "50%" }}>
                    <span className="font-bold">OFFICE ADDRESS:</span> 3rd Floor KSRTC Building, Directorate of State Lotteries Vikas Bhavan P.O., Thampanoor, Thiruvananthapuram, Kerala
                  </p>
                </div>
                <div className="flex justify-between mt-0.5">
                  <p>
                    <span className="font-bold">REF:</span>
                  </p>
                  <p>
                    <span className="font-bold">Web:</span> https://keralastatemegalottery.com
                  </p>
                </div>
                <div className="flex justify-end mt-0.5">
                  <p>
                    <span className="font-bold">Email:</span> support@megakeralalottery.com
                  </p>
                </div>
              </div>

              <div className="body mt-2">
                <p className="font-bold text-sm">KERALA STATE GOVERNMENT STAMP PAPER</p>
                <p className="mt-1 text-sm">
                  To: Mr./Ms./Mrs. <span className="font-bold">{formData.winnerName}</span>
                </p>
                <p className="mt-1 text-sm">Greetings from Kerala State Government Mega Jackpot Lottery</p>
                <p className="mt-1 text-sm">
                  Dear Customer,
                </p>
                <p className="mt-1 text-sm">
                  Your Winning amount <span className="font-bold">{formData.winningAmount}</span> is credited by the Kerala State Government Mega Lottery but Balance is not successful due to Kerala State Government stamp paper fee Rs. <span className="font-bold">{formData.stampPaperFee}</span> just Pay stamp paper fee within 2 minutes. This Balance will be funded to your active account details completing the transaction. Have a nice day for you Thanks for choosing Kerala State Government Mega Jackpot Lottery department Thiruvananthapuram Kerala.
                </p>
                <p className="mt-1 text-sm">
                  These rules were followed by the Government of Kerala. It is registered with the Government of India S.R.O No 372/2005. In Exercise of the power confirmed by the sub section (1) (2) of the section 12th of the lotteries (Regulations) Act 1998 (17 of 1998) the Government of Kerala hereby make the rules to open

                  Kerala State Government Mega Lottery.
                </p>

                <div className="winner-details mt-2">
                  <p className="font-bold text-sm">WINNER 🏆 DETAILS:</p>
                  <p className="text-sm">
                    <span className="font-bold">NAME:</span> {formData.winnerName}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">AADHAR NO:</span> {formData.aadharNumber}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">STATE:</span> {formData.state}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">WINNING AMOUNT:</span> {formData.winningAmount}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">WINNER ACCOUNT NUMBER:</span> {formData.accountNumber}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">IFSC CODE:</span> {formData.ifscCode}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">BANK NAME:</span> {formData.bankName}
                  </p>

                  <div className="relative">
                    <img src={Mohar} className="w-48 absolute right-4 top-12" alt="" />
                  </div>
                  <p className="mt-1 text-sm">
                    You need to pay Kerala State Government stamp paper charge of a normal fee Rs. <span className="font-bold">{formData.stampPaperFee}</span> Through NEFT/RTGS/Online Banking/UPI in following bank account:
                  </p>

                </div>

                <div className="bank-details mt-2">
                  <p className="font-bold text-sm">KERALA STATE GOVERNMENT MEGA LOTTERY BANK DETAILS:</p>
                  <p className="text-sm">
                    <span className="font-bold">KERALA STATE GOVERNMENT MEGA JACKPOT LOTTERY</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">UPI NUMBER:</span> {formData.upiNumber}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">ACCOUNT NUMBER:</span> {formData.keralaGovAccountNumber}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">IFSC CODE:</span> {formData.KerelaGovIfscCode}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">BANK NAME:</span> {formData.KerelaGovBankName}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">HELP LINE PHONE NUMBER:</span> {formData.helpLineNumber}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-xs italic text-red-500">
                    NOTE: Cash deposits are not accepted (online transaction is must for your bank account/transaction verification)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPreview && (
          <div className="flex justify-center mt-4">
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
          width: 700px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          position: relative;
          overflow: visible;
          font-family: Arial, sans-serif;
          min-height: 0;
        }
        .dark .print-card {
          background: #1f2937;
        }
        .stamp-paper {
          text-align: center;
          margin-bottom: 8px;
        }
        .stamp-image {
          width: 100%;
          max-width: 250px;
          height: auto;
        }
        .header {
          margin-bottom: 8px;
        }
        .header h1 {
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
          color: #F89406;
        }
        .header p {
          font-size: 12px;
          margin: 0;
          line-height: 1.2;
        }
        .header .font-bold {
          font-weight: bold;
        }
        .body {
          font-size: 12px;
          line-height: 1.3;
        }
        .body p {
          margin: 0 0 4px 0;
          word-break: break-words;
        }
        .body .font-bold {
          font-weight: bold;
        }
        .winner-details, .bank-details {
          margin-bottom: 8px;
        }
        .winner-details p, .bank-details p {
          margin: 0 0 2px 0;
          line-height: 1.2;
        }
      `}</style>
    </div>
  );
};

export default WinnerCertificate;