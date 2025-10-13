import { create } from "zustand";
import api from "../api/apiClient";
import { toast } from "sonner";

interface AccountData {
  id: number;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  createdAt: string;
}

interface AccountStore {
  account: AccountData | null;
  loading: boolean;
  fetchAccount: () => Promise<void>;
}

export const useAccountStore = create<AccountStore>((set) => ({
  account: null,
  loading: false,

  fetchAccount: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/account/get-one"); // adjust route if needed
      set({ account: res.data.data || null, loading: false });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch account number");
      set({ loading: false });
    }
  },
}));
