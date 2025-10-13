import { Copy, Image } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../api/apiClient"; // Adjust path as needed

interface QRCodeData {
  id: number;
  phone: string | null;
  image: { public_id: string; secure_url: string } | null;
  createdAt: string;
  updatedAt: string;
}

export default function UserQRCodePayment() {
  const [qrCode, setQrCode] = useState<QRCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Fetch QR code data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const qrResponse = await api.get("/v1/qr/get");
        setQrCode(qrResponse.data.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.info("QR Code not found. Please contact support.");
        } else {
          toast.error(
            error.response?.data?.message || "Failed to fetch QR Code"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle copying phone number to clipboard
  const handleCopy = () => {
    if (qrCode?.phone) {
      navigator.clipboard.writeText(qrCode.phone);
      setCopied(true);
      toast.success("Phone number copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6 lg:py-8 flex justify-center">
        <div className="animate-spin rounded-full h-6 sm:h-8 md:h-10 lg:h-12 w-6 sm:w-8 md:w-10 lg:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6 lg:py-8">
      <div className="bg-white shadow-lg rounded-lg sm:rounded-xl p-2 sm:p-4 md:p-6 lg:p-8">
        {/* Header */}
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold text-blue-600 mb-2 sm:mb-4 md:mb-6 flex items-center">
          <Image className="w-4 sm:w-5 md:w-6 lg:w-6 h-4 sm:h-5 md:h-6 lg:h-6 mr-1 sm:mr-2" />
          Payment Details
        </h2>

        {/* QR Code and Phone Number Container */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 md:gap-6">
          {/* QR Code Section */}
          <div className="w-full sm:w-1/2 text-center">
            <p className="text-blue-600 font-medium mb-1 sm:mb-2">
              Scan to Pay
            </p>
            {qrCode?.image?.secure_url ? (
              <img
                src={qrCode.image.secure_url}
                alt="Payment QR Code"
                className="w-48 sm:w-56 md:w-64 lg:w-64 h-48 sm:h-56 md:h-64 lg:h-64 object-contain mx-auto rounded-lg border border-blue-200"
              />
            ) : (
              <div className="w-48 sm:w-56 md:w-64 lg:w-64 h-48 sm:h-56 md:h-64 lg:h-64 mx-auto flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500 text-sm sm:text-base">
                  No QR Code Available
                </p>
              </div>
            )}
          </div>

          {/* Phone Number Section */}
          <div className="w-full sm:w-1/2 text-center sm:text-left">
            <p className="text-blue-600 font-medium mb-1 sm:mb-2">
              Pay to this Number
            </p>
            <div className="flex items-center justify-center sm:justify-start mb-2 sm:mb-4">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold text-gray-800 bg-blue-50 p-1 sm:p-2 md:p-2 lg:p-2 rounded-l-md">
                {qrCode?.phone || "Not provided"}
              </p>
              {qrCode?.phone && (
                <button
                  onClick={handleCopy}
                  className="bg-blue-600 text-white p-1 sm:p-2 md:p-2 lg:p-2 rounded-r-md hover:bg-blue-700 transition-colors flex items-center"
                  disabled={copied}
                >
                  <Copy className="w-4 sm:w-5 md:w-5 lg:w-5 h-4 sm:h-5 md:h-5 lg:h-5" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Instruction */}
        <p className="text-blue-600 text-xs sm:text-sm md:text-sm lg:text-sm mt-2 sm:mt-4 md:mt-6 text-center">
          Scan the QR code or use the phone number to complete your payment.
        </p>
      </div>
    </div>
  );
}
