import React, { useState } from "react";
import { Download } from "lucide-react";

const SBILifeReceiptPDF = () => {
  const [formData, setFormData] = useState({
    customerName: "N Venkatesh",
    accountNumber: "XXXXXXX8856",
    amount: "504330/-",
    date: "22/08/2025",
    fromAccount: "XXXXXXX7367",
    neftRef: "264875152390",
    holdAmount: "7263/-",
  });

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generatePDF = async () => {
    // Create a temporary element for PDF generation
    const element = document.createElement("div");
    element.innerHTML = `
            <div style="
                max-width: 650px;
                margin: 0 auto;
                background: white;
                padding: 20px;
                font-family: Arial, sans-serif;
            ">
                <!-- Header with SBI Life Logo -->
                <div style="
                    text-align: center;
                    padding: 20px 0 15px;
                    background: white;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        margin-bottom: 5px;
                    ">
                        <div style="
                            width: 35px;
                            height: 35px;
                            background: linear-gradient(135deg, #00bcd4, #2196f3);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                            font-size: 18px;
                        ">i</div>
                        <span style="
                            font-size: 36px;
                            font-weight: bold;
                            color: #673ab7;
                            font-family: Arial, sans-serif;
                        ">SBI</span>
                        <span style="
                            font-size: 36px;
                            font-weight: bold;
                            color: #e91e63;
                            font-family: Arial, sans-serif;
                        ">Life</span>
                    </div>
                    <div style="
                        font-size: 14px;
                        color: #333;
                        font-style: italic;
                        margin-top: 2px;
                    ">Apne live. Apno ke liye.</div>
                </div>

                <!-- Black Divider Line -->
                <div style="
                    height: 2px;
                    background: #000;
                    margin: 20px 0 30px;
                "></div>

                <!-- Main Message -->
                <div style="
                    padding: 0 20px;
                    text-align: center;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #000;
                    margin-bottom: 60px;
                ">
                    Dear ${formData.customerName} Your a/c no- ${formData.accountNumber} is Credited INR ${formData.amount} on ${formData.date} by a/c- ${formData.fromAccount} (NEFT Ref.no ${formData.neftRef}) Balance is Hold with Insurance Charge Pay Only-${formData.holdAmount} This Balance Will Be Refund after Completing transaction.
                    <br><br>
                    Have a Nice day
                </div>

                <!-- Stamp and Barcode Section -->
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 40px;
                    margin: 40px 0 60px;
                ">
                    <!-- Managing Director Stamp -->
                    <div style="
                        width: 120px;
                        height: 120px;
                        border: 3px solid #9c27b0;
                        border-radius: 50%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        background: white;
                    ">
                        <div style="
                            font-size: 10px;
                            color: #9c27b0;
                            font-weight: bold;
                            text-align: center;
                            margin-bottom: 10px;
                        ">Managing Director</div>
                        <div style="
                            color: #9c27b0;
                            font-weight: bold;
                            font-size: 16px;
                            margin-bottom: 10px;
                        ">M.D.</div>
                        <!-- Signature Line -->
                        <div style="
                            position: absolute;
                            bottom: 25px;
                            right: 15px;
                            width: 40px;
                            height: 3px;
                            background: #9c27b0;
                            transform: rotate(-20deg);
                        "></div>
                    </div>

                    <!-- Barcode -->
                    <div style="
                        flex: 1;
                        text-align: center;
                        margin-left: 40px;
                    ">
                        <div style="
                            font-family: Courier New, monospace;
                            font-size: 24px;
                            letter-spacing: 1px;
                            color: #000;
                            line-height: 1;
                        ">||||| ||| ||||| | ||||| || ||| ||||| | ||| || ||||| ||| |||||</div>
                    </div>
                </div>

                <!-- LIC Footer Section -->
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0;
                    margin: 40px 0 30px;
                ">
                    <!-- Blue Box with Hands -->
                    <div style="
                        width: 140px;
                        height: 100px;
                        background: #1565c0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        border-radius: 4px;
                        position: relative;
                    ">
                        <!-- Hands icon representation -->
                        <div style="
                            width: 40px;
                            height: 30px;
                            border: 2px solid white;
                            border-radius: 50% 50% 0 0;
                            margin-bottom: 5px;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 8px;
                                height: 8px;
                                background: white;
                                border-radius: 50%;
                            "></div>
                        </div>
                        <div style="
                            font-size: 10px;
                            text-align: center;
                            line-height: 1.2;
                            font-weight: bold;
                        ">नियामक एवं विकास<br>प्राधिकरण</div>
                    </div>

                    <!-- Yellow LIC Box -->
                    <div style="
                        width: 140px;
                        height: 100px;
                        background: #ff9800;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #1565c0;
                        font-size: 48px;
                        font-weight: bold;
                        border-radius: 4px;
                    ">LIC</div>
                </div>

                <!-- Company Information -->
                <div style="
                    text-align: center;
                    margin-top: 20px;
                    padding-bottom: 20px;
                ">
                    <div style="
                        color: #1565c0;
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 8px;
                    ">भारतीय जीवन बीमा निगम</div>
                    <div style="
                        color: #1565c0;
                        font-size: 16px;
                        font-weight: bold;
                        letter-spacing: 2px;
                    ">LIFE INSURANCE CORPORATION OF INDIA</div>
                </div>
            </div>
        `;

    // Use html2canvas and jsPDF for PDF generation
    try {
      // Load html2canvas from CDN
      if (!window.html2canvas) {
        const script1 = document.createElement("script");
        script1.src =
          "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        document.head.appendChild(script1);

        await new Promise((resolve) => {
          script1.onload = resolve;
        });
      }

      // Load jsPDF from CDN
      if (!window.jsPDF) {
        const script2 = document.createElement("script");
        script2.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        document.head.appendChild(script2);

        await new Promise((resolve) => {
          script2.onload = resolve;
        });
      }

      // Add element to DOM temporarily
      element.style.position = "absolute";
      element.style.left = "-9999px";
      element.style.background = "white";
      document.body.appendChild(element);

      // Generate canvas from HTML
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Remove temporary element
      document.body.removeChild(element);

      // Create PDF
      const { jsPDF } = (window as any).jspdf;
      const pdf = new jsPDF("p", "mm", "a4");

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Download the PDF
      pdf.save("SBI_Life_Receipt.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback method - create downloadable HTML
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>SBI Life Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; background: white; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    ${element.innerHTML}
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SBI_Life_Receipt.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Edit Receipt Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Account
              </label>
              <input
                type="text"
                value={formData.fromAccount}
                onChange={(e) =>
                  handleInputChange("fromAccount", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NEFT Reference
              </label>
              <input
                type="text"
                value={formData.neftRef}
                onChange={(e) => handleInputChange("neftRef", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hold Amount
              </label>
              <input
                type="text"
                value={formData.holdAmount}
                onChange={(e) =>
                  handleInputChange("holdAmount", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center mb-6">
          <button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors shadow-md"
          >
            <Download size={20} />
            Download SBI Life Receipt PDF
          </button>
        </div>

        {/* Receipt Preview */}
        <div className="bg-white shadow-lg">
          <div className="max-w-2xl mx-auto bg-white p-5">
            {/* Header with SBI Life Logo */}
            <div className="text-center py-5 bg-white">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  i
                </div>
                <span className="text-4xl font-bold text-purple-700">SBI</span>
                <span className="text-4xl font-bold text-pink-600">Life</span>
              </div>
              <div className="text-sm text-gray-600 italic mt-1">
                Apne live. Apno ke liye.
              </div>
            </div>

            {/* Black Divider Line */}
            <div className="h-0.5 bg-black mx-0 mb-8"></div>

            {/* Main Message */}
            <div className="px-5 text-center text-base leading-relaxed text-black mb-16">
              Dear {formData.customerName} Your a/c no- {formData.accountNumber}{" "}
              is Credited INR {formData.amount} on {formData.date} by a/c-{" "}
              {formData.fromAccount} (NEFT Ref.no {formData.neftRef}) Balance is
              Hold with Insurance Charge Pay Only-{formData.holdAmount} This
              Balance Will Be Refund after Completing transaction.
              <br />
              <br />
              Have a Nice day
            </div>

            {/* Stamp and Barcode Section */}
            <div className="flex justify-between items-center px-10 mb-16">
              {/* Managing Director Stamp */}
              <div className="w-32 h-15 border-4 border-purple-600 rounded-full flex flex-col items-center justify-center bg-white relative">
                <div className="text-xs text-purple-600 font-bold text-center mb-2">
                  Managing Director
                </div>
                <div className="text-purple-600 font-bold text-lg mb-2">
                  M.D.
                </div>
                {/* Signature Line */}
                <div className="absolute bottom-6 right-4 w-10 h-1 bg-purple-600 transform -rotate-12"></div>
              </div>

              {/* Barcode */}
              <div className="flex-1 text-center ml-10">
                <div className="font-mono text-1xl tracking-wide text-black leading-none">
                  |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
                </div>
              </div>
            </div>

            {/* LIC Footer Section */}
            <div className="flex justify-center items-center gap-0 mb-8">
              {/* Blue Box with Symbol */}
              <div className="w-36 h-24 bg-blue-700 flex flex-col items-center justify-center text-white rounded">
                {/* Simple hands representation */}
                <div className="w-10 h-7 border-2 border-white rounded-t-full mb-1 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="text-xs text-center leading-tight font-bold">
                  नियामक एवं विकास
                  <br />
                  प्राधिकरण
                </div>
              </div>

              {/* Yellow LIC Box */}
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
      </div>
    </div>
  );
};

export default SBILifeReceiptPDF;
