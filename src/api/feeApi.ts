import api from './apiClient';

export interface PaymentFee {
  id: number;
  processingFee: string;
  bankTransactionPaperFee: string;
  insuranceFee: string;
  cibilFee: string;
  tdsFee: string;
  nocFee: string;
  created: string;
  updated: string;
}

export type PaymentFormData = {
  processingFee: string;
  bankTransactionPaperFee: string;
  insuranceFee: string;
  cibilFee: string;
  tdsFee: string;
  nocFee: string;
};

export const getPaymentFee = async (id: number) => {
  const response = await api.get(`/fee/${id}`);
  console.log(response.data.data);
  return response.data.data as PaymentFee; // Adjusted to match the response structure: response.data.data.payment
};

export const updatePaymentFee = async (id: number, data: PaymentFormData) => {
  const response = await api.post(`/fee/${id}`, data);
  return response.data.data as PaymentFee; // Similarly adjusted for update
};