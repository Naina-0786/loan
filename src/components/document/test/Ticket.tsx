import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Printer, AlertCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const LotteryTicketGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    state: '',
    price: '',
    dateTime: new Date().toISOString().slice(0, 16), // Initialize with current date-time
  });

  const [tickets, setTickets] = useState<string[]>(['']);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTicketChange = (index: number, value: string) => {
    const newTickets = [...tickets];
    newTickets[index] = value;
    setTickets(newTickets);
  };

  const addTicket = () => {
    setTickets([...tickets, '']);
  };

  const removeTicket = (index: number) => {
    if (tickets.length > 1) {
      const newTickets = tickets.filter((_, i) => i !== index);
      setTickets(newTickets);
    }
  };

  const handleGeneratePreview = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!formData.name) errors.push('Name is required.');
    if (!formData.mobile) errors.push('Mobile number is required.');
    if (!formData.email) errors.push('Email is required.');
    if (!formData.state) errors.push('State is required.');
    if (!formData.price) errors.push('Price is required.');
    if (!formData.dateTime) errors.push('Date and time is required.');

    const validTickets = tickets.filter(ticket => ticket.trim() !== '');
    if (validTickets.length === 0) errors.push('At least one ticket number is required.');

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
        filename: `Ticket_${formData.mobile}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          width: 800,
          windowWidth: 800 // Ensure consistent rendering
        },
        jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
      };

      // Inline styles for PDF to ensure barcode renders
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
                .barcode {
                    width: 200px;
                    height: 40px;
                    background: repeating-linear-gradient(
                        90deg,
                        #000 0px,
                        #000 2px,
                        transparent 2px,
                        transparent 4px
                    );
                    border: 1px solid #000;
                }
            `;
      printRef.current.appendChild(styleElement);

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          // Remove temporary style after PDF generation
          if (styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
          }
        })
        .catch((err: unknown) => console.error("PDF generation failed:", err));
    }
  };

  const validTickets = tickets.filter(ticket => ticket.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
          Kerala State Lottery Ticket Generator
        </h1>

        {!showPreview ? (
          <Card className="bg-white shadow-xl border-2 border-orange-200">
            <CardContent className="p-6">
              <form onSubmit={handleGeneratePreview}>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-orange-600 mb-4">Personal Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-orange-200 focus:border-orange-400 text-black"
                      />
                      {formErrors.includes('Name is required.') && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Name is required.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-gray-700 font-medium">Mobile Number</Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        placeholder="Enter mobile number"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="border-orange-200 focus:border-orange-400 text-black"
                      />
                      {formErrors.includes('Mobile number is required.') && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Mobile number is required.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-orange-200 focus:border-orange-400 text-black"
                      />
                      {formErrors.includes('Email is required.') && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Email is required.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-gray-700 font-medium">State</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="Enter your state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="border-orange-200 focus:border-orange-400 text-black"
                      />
                      {formErrors.includes('State is required.') && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          State is required.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-gray-700 font-medium">Total Price (₹)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="Enter total price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="border-orange-200 focus:border-orange-400 text-black"
                      />
                      {formErrors.includes('Price is required.') && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Price is required.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateTime" className="text-gray-700 font-medium">Date and Time</Label>
                      <Input
                        id="dateTime"
                        name="dateTime"
                        type="datetime-local"
                        value={formData.dateTime}
                        onChange={handleInputChange}
                        className="border-orange-200 focus:border-orange-400 text-black"
                      />
                      {formErrors.includes('Date and time is required.') && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Date and time is required.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ticket Numbers */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-orange-600">Ticket Numbers</h3>
                      <Button
                        type="button"
                        onClick={addTicket}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Ticket
                      </Button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {tickets.map((ticket, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder={`Ticket ${index + 1} number`}
                            value={ticket}
                            onChange={(e) => handleTicketChange(index, e.target.value)}
                            className="border-orange-200 focus:border-orange-400 text-black"
                          />
                          {tickets.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeTicket(index)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                              size="sm"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {formErrors.includes('At least one ticket number is required.') && (
                      <p className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        At least one ticket number is required.
                      </p>
                    )}
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Total Tickets:</strong> {validTickets.length}
                      </p>
                      {formData.price && (
                        <p className="text-sm text-gray-600">
                          <strong>Total Amount:</strong> ₹{parseFloat(formData.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-center">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-lg text-lg"
                  >
                    Generate Lottery Tickets
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">Generated Lottery Tickets</h2>
              <Button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg mb-6"
              >
                <Printer className="h-5 w-5 mr-2" />
                Download PDF
              </Button>
            </div>
            <div ref={printRef} className="print-container">
              <div className="lottery-ticket">
                {/* Header */}
                <div className="ticket-header">
                  <h1>KERALA STATE LOTTERY</h1>
                </div>

                {/* Prize Section */}
                <div className="prize-section">
                  <div className="prize-left">
                    <div className="second-prize">
                      <span className="prize-label">2nd Prize</span>
                      <span className="prize-amount">₹10<br />CR</span>
                      <span className="common-text">COMMON TO<br />ALL SERIES</span>
                    </div>
                  </div>

                  <div className="first-prize">
                    <span className="prize-label">1st<br />Prize</span>
                    <span className="prize-amount">25<span className="cr">CR</span></span>
                    <span className="common-text">COMMON TO<br />ALL SERIES</span>
                  </div>

                  <div className="prize-right">
                    <div className="third-prize">
                      <span className="prize-label">3rd<br />Prize</span>
                      <span className="prize-amount">3<span className="cr">CR</span></span>
                    </div>
                    <div className="ticket-info">
                      <div className="qr-placeholder">
                        <div className="qr-code"></div>
                      </div>
                      <div className="director">
                        DIRECTOR<br />
                        KERALA STATE<br />
                        LOTTERIES
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barcode and Date */}
                <div className="barcode-section">
                  <div className="barcode"></div>
                  <div className="date-section">
                    <span className="date-label">DATE OF DRAW</span>
                    <span className="date-value">
                      {new Date(formData.dateTime).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* User Information */}
                <div className="user-info">
                  <div className="info-grid">
                    <div><strong>Name:</strong> {formData.name}</div>
                    <div><strong>Mobile:</strong> {formData.mobile}</div>
                    <div><strong>Email:</strong> {formData.email}</div>
                    <div><strong>State:</strong> {formData.state}</div>
                    <div><strong>Price:</strong> ₹{formData.price}</div>
                    <div><strong>Date & Time:</strong> {new Date(formData.dateTime).toLocaleString()}</div>
                  </div>
                  <div className="tickets-section">
                    <strong>Tickets:</strong>
                    <div className="tickets-grid">
                      {validTickets.map((ticketNumber, index) => (
                        <div key={index} className="ticket-item">
                          {ticketNumber}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="contact-info">
                  <div className="info-grid">
                    <div><strong>Website:</strong> https://keralastatemegajackpot.com</div>
                    <div><strong>Phone:</strong> 8210277966</div>
                    <div><strong>Email:</strong> support@megakeralalotttery.com</div>
                  </div>
                </div>

                {/* Currency Note */}
                {/* <div className="currency-note">
                  <div className="note-content">
                    <div className="note-text">
                      भारतीय गैर न्यायिक<br />
                      पांच हजार<br />
                      ₹ 5000<br />
                      भारत INDIA
                    </div>
                    <div className="note-symbol">🏛️</div>
                    <div className="note-text-right">
                      Rs.5000<br />
                      FIVE<br />
                      THOUSAND<br />
                      RUPEES<br />
                      INDIA NON JUDICIAL
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="text-center mt-6">
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Back to Form
              </Button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .print-container {
          background: white;
        }
        
        .lottery-ticket {
          width: 800px;
          height: auto;
          margin: 20px auto;
          background: linear-gradient(135deg, #f8f4e6 0%, #fff 100%);
          border: 2px solid #ddd;
          font-family: Arial, sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        .ticket-header {
          background: #2c3e50;
          color: white;
          text-align: center;
          padding: 15px;
        }
        
        .ticket-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 2px;
        }
        
        .prize-section {
          display: flex;
          align-items: stretch;
          background: linear-gradient(45deg, #ff6b35, #f7931e, #ffd700);
          min-height: 200px;
          position: relative;
        }
        
        .prize-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .second-prize {
          text-align: center;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .second-prize .prize-label {
          display: block;
          font-size: 18px;
          font-weight: bold;
        }
        
        .second-prize .prize-amount {
          display: block;
          font-size: 48px;
          font-weight: 900;
          line-height: 0.8;
          margin: 10px 0;
        }
        
        .second-prize .common-text {
          display: block;
          font-size: 12px;
          font-weight: bold;
        }
        
        .first-prize {
          flex: 1.5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #2c3e50;
          color: #ffd700;
          text-align: center;
          margin: 20px 0;
          border-radius: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
          position: relative;
          z-index: 2;
        }
        
        .first-prize .prize-label {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .first-prize .prize-amount {
          font-size: 72px;
          font-weight: 900;
          line-height: 0.8;
        }
        
        .first-prize .cr {
          font-size: 48px;
        }
        
        .first-prize .common-text {
          font-size: 14px;
          font-weight: bold;
          margin-top: 10px;
        }
        
        .prize-right {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .third-prize {
          background: #e67e22;
          color: white;
          text-align: center;
          padding: 20px;
          border-radius: 15px;
          margin: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .third-prize .prize-label {
          display: block;
          font-size: 16px;
          font-weight: bold;
        }
        
        .third-prize .prize-amount {
          display: block;
          font-size: 36px;
          font-weight: 900;
          margin-top: 5px;
        }
        
        .third-prize .cr {
          font-size: 24px;
        }
        
        .ticket-info {
          background: #ecf0f1;
          flex: 1;
          padding: 10px;
          margin: 10px;
          border-radius: 10px;
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 10px;
        }
        
        .qr-placeholder {
          display: flex;
          justify-content: center;
        }
        
        .qr-code {
          width: 80px;
          height: 80px;
          background: #000;
          position: relative;
        }
        
        .qr-code::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSIyOCIgeT0iNCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iNCIgeT0iMjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=');
          background-size: contain;
        }
        
        .director {
          text-align: center;
          font-size: 12px;
          font-weight: bold;
          color: #2c3e50;
          margin-top: auto;
        }
        
        .barcode-section {
          background: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 2px solid #ddd;
        }
        
        .barcode {
          width: 200px;
          height: 40px;
          background: repeating-linear-gradient(
            90deg,
            #000 0px,
            #000 2px,
            transparent 2px,
            transparent 4px
          );
          border: 1px solid #000;
        }
        
        .date-section {
          text-align: right;
        }
        
        .date-label {
          display: block;
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .date-value {
          display: block;
          font-size: 14px;
          color: #7f8c8d;
          margin-top: 5px;
        }
        
        .user-info {
          background: #f8f9fa;
          padding: 20px;
          border\top: 2px solid #ddd;
        }
        
        .contact-info {
          background: #f8f9fa;
          padding: 20px;
          border-top: 2px solid #ddd;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .info-grid div {
          color: #2c3e50;
        }
        
        .info-grid strong {
          color: #e74c3c;
        }

        .tickets-section {
          margin-top: 20px;
        }

        .tickets-section strong {
          display: block;
          margin-bottom: 10px;
          color: #e74c3c;
          font-size: 14px;
        }

        .tickets-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          padding: 10px;
          border: 2px solid #ff0000;
          border-radius: 10px;
        }

        .ticket-item {
          color: #ff0000;
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          padding: 5px;
        }
        
        .currency-note {
          background: linear-gradient(135deg, #ffc0cb, #ffb6c1);
          margin: 20px;
          border-radius: 15px;
          border: 2px solid #d63384;
          overflow: hidden;
        }
        
        .note-content {
          display: flex;
          align-items: center;
          padding: 15px;
          color: #721c24;
        }
        
        .note-text {
          flex: 1;
          font-size: 12px;
          font-weight: bold;
          text-align: left;
        }
        
        .note-symbol {
          font-size: 32px;
          margin: 0 20px;
        }
        
        .note-text-right {
          flex: 1;
          font-size: 12px;
          font-weight: bold;
          text-align: right;
        }
        
        @media print {
          .lottery-ticket {
            width: 100%;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LotteryTicketGenerator;