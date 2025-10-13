import React from "react";

// Extend the Window interface to include html2canvas
declare global {
  interface Window {
    html2canvas?: any;
    jsPDF?: any;
  }
}
import { Download } from "lucide-react";

const CTSDocumentPDF = () => {
  const generatePDF = async () => {
    // Create a temporary element for PDF generation
    const element = document.createElement("div");
    element.innerHTML = `
            <div style="
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border: 2px solid #000;
                position: relative;
                font-family: Arial, sans-serif;
            ">
                <!-- Header Section -->
                <div style="
                    background: #e53e3e;
                    padding: 8px;
                    text-align: center;
                ">
                    <div style="
                        color: white;
                        font-size: 28px;
                        font-weight: bold;
                        letter-spacing: 3px;
                    ">CTS</div>
                </div>
                
                <div style="
                    background: #2d3748;
                    padding: 12px;
                    text-align: center;
                    position: relative;
                ">
                    <div style="
                        color: #e53e3e;
                        font-size: 18px;
                        font-weight: bold;
                        letter-spacing: 2px;
                    ">CHEQUE</div>
                    <div style="
                        color: #e53e3e;
                        font-size: 18px;
                        font-weight: bold;
                        letter-spacing: 2px;
                        margin-top: 2px;
                    ">TRUNCATION SYSTEM</div>
                    <div style="
                        position: absolute;
                        right: 15px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #48bb78;
                        font-size: 14px;
                        font-weight: bold;
                        font-style: italic;
                    ">SuccessCTS</div>
                </div>
                
                <!-- Address -->
                <div style="
                    text-align: center;
                    padding: 15px;
                    font-size: 14px;
                    font-weight: bold;
                    border-bottom: 1px solid #000;
                ">
                    Main Building, P.O. Box-901, Shahid Bhagat Singh Road, Mumbai-400001
                </div>
                
                <!-- Date -->
                <div style="
                    text-align: right;
                    padding: 15px 20px 10px;
                    font-size: 14px;
                    font-weight: bold;
                ">
                    Date-05/09/2025 at<br>
                    11:16:13 AM
                </div>
                
                <!-- Main Content -->
                <div style="
                    padding: 20px;
                    position: relative;
                    min-height: 600px;
                ">
                    <!-- Watermark -->
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-15deg);
                        font-size: 120px;
                        color: rgba(200, 200, 200, 0.3);
                        font-weight: bold;
                        z-index: 1;
                        pointer-events: none;
                        white-space: nowrap;
                    ">RBI</div>
                    
                    <!-- Fully Insured Stamp -->
                    <div style="
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        border: 3px solid #48bb78;
                        background: white;
                        padding: 8px 15px;
                        font-weight: bold;
                        color: #48bb78;
                        text-align: center;
                        transform: rotate(5deg);
                        z-index: 3;
                    ">
                        <div>FULLY</div>
                        <div>INSURED</div>
                        <div style="font-size: 10px; margin-top: 3px;">FOR YOUR PROTECTION</div>
                    </div>
                    
                    <div style="
                        position: relative;
                        z-index: 2;
                        font-size: 14px;
                        line-height: 1.6;
                    ">
                        <div style="margin-bottom: 20px;">
                            <strong>To,</strong>
                        </div>
                        
                        <div style="margin: 10px 0; line-height: 1.8;">
                            <div><strong>Komal Kumar</strong></div>
                            <div><strong>Raja Sharma</strong></div>
                            <div><strong>Aadhar No. 222316948849</strong></div>
                            <div><strong>Bank Account No. 55555555555</strong></div>
                        </div>
                        
                        <div style="margin: 20px 0; font-weight: bold;">
                            <strong>Subject: For transferring Amount of INR 5,00,000.00/- along with submitted amount of INR 5,000.00/-</strong>
                        </div>
                        
                        <div style="margin: 20px 0 30px; font-weight: bold;">
                            <strong>Dear Sir</strong>
                        </div>
                        
                        <div style="margin: 20px 0; text-align: justify; line-height: 1.7;">
                            As per as, your Loan Amount had been sanctioned INR 5,00,000.00 and submitted amount INR 5,000.00 (Total transferable amount is INR 5,05,000.00/-). Your Loan Amount will be transferring in given Bank Account of . , A/c No 55555555555. Your Loan Amount is transferring from Mumbai Branch through All Finance, Bank Name . to given Bank A/c No 55555555555 . . Your Loan Amount had on hold, due to rule & Regulation of Fund Transferring from One State to other State you have submit CTS Charge of INR 5000/-.
                        </div>
                        
                        <div style="margin: 30px 0; line-height: 1.7; text-align: justify;">
                            Kindly submit your CTS LATE FINE Charge Amount as soon as possible for releasing your loan amount along with submitted amount. (CTS LATE FINE amount will be refundable within 00:30 Hrs)
                        </div>
                        
                        <!-- CC Section -->
                        <div style="margin: 40px 0 20px;">
                            <div style="font-weight: bold; text-decoration: underline; margin-bottom: 10px;">Cc to:</div>
                            <ul style="list-style: disc; margin-left: 30px; line-height: 1.8;">
                                <li>MD, Akash Verma</li>
                                <li>Accountant, Anil pariapti</li>
                                <li>CMO, Maharashtra</li>
                                <li>CMO, Haryana</li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Footer Section -->
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        margin-top: 60px;
                        padding: 20px 0;
                    ">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="
                                    width: 80px;
                                    height: 80px;
                                    background: linear-gradient(135deg, #48bb78, #38a169);
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: white;
                                    font-size: 24px;
                                    font-weight: bold;
                                ">CTS</div>
                                <div style="flex: 1;">
                                    <div style="
                                        font-size: 18px;
                                        font-weight: bold;
                                        color: #2d3748;
                                        margin-bottom: 5px;
                                    ">Smart Business Solutions</div>
                                </div>
                            </div>
                            <div style="
                                background: #48bb78;
                                color: white;
                                padding: 8px 15px;
                                text-align: center;
                                margin-top: 10px;
                                font-weight: bold;
                                font-size: 12px;
                            ">
                                TAXES & ACCOUNTING<br>
                                SERVICES
                            </div>
                        </div>
                        
                        <div style="text-align: right; flex-shrink: 0; margin-left: 40px;">
                            <div style="margin-bottom: 10px;">
                                <div style="font-weight: bold; margin-bottom: 5px;">Thanks & Regards</div>
                                <div style="font-weight: bold; margin: 5px 0;">A S Ramasastri</div>
                                <div style="font-size: 12px; margin: 2px 0;">Member Secretary</div>
                                <div style="font-size: 12px; margin: 2px 0;">Reserve Bank of India</div>
                                <div style="
                                    width: 100px;
                                    height: 30px;
                                    margin: 10px auto 5px;
                                    border-bottom: 2px solid #000;
                                "></div>
                                <div style="font-size: 10px; margin-top: 5px;">(A S Ramasastri)<br>Member Secretary</div>
                            </div>
                        </div>
                    </div>
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
      const { jsPDF } = window.jsPDF;
      const pdf = new jsPDF("p", "mm", "a4");

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save("CTS_Document.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback method - create downloadable HTML
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>CTS Cheque Truncation System Document</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: white; }
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
      a.download = "CTS_Document.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Download Button */}
        <div className="text-center mb-6 no-print">
          <button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors shadow-md"
          >
            <Download size={20} />
            Download CTS Document PDF
          </button>
        </div>

        {/* Document Preview */}
        <div id="cts-content" className="bg-white shadow-2xl">
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              background: "white",
              border: "2px solid #000",
              position: "relative",
            }}
          >
            {/* Header Section */}
            <div
              style={{
                background: "#e53e3e",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "white",
                  fontSize: "28px",
                  fontWeight: "bold",
                  letterSpacing: "3px",
                }}
              >
                CTS
              </div>
            </div>

            <div
              style={{
                background: "#2d3748",
                padding: "12px",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  color: "#e53e3e",
                  fontSize: "18px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                }}
              >
                CHEQUE
              </div>
              <div
                style={{
                  color: "#e53e3e",
                  fontSize: "18px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  marginTop: "2px",
                }}
              >
                TRUNCATION SYSTEM
              </div>
              <div
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#48bb78",
                  fontSize: "14px",
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                SuccessCTS
              </div>
            </div>

            {/* Address */}
            <div
              style={{
                textAlign: "center",
                padding: "15px",
                fontSize: "14px",
                fontWeight: "bold",
                borderBottom: "1px solid #000",
              }}
            >
              Main Building, P.O. Box-901, Shahid Bhagat Singh Road,
              Mumbai-400001
            </div>

            {/* Date */}
            <div
              style={{
                textAlign: "right",
                padding: "15px 20px 10px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Date-05/09/2025 at
              <br />
              11:16:13 AM
            </div>

            {/* Main Content */}
            <div
              style={{
                padding: "20px",
                position: "relative",
                minHeight: "600px",
              }}
            >
              {/* Watermark */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-15deg)",
                  fontSize: "120px",
                  color: "rgba(200, 200, 200, 0.3)",
                  fontWeight: "bold",
                  zIndex: 1,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                RBI
              </div>

              {/* Fully Insured Stamp */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  border: "3px solid #48bb78",
                  background: "white",
                  padding: "8px 15px",
                  fontWeight: "bold",
                  color: "#48bb78",
                  textAlign: "center",
                  transform: "rotate(5deg)",
                  zIndex: 3,
                }}
              >
                <div>FULLY</div>
                <div>INSURED</div>
                <div
                  style={{
                    fontSize: "10px",
                    marginTop: "3px",
                  }}
                >
                  FOR YOUR PROTECTION
                </div>
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <strong>To,</strong>
                </div>

                <div
                  style={{
                    margin: "10px 0",
                    lineHeight: 1.8,
                  }}
                >
                  <div>
                    <strong>Komal Kumar</strong>
                  </div>
                  <div>
                    <strong>Raja Sharma</strong>
                  </div>
                  <div>
                    <strong>Aadhar No. 222316948849</strong>
                  </div>
                  <div>
                    <strong>Bank Account No. 55555555555</strong>
                  </div>
                </div>

                <div
                  style={{
                    margin: "20px 0",
                    fontWeight: "bold",
                  }}
                >
                  <strong>
                    Subject: For transferring Amount of INR 5,00,000.00/- along
                    with submitted amount of INR 5,000.00/-
                  </strong>
                </div>

                <div
                  style={{
                    margin: "20px 0 30px",
                    fontWeight: "bold",
                  }}
                >
                  <strong>Dear Sir</strong>
                </div>

                <div
                  style={{
                    margin: "20px 0",
                    textAlign: "justify",
                    lineHeight: 1.7,
                  }}
                >
                  As per as, your Loan Amount had been sanctioned INR
                  5,00,000.00 and submitted amount INR 5,000.00 (Total
                  transferable amount is INR 5,05,000.00/-). Your Loan Amount
                  will be transferring in given Bank Account of . , A/c No
                  55555555555. Your Loan Amount is transferring from Mumbai
                  Branch through All Finance, Bank Name . to given Bank A/c No
                  55555555555 . . Your Loan Amount had on hold, due to rule &
                  Regulation of Fund Transferring from One State to other State
                  you have submit CTS Charge of INR 5000/-.
                </div>

                <div
                  style={{
                    margin: "30px 0",
                    lineHeight: 1.7,
                    textAlign: "justify",
                  }}
                >
                  Kindly submit your CTS LATE FINE Charge Amount as soon as
                  possible for releasing your loan amount along with submitted
                  amount. (CTS LATE FINE amount will be refundable within 00:30
                  Hrs)
                </div>

                {/* CC Section */}
                <div style={{ margin: "40px 0 20px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                      marginBottom: "10px",
                    }}
                  >
                    Cc to:
                  </div>
                  <ul
                    style={{
                      listStyle: "disc",
                      marginLeft: "30px",
                      lineHeight: 1.8,
                    }}
                  >
                    <li>MD, Akash Verma</li>
                    <li>Accountant, Anil pariapti</li>
                    <li>CMO, Maharashtra</li>
                    <li>CMO, Haryana</li>
                  </ul>
                </div>
              </div>

              {/* Footer Section */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginTop: "60px",
                  padding: "20px 0",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "linear-gradient(135deg, #48bb78, #38a169)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      CTS
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#2d3748",
                          marginBottom: "5px",
                        }}
                      >
                        Smart Business Solutions
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#48bb78",
                      color: "white",
                      padding: "8px 15px",
                      textAlign: "center",
                      marginTop: "10px",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    TAXES & ACCOUNTING
                    <br />
                    SERVICES
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "right",
                    flexShrink: 0,
                    marginLeft: "40px",
                  }}
                >
                  <div style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "5px",
                      }}
                    >
                      Thanks & Regards
                    </div>
                    <div
                      style={{
                        fontWeight: "bold",
                        margin: "5px 0",
                      }}
                    >
                      A S Ramasastri
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        margin: "2px 0",
                      }}
                    >
                      Member Secretary
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        margin: "2px 0",
                      }}
                    >
                      Reserve Bank of India
                    </div>
                    <div
                      style={{
                        width: "100px",
                        height: "30px",
                        margin: "10px auto 5px",
                        borderBottom: "2px solid #000",
                      }}
                    ></div>
                    <div
                      style={{
                        fontSize: "10px",
                        marginTop: "5px",
                      }}
                    >
                      (A S Ramasastri)
                      <br />
                      Member Secretary
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTSDocumentPDF;
