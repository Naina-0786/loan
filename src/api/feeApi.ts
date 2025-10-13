import api from './apiClient';

export interface PaymentFee {
  id: number;
  processingFee: string;
  bankTransactionPaperFee: string;
  insuranceFee: string;
  cibilFee: string;
  tdsFee: string;
  nocFee: string;
}

export interface PaymentFormData {
  processingFee: string;
  bankTransactionPaperFee: string;
  insuranceFee: string;
  cibilFee: string;
  tdsFee: string;
  nocFee: string;
}

export const getPaymentFee = async (): Promise<PaymentFee> => {
  const response = await api.get('/admin/payment-fees');
  return response.data.data;
};

export const updatePaymentFee = async (formData: PaymentFormData): Promise<void> => {
  await api.put('/admin/payment-fees', formData, {
    headers: { 'Content-Type': 'application/json' },
  });
};