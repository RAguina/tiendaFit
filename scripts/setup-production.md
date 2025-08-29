# Production Setup Script

## Step-by-Step Production Configuration

### 1. 🚀 SETUP REDIS (Choose Upstash - Recommended)

```bash
# Go to: https://console.upstash.com/
# 1. Create account with GitHub
# 2. Create new Redis database:
#    - Name: tiendafit-production  
#    - Region: us-east-1 (or closest to your users)
#    - Type: Regional
# 3. Copy the connection details
```

### 2. 🔑 GENERATE PRODUCTION SECRETS

```bash
# Generate NextAuth secret (32+ characters)
openssl rand -hex 32
# Example output: a1b2c3d4e5f6789012345678901234567890abcdef1234567890

# Generate webhook secret (32+ characters)  
openssl rand -hex 32
# Example output: f9e8d7c6b5a4321098765432109876543210fedcba0987654321
```

### 3. 🌐 CREATE GOOGLE OAUTH PRODUCTION APP

```bash
# Go to: https://console.cloud.google.com/apis/credentials
# 1. Create new project or select existing
# 2. Enable Google+ API
# 3. Create OAuth 2.0 Client:
#    - Application type: Web application
#    - Name: TiendaFit Production
#    - Authorized origins: https://yourdomain.com  
#    - Authorized redirect URIs: https://yourdomain.com/api/auth/callback/google
# 4. Copy Client ID and Client Secret
```

### 4. 💳 GET MERCADOPAGO PRODUCTION CREDENTIALS

```bash
# Go to: https://www.mercadopago.com/developers/
# 1. Switch to "Production" mode (top right toggle)
# 2. Go to "Credentials"  
# 3. Copy:
#    - Access Token (APP_USR-...)
#    - Public Key (APP_USR-...)
```

### 5. ⚙️ CONFIGURE VERCEL ENVIRONMENT VARIABLES

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables with Environment = "Production":

```
REDIS_URL or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
NEXTAUTH_SECRET=[generated-secret-from-step-2]  
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=[from-step-3]
GOOGLE_CLIENT_SECRET=[from-step-3]
MERCADOPAGO_ACCESS_TOKEN=[production-token-from-step-4]
MERCADOPAGO_PUBLIC_KEY=[production-key-from-step-4]  
MERCADOPAGO_WEBHOOK_SECRET=[generated-secret-from-step-2]
SECURITY_ALERT_EMAIL=security@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
ENABLE_HPKP=true
NODE_ENV=production
```

### 6. 🧪 TEST DEPLOYMENT

```bash
# Deploy to production
vercel --prod

# Test Redis connection (check logs)
vercel logs your-production-url

# Test rate limiting
curl -X POST https://yourdomain.com/api/auth/signin
curl -X POST https://yourdomain.com/api/auth/signin
# (repeat 10+ times to trigger rate limit)
```

### 7. 📊 VERIFY SECURITY FEATURES

```bash
# Check security headers
curl -I https://yourdomain.com

# Should see:
# - Content-Security-Policy
# - Strict-Transport-Security  
# - X-Frame-Options
# - Rate limiting headers (X-RateLimit-*)
```

## ✅ Production Checklist

- [ ] Redis database created and connected
- [ ] Production secrets generated (not reused from development)
- [ ] Google OAuth production app configured  
- [ ] MercadoPago production credentials configured
- [ ] All environment variables set in Vercel
- [ ] Rate limiting tested and working
- [ ] Security headers verified
- [ ] SSL/TLS certificate valid
- [ ] Domain configured correctly
- [ ] Monitoring alerts configured

## 🚨 Security Reminders

1. **Never commit production secrets to git**
2. **Use different credentials than development**  
3. **Enable all security headers in production**
4. **Test rate limiting thoroughly**
5. **Monitor Redis usage and costs**
6. **Set up security alerts**
7. **Regularly rotate secrets**

## 📞 Support Contacts

- **Upstash Support**: https://upstash.com/docs
- **Vercel Support**: https://vercel.com/support  
- **MercadoPago Support**: https://www.mercadopago.com/developers/support