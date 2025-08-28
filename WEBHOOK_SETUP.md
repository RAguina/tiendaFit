# MercadoPago Webhook Configuration Guide

## 🔐 Webhook Security Implementation

### What was implemented:
- **HMAC-SHA256 signature validation** following MercadoPago's 2024 specification
- **Timestamp validation** to prevent replay attacks (15-minute window)
- **Environment-aware validation** (skipped in development, enforced in production)
- **Comprehensive error logging** for debugging

## 📋 Setup Checklist

### 1. Get Webhook Secret from MercadoPago
1. Go to [MercadoPago Developer Panel](https://www.mercadopago.com/developers)
2. Navigate to **Applications** → Your App → **Webhooks**
3. Generate a new **Secret Key** (if not exists)
4. Copy the secret key

### 2. Environment Variables Configuration

#### Development (.env.local)
```bash
MERCADOPAGO_WEBHOOK_SECRET="your-test-webhook-secret"
```

#### Production (Vercel Environment Variables)
```bash
MERCADOPAGO_WEBHOOK_SECRET="your-production-webhook-secret"
```

### 3. MercadoPago Webhook URL Configuration

#### Development (using ngrok for local testing)
1. Install ngrok: `npm install -g ngrok`
2. Start your app: `npm run dev`
3. In another terminal: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. In MercadoPago panel, set webhook URL to: `https://abc123.ngrok.io/api/webhooks/mercadopago`

#### Production (Vercel)
1. Deploy to Vercel
2. In MercadoPago panel, set webhook URL to: `https://your-domain.vercel.app/api/webhooks/mercadopago`

### 4. Webhook Events Configuration
In MercadoPago Developer Panel, enable these events:
- ✅ **Payments** (payment status changes)
- ⚠️ **Orders** (optional)
- ⚠️ **Merchant Orders** (optional)

## 🧪 Testing Webhook Implementation

### Local Testing with ngrok
```bash
# Terminal 1: Start your Next.js app
npm run dev

# Terminal 2: Expose localhost to internet
ngrok http 3000

# Terminal 3: Test webhook endpoint
curl -X GET https://your-ngrok-url.ngrok.io/api/webhooks/mercadopago
```

Expected response:
```json
{
  "status": "Webhook endpoint active",
  "timestamp": "2024-08-28T..."
}
```

### Manual Webhook Testing
1. Create a test payment through your app
2. Check MercadoPago Developer Panel → Webhooks → Notifications
3. Look for webhook delivery attempts
4. Check your app logs for signature validation messages

### Webhook Signature Validation Flow
```
MercadoPago sends webhook with headers:
├── x-signature: "ts=1693238400,v1=abc123def456..."
├── x-request-id: "unique-request-id"
└── body: { "type": "payment", "data": { "id": "payment-id" } }

Our validation process:
1. ✅ Check required headers exist
2. ✅ Parse timestamp (ts) and signature (v1) from x-signature
3. ✅ Validate timestamp (max 15 minutes old)
4. ✅ Generate manifest: "id:payment-id;request-id:req-id;ts:timestamp;"
5. ✅ Compute HMAC-SHA256 with webhook secret
6. ✅ Compare computed signature with received signature
```

## 🚨 Security Features

### Implemented Protections
- **Signature Validation**: HMAC-SHA256 verification prevents forged webhooks
- **Timestamp Validation**: 15-minute window prevents replay attacks  
- **Environment Awareness**: Development mode allows testing without secrets
- **Header Validation**: Required headers must be present
- **Error Logging**: Comprehensive logging for debugging issues

### Production Security Checklist
- [ ] `MERCADOPAGO_WEBHOOK_SECRET` configured in production
- [ ] Webhook URL uses HTTPS
- [ ] Signature validation is enabled (NODE_ENV !== 'development')
- [ ] Logs don't expose sensitive data (signatures are truncated)

## 🔍 Debugging Webhook Issues

### Common Issues & Solutions

#### 1. "Missing MERCADOPAGO_WEBHOOK_SECRET"
**Solution**: Add the environment variable in your deployment platform

#### 2. "Invalid webhook signature"
**Solutions**:
- Verify webhook secret matches MercadoPago panel
- Check webhook URL is correctly configured
- Ensure timestamp validation isn't too strict

#### 3. "Webhook timestamp too old"
**Solution**: Check server time synchronization

#### 4. Development Mode Not Working
**Solution**: Set `NODE_ENV=development` to skip signature validation

### Log Examples

#### Successful Validation (Development)
```
🔔 MercadoPago Webhook received: {
  type: 'payment',
  action: 'payment.updated',
  dataId: 'payment-123'
}
⚠️ Development mode: Skipping signature validation
🔍 Processing payment notification: { paymentId: 'payment-123' }
✅ Order status updated: { orderId: 'order-456', newPaymentStatus: 'COMPLETED' }
```

#### Failed Validation (Production)
```
🔔 MercadoPago Webhook received: { type: 'payment', dataId: 'payment-123' }
❌ Invalid webhook signature - request rejected
```

## 📚 References
- [MercadoPago Webhook Documentation](https://www.mercadopago.com/developers/en/docs/checkout-pro/additional-content/notifications/webhooks)
- [MercadoPago Signature Validation](https://www.mercadopago.com.br/developers/en/news/2024/01/11/Webhooks-Notifications-Simulator-and-Secret-Signature)
- [HMAC-SHA256 Implementation](https://hookdeck.com/webhooks/guides/how-to-implement-sha256-webhook-signature-verification)

---
*Last updated: 2025-08-28*
*Implementation: Complete webhook security with HMAC-SHA256 validation*