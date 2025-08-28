import { preference, MP_CONFIG, MP_PAYMENT_STATUS } from './config';
// Note: Using any for PreferenceCreateData due to MercadoPago SDK types
import { sanitizeUserInput } from '@/lib/sanitize';

interface OrderItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  currency_id: string
}

interface CreatePreferenceParams {
  orderId: string
  items: OrderItem[]
  payer: {
    name: string
    surname: string
    email: string
    phone?: {
      area_code: string
      number: string
    }
  }
  shipping_cost?: number
  metadata?: Record<string, any>
}

/**
 * Create a MercadoPago preference for payment
 */
export async function createMercadoPagoPreference(params: CreatePreferenceParams) {
  try {
    const { orderId, items, payer, shipping_cost = 0, metadata = {} } = params;

    // Sanitize all string inputs
    const sanitizedOrderId = sanitizeUserInput(orderId);
    const sanitizedPayer = {
      name: sanitizeUserInput(payer.name),
      surname: sanitizeUserInput(payer.surname),
      email: sanitizeUserInput(payer.email),
      phone: payer.phone ? {
        area_code: sanitizeUserInput(payer.phone.area_code),
        number: sanitizeUserInput(payer.phone.number)
      } : undefined
    };

    const sanitizedItems = items.map(item => ({
      ...item,
      title: sanitizeUserInput(item.title)
    }));

    const preferenceData: any = {
      items: sanitizedItems,
      payer: sanitizedPayer,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      shipments: {
        cost: shipping_cost,
        mode: 'not_specified',
      },
      back_urls: {
        success: `${MP_CONFIG.successUrl}?order_id=${sanitizedOrderId}`,
        failure: `${MP_CONFIG.failureUrl}?order_id=${sanitizedOrderId}`,
        pending: `${MP_CONFIG.pendingUrl}?order_id=${sanitizedOrderId}`,
      },
      auto_return: 'approved',
      external_reference: sanitizedOrderId,
      notification_url: MP_CONFIG.webhookUrl,
      metadata: {
        order_id: sanitizedOrderId,
        ...metadata
      },
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Creating MercadoPago Preference:', {
        orderId: sanitizedOrderId,
        itemsCount: sanitizedItems.length,
        totalAmount: sanitizedItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0),
        webhookUrl: MP_CONFIG.webhookUrl
      });
    }

    const response = await preference.create({ body: preferenceData });
    
    return {
      id: response.id!,
      init_point: response.init_point!,
      sandbox_init_point: response.sandbox_init_point!,
    };
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw new Error('Failed to create payment preference');
  }
}

/**
 * Map MercadoPago payment status to our order status
 */
export function mapPaymentStatusToOrderStatus(mpStatus: string): string {
  return MP_PAYMENT_STATUS[mpStatus as keyof typeof MP_PAYMENT_STATUS] || 'PENDING';
}

/**
 * Validate webhook signature with proper HMAC-SHA256 verification
 * Based on MercadoPago official documentation 2024
 */
export function validateWebhookSignature(
  xSignature: string,
  xRequestId: string,
  dataId: string
): boolean {
  try {
    // Basic check - required headers must be present
    if (!xSignature || !xRequestId || !dataId) {
      console.error('❌ Missing required webhook headers');
      return false;
    }

    // In development, skip signature validation for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Development mode: Skipping signature validation');
      return true;
    }

    // Get secret from environment variables
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!secret) {
      console.error('❌ MERCADOPAGO_WEBHOOK_SECRET not configured');
      return false;
    }

    // Parse signature components from x-signature header
    const parts = xSignature.split(',');
    let timestamp: string | undefined;
    let signature: string | undefined;

    parts.forEach((part) => {
      const [key, value] = part.split('=');
      if (key && value) {
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        if (trimmedKey === 'ts') {
          timestamp = trimmedValue;
        } else if (trimmedKey === 'v1') {
          signature = trimmedValue;
        }
      }
    });

    if (!timestamp || !signature) {
      console.error('❌ Invalid signature format - missing ts or v1');
      return false;
    }

    // Validate timestamp (prevent replay attacks)
    const now = Date.now();
    const webhookTime = parseInt(timestamp);
    const timeDiff = Math.abs(now - webhookTime);
    const maxAge = 15 * 60 * 1000; // 15 minutes

    if (timeDiff > maxAge) {
      console.error('❌ Webhook timestamp too old:', {
        webhookTime: new Date(webhookTime),
        now: new Date(now),
        diffMinutes: timeDiff / (60 * 1000)
      });
      return false;
    }

    // Create the manifest string as per MercadoPago spec
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${timestamp};`;

    // Generate HMAC-SHA256 signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    // Compare signatures
    const isValid = expectedSignature === signature;

    if (process.env.NODE_ENV !== 'production') {
      console.log('🔐 Signature validation:', {
        manifest,
        expectedSignature,
        receivedSignature: signature,
        isValid,
        timestamp: new Date(webhookTime)
      });
    }

    if (!isValid) {
      console.error('❌ Invalid webhook signature');
    }

    return isValid;

  } catch (error) {
    console.error('Error validating webhook signature:', error);
    return false;
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency = 'ARS'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate unique idempotency key
 */
export function generateIdempotencyKey(orderId: string): string {
  return `${orderId}-${Date.now()}`;
}