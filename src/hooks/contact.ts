import { create } from "zustand";
import api from "../api/apiClient";
import { toast } from "sonner";

interface ContactData {
  id: number;
  email: string;
  phoneNumber: string;
}

interface ContactStore {
  contact: ContactData | null;
  loading: boolean;
  fetchContact: () => Promise<void>;
}

export const useContactStore = create<ContactStore>((set) => ({
  contact: null,
  loading: false,

  fetchContact: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/contact/get-one");
      set({ contact: res.data.data || null, loading: false });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch contact");
      set({ loading: false });
    }
  },
}));