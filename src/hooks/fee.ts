import { create } from "zustand";
import api from "../api/apiClient";
import { toast } from "sonner";

interface PaymentFeeData {
  id: number;
  processingFee: string;
  bankTransactionPaperFee: string;
  insuranceFee: string;
  cibilFee: string;
  tdsFee: string;
  nocFee: string;
}

interface FeeStore {
  fees: PaymentFeeData | null;
  loading: boolean;
  fetchFees: () => Promise<void>;
}

export const useFeeStore = create<FeeStore>((set) => ({
  fees: null,
  loading: false,
  fetchFees: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/admin/payment-fees");
      set({ fees: res.data.data, loading: false });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch payment fees");
      set({ loading: false });
    }
  },
}));
