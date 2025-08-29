import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Initialize MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    // Removed hardcoded idempotency key - will be generated per request
  }
});

// Create instances for different services
export const payment = new Payment(client);
export const preference = new Preference(client);

// Configuration constants
export const MP_CONFIG = {
  // Test webhook URL - update this with your actual domain
  webhookUrl: process.env.NEXTAUTH_URL 
    ? `${process.env.NEXTAUTH_URL}/api/webhooks/mercadopago`
    : 'http://localhost:3000/api/webhooks/mercadopago',
  
  // Success/Failure URLs
  successUrl: process.env.NEXTAUTH_URL 
    ? `${process.env.NEXTAUTH_URL}/payment/success`
    : 'http://localhost:3000/payment/success',
    
  failureUrl: process.env.NEXTAUTH_URL 
    ? `${process.env.NEXTAUTH_URL}/payment/failure`
    : 'http://localhost:3000/payment/failure',
    
  pendingUrl: process.env.NEXTAUTH_URL 
    ? `${process.env.NEXTAUTH_URL}/payment/pending`
    : 'http://localhost:3000/payment/pending',
};

// Helper function to get public key for frontend
export const getPublicKey = () => {
  return process.env.MERCADOPAGO_PUBLIC_KEY!;
};

// Payment status mapping
export const MP_PAYMENT_STATUS = {
  pending: 'PENDING',
  approved: 'PAID',
  authorized: 'PAID',
  in_process: 'PENDING',
  in_mediation: 'PENDING',
  rejected: 'FAILED',
  cancelled: 'FAILED',
  refunded: 'REFUNDED',
  charged_back: 'REFUNDED',
} as const;

// Payment method types
export const MP_PAYMENT_METHODS = {
  credit_card: 'Tarjeta de Crédito',
  debit_card: 'Tarjeta de Débito',
  ticket: 'Efectivo',
  bank_transfer: 'Transferencia Bancaria',
  account_money: 'Dinero en Cuenta',
  digital_currency: 'Moneda Digital',
} as const;

export default client;