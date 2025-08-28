import { NextRequest, NextResponse } from 'next/server';
import { payment } from '@/lib/mercadopago/config';
import { db } from '@/lib/db';
import { 
  mapPaymentStatusToOrderStatus,
  validateWebhookSignature 
} from '@/lib/mercadopago/utils';

export async function POST(request: NextRequest) {
  try {
    // Get webhook headers
    const xSignature = request.headers.get('x-signature');
    const xRequestId = request.headers.get('x-request-id');
    
    if (!xSignature || !xRequestId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Missing webhook headers:', { xSignature, xRequestId });
      }
      return NextResponse.json({ error: 'Missing required headers' }, { status: 400 });
    }

    const body = await request.json();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔔 MercadoPago Webhook received:', {
        type: body.type,
        action: body.action,
        dataId: body.data?.id,
        headers: { xSignature, xRequestId }
      });
    }

    // Handle different webhook types
    if (body.type === 'payment') {
      await handlePaymentNotification(body.data.id, xSignature, xRequestId);
    } else if (body.type === 'plan' || body.type === 'subscription') {
      // Handle subscription events if needed in the future
      if (process.env.NODE_ENV === 'development') {
        console.log('📋 Subscription event received but not handled:', body.type);
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('❓ Unknown webhook type:', body.type);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing MercadoPago webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentNotification(
  paymentId: string, 
  xSignature: string, 
  xRequestId: string
) {
  try {
    // Basic signature validation
    if (!validateWebhookSignature(xSignature, xRequestId, paymentId)) {
      console.error('❌ Invalid webhook signature');
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Processing payment notification:', { paymentId });
    }

    // Get payment details from MercadoPago
    const paymentData = await payment.get({ id: paymentId });
    
    if (!paymentData) {
      console.error('❌ Payment not found:', paymentId);
      return;
    }

    const {
      status,
      status_detail,
      external_reference: orderId,
      transaction_amount,
      payment_method_id,
      payment_type_id,
      date_created,
      date_approved,
      payer,
      metadata
    } = paymentData;

    if (process.env.NODE_ENV === 'development') {
      console.log('💳 Payment details:', {
        paymentId,
        status,
        orderId,
        amount: transaction_amount,
        method: payment_method_id,
        type: payment_type_id
      });
    }

    if (!orderId) {
      console.error('❌ No order ID in payment metadata');
      return;
    }

    // Find the order in our database
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    });

    if (!order) {
      console.error('❌ Order not found:', orderId);
      return;
    }

    // Map MercadoPago status to our order status
    const newPaymentStatus = mapPaymentStatusToOrderStatus(status || 'pending');
    const newOrderStatus = getOrderStatusFromPayment(status || 'pending');

    // Only update if status has changed
    if (order.paymentStatus !== newPaymentStatus) {
      await db.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: newPaymentStatus as any,
          status: newOrderStatus as any,
          updatedAt: new Date()
        }
      });

      // Log the status change
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Order status updated:', {
          orderId,
          oldPaymentStatus: order.paymentStatus,
          newPaymentStatus,
          oldOrderStatus: order.status,
          newOrderStatus,
          paymentAmount: transaction_amount
        });
      }

      // Store payment details for audit trail
      await createPaymentRecord(paymentId, orderId!, paymentData);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('ℹ️ No status change needed for order:', orderId);
      }
    }

  } catch (error) {
    console.error('Error handling payment notification:', error);
    throw error;
  }
}

function getOrderStatusFromPayment(paymentStatus: string): string {
  switch (paymentStatus) {
    case 'approved':
    case 'authorized':
      return 'CONFIRMED';
    case 'pending':
    case 'in_process':
    case 'in_mediation':
      return 'PENDING';
    case 'rejected':
    case 'cancelled':
      return 'CANCELLED';
    case 'refunded':
    case 'charged_back':
      return 'REFUNDED';
    default:
      return 'PENDING';
  }
}

async function createPaymentRecord(
  paymentId: string, 
  orderId: string, 
  paymentData: any
) {
  try {
    // Store payment audit record in a simple way
    // You could create a separate PaymentLog table in the future
    if (process.env.NODE_ENV === 'development') {
      console.log('💾 Would create payment record:', {
        paymentId,
        orderId,
        status: paymentData.status,
        amount: paymentData.transaction_amount,
        method: paymentData.payment_method_id
      });
    }

    // For now, we'll just update the order with the payment ID
    await db.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId: paymentId // Reusing this field to store MP payment ID
      }
    });

  } catch (error) {
    console.error('Error creating payment record:', error);
    // Don't throw here - payment processing should continue even if audit fails
  }
}

// Handle GET requests (for webhook URL verification)
export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook endpoint active',
    timestamp: new Date().toISOString() 
  });
}