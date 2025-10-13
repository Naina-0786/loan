import { create } from "zustand";
import api from "../api/apiClient";
import { toast } from "sonner";

// Define the shape of the QR data
interface QRCodeImage {
  public_id: string;
  secure_url: string;
}

interface QRCodeData {
  id: number;
  phone: string | null;
  image: QRCodeImage | null;
  createdAt: string;
  updatedAt: string;
}

// Define the Zustand store interface
interface QRStore {
  qrCode: QRCodeData | null;
  loading: boolean;
  fetchQRCode: () => Promise<void>;
  clearQRCode: () => void;
}

export const useQRStore = create<QRStore>((set) => ({
  qrCode: null,
  loading: false,

  // Fetch QR code data from backend
  fetchQRCode: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/v1/qr/get");
      set({ qrCode: res.data.data, loading: false });
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.info("QR Code not found. Please contact support.");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch QR Code");
      }
      set({ loading: false });
    }
  },

  // Clear QR data from store
  clearQRCode: () => set({ qrCode: null }),
}));
