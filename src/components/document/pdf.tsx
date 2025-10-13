

import html2pdf from 'html2pdf.js';
import { Download, FileText, CheckCircle, Stamp } from 'lucide-react';

const LoanApprovalLetter = () => {
    const downloadPDF = () => {
        const element = document.getElementById('loan-approval-content');
        const opt = {
            margin: [10, 10, 10, 10] as [number, number, number, number],
            filename: 'Loan_Approval_Letter.pdf',
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        if (element) {
            html2pdf().set(opt).from(element).save();
        } else {
            console.error('Element with id "loan-approval-content" not found.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-2xl">
            {/* Download Button */}
            <div className="no-print p-4 bg-gray-50 border-b flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Loan Approval Letter</h1>
                <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Download size={20} />
                    Download PDF
                </button>
            </div>

            <div id="loan-approval-content" className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 text-white p-2 rounded-full">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-blue-600">dhani</h1>
                            <div className="text-xs text-gray-600 mt-1">FINANCE PVT LTD.</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
                            RBI
                        </div>
                        <div className="text-right">
                            <div className="w-16 h-16 bg-gray-200 border-2 border-gray-400 flex items-center justify-center text-xs">
                                QR CODE
                            </div>
                            <div className="text-xs mt-1 text-gray-600">UNIQUE CODE</div>
                            <div className="text-xs font-semibold">25 MAY, 2024</div>
                        </div>
                    </div>
                </div>

                {/* Title Bar */}
                <div className="bg-blue-600 text-white text-center py-2 mb-6">
                    <span className="font-bold text-sm">LOAN APPROVAL LETTER</span>
                </div>

                {/* Branch Office Details */}
                <div className="mb-6 text-sm">
                    <div><strong>Br Office:</strong></div>
                    <div>Park Ch Plaza, H.o.k 25/324/1, Road</div>
                    <div>Number 1, Dwarkaspuri, Begdaka Hills,</div>
                    <div>Hyderabad, Telangana 500034</div>
                </div>

                {/* Contact Details */}
                <div className="mb-6 text-sm">
                    <div><strong>PHONE:</strong> 39850012348</div>
                    <div><strong>CITY:</strong> ANDHRA PRADESH</div>
                    <div><strong>Contact us:</strong> care@dhani-loans.com</div>
                    <div><strong>Dear :</strong> NAGAV RAJESH</div>
                </div>

                {/* Main Content */}
                <div className="mb-6 text-sm leading-relaxed">
                    <p>
                        <strong>Dhani Finance Ltd acknowledges you.</strong> We are Please to inform you that your application for amount of Rs.50000 has
                        been activated. The information mentioned by you has been investigated secretly by the company team through
                        online verification/PAN no/Voter card & Aadhar card (s.below). Application detail below.
                    </p>
                </div>

                {/* Details Table */}
                <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
                    <tbody>
                        <tr>
                            <td className="border border-gray-400 p-2 font-semibold bg-gray-50">Reference No.</td>
                            <td className="border border-gray-400 p-2">Dhani/100295436</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-400 p-2 font-semibold bg-gray-50">Application No.</td>
                            <td className="border border-gray-400 p-2">Dhani/100296523</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-400 p-2 font-semibold bg-gray-50">Bank Name</td>
                            <td className="border border-gray-400 p-2">STATE BANK OF INDIA</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-400 p-2 font-semibold bg-gray-50">Account No.</td>
                            <td className="border border-gray-400 p-2">624569356914</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-400 p-2 font-semibold bg-gray-50">IFSC code.</td>
                            <td className="border border-gray-400 p-2">NEFT TRANSFER</td>
                        </tr>
                    </tbody>
                </table>

                {/* EMI and Loan Details */}
                <div className="bg-green-50 border border-green-300 p-4 mb-6">
                    <h3 className="text-center text-lg font-bold text-green-800 mb-3">
                        EMI AND LOAN AMOUNT APPROVED
                    </h3>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                            <div className="font-semibold">EMI-4905</div>
                            <div>LOAN AMOUNT-50000</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">TENURE-12</div>
                        </div>
                        <div className="text-center">
                            <div className="font-semibold">INTEREST RATE: 5.9%</div>
                        </div>
                    </div>

                    <div className="bg-red-100 border border-red-300 p-2 mt-3 text-center text-xs">
                        <strong>NOTE:</strong> AGREEMENT BEFORE EMI RS.3870 IS COMPLETELY DUE IN ADVANCE & PROCESSING DAYS.
                    </div>
                </div>

                {/* Account Details */}
                <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
                    <tbody>
                        <tr>
                            <td className="border border-gray-400 p-2 font-semibold bg-gray-50">Account holder Name</td>
                            <td className="border border-gray-400 p-2">DHANI FINANCE Pvt. Ltd.</td>
                            <td className="border border-gray-400 p-2 font-semibold bg-gray-50">BANK</td>
                            <td className="border border-gray-400 p-2">BANK OF INDIA</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-400 p-2 font-semibold bg-gray-50">ACCOUNT Number</td>
                            <td className="border border-gray-400 p-2">310012013148517</td>
                            <td className="border border-gray-400 p-2 font-semibold bg-gray-50">IFSC CODE</td>
                            <td className="border border-gray-400 p-2">BKID0003102</td>
                        </tr>
                    </tbody>
                </table>

                {/* Payment Mode */}
                <div className="mb-6 text-xs">
                    <div><strong>PAYMENT MODE:</strong> You can make Payment Through NEFT/RTGS/IMPS/UPI/Net Banking and other payment mode.</div>
                    <div><strong>NOTE:</strong> CASH DEPOSITS ARE NOT ALLOWED AS PER COMPANY RULES AND REGULATIONS.</div>
                </div>

                {/* Signature Section */}
                <div className="flex justify-between items-end mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-red-600 flex items-center justify-center bg-red-50">
                                <Stamp className="text-red-600" size={24} />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600">
                                LOAN APPROVED
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="mb-2 text-sm italic">Yours faithfully</div>
                        <div className="mb-4">
                            <div className="text-lg font-bold">Dhani Finance Ltd</div>
                            <div className="w-32 h-0.5 bg-black mb-2"></div>
                        </div>
                        <div className="text-sm">
                            <div className="font-semibold">P Harish Reddy</div>
                            <div>(Chief Executive Officer)</div>
                        </div>
                    </div>
                </div>

                {/* Approval Stamp */}
                <div className="flex justify-end mt-4 mb-4">
                    <div className="bg-green-600 text-white px-4 py-2 rounded transform -rotate-12 font-bold text-sm flex items-center">
                        <CheckCircle className="inline mr-1" size={16} />
                        LOAN APPROVED
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-8 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">dhani services</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanApprovalLetter;
