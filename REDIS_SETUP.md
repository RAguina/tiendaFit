# Redis Configuration for Production

## Overview
TiendaFit uses Redis for distributed rate limiting, providing scalable protection across multiple server instances. This guide walks through setting up Redis for production deployment on Vercel.

## Recommended Redis Providers for Vercel

### 🚀 Option 1: Upstash Redis (RECOMMENDED)
Serverless-first Redis, optimized for Vercel deployments.

#### Setup Steps:
1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up/Login with GitHub account
3. Create a new Redis database:
   - **Name**: `tiendafit-production`
   - **Region**: Choose closest to your users (US East for US/Americas)
   - **Type**: Regional (for better performance)
4. Copy the connection details

#### Environment Variables:
```bash
# From Upstash Console -> Database -> Details
UPSTASH_REDIS_REST_URL="https://your-endpoint.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-rest-token"

# Alternative: Use Redis URL format
REDIS_URL="redis://default:your-password@your-endpoint.upstash.io:6379"
```

### 🌐 Option 2: Redis Cloud
Traditional managed Redis with generous free tier.

#### Setup Steps:
1. Go to [Redis Cloud](https://app.redislabs.com/)
2. Create free account
3. Create new database:
   - **Name**: `tiendafit-prod`
   - **Cloud**: AWS
   - **Region**: us-east-1 (or closest to your users)
   - **Plan**: Free 30MB
4. Copy connection string

#### Environment Variables:
```bash
REDIS_URL="redis://default:password@endpoint:port"
```

## Vercel Environment Variable Configuration

### Method 1: Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`tienda-fit`)
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

#### Required Variables:
```bash
# Redis Configuration
REDIS_URL="redis://default:your-password@your-endpoint:6379"
# OR for Upstash:
UPSTASH_REDIS_REST_URL="https://your-endpoint.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# Security Configuration  
SECURITY_ALERT_EMAIL="security@yourdomain.com"
SECURITY_WEBHOOK_URL="https://your-monitoring-service.com/webhook"

# Production Flags
ENABLE_HPKP="true"
NODE_ENV="production"

# Authentication (use production values)
NEXTAUTH_SECRET="your-production-secret-min-32-chars"
NEXTAUTH_URL="https://your-domain.com"

# Google OAuth (production credentials)
GOOGLE_CLIENT_ID="your-prod-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-prod-client-secret"

# MercadoPago (production credentials)
MERCADOPAGO_ACCESS_TOKEN="APP_USR-your-production-token"
MERCADOPAGO_PUBLIC_KEY="APP_USR-your-production-public-key"
MERCADOPAGO_WEBHOOK_SECRET="your-secure-webhook-secret"

# Admin Configuration
ADMIN_EMAIL="admin@yourdomain.com"
```

#### Environment Targeting:
- **Production**: All variables above
- **Preview**: Can use development values for testing
- **Development**: Should use development credentials

### Method 2: Vercel CLI
```bash
# Set production variables
vercel env add REDIS_URL production
vercel env add SECURITY_ALERT_EMAIL production
vercel env add NEXTAUTH_SECRET production
# ... continue for all variables
```

## Security Best Practices

### 🔒 Secrets Management
1. **Generate new production secrets** - Don't reuse development keys
2. **Use strong webhook secrets** - Generate with: `openssl rand -hex 32`
3. **Rotate secrets regularly** - Set calendar reminders
4. **Restrict Redis access** - Use VPC/firewall rules if possible

### 🛡️ Redis Security Configuration
```bash
# Upstash: Use TLS-enabled endpoints
UPSTASH_REDIS_REST_URL="https://..." # Always HTTPS

# Redis Cloud: Ensure SSL/TLS
REDIS_URL="rediss://..." # 'rediss' = Redis with SSL
```

## Testing Configuration

After setting up, test the configuration:

```bash
# Deploy to preview first
vercel --prod=false

# Check logs for Redis connection
vercel logs your-deployment-url

# Test rate limiting endpoints
curl -X POST https://your-preview-url.vercel.app/api/auth/signin
```

## Monitoring & Alerts

### Redis Metrics to Monitor:
- Connection count
- Memory usage
- Request latency
- Error rates

### Security Alerts Setup:
1. Configure `SECURITY_ALERT_EMAIL` for incident notifications
2. Set up `SECURITY_WEBHOOK_URL` for integration with monitoring tools
3. Monitor rate limiting effectiveness in logs

## Troubleshooting

### Common Issues:

#### "Redis connection failed"
- ✅ Check `REDIS_URL` format: `redis://user:pass@host:port`
- ✅ Verify credentials in Redis provider dashboard
- ✅ Check network connectivity (Vercel → Redis provider)

#### "Rate limiting not working"
- ✅ Verify Redis connection in Vercel logs
- ✅ Check if falling back to in-memory (limited effectiveness)
- ✅ Test with: `curl -H "X-Forwarded-For: test-ip" your-api-endpoint`

#### "Too many environment variables"
- ✅ Combine related variables where possible
- ✅ Use Vercel's environment variable inheritance
- ✅ Remove unused development variables

## Cost Optimization

### Upstash Pricing:
- **Free Tier**: 10,000 requests/day
- **Pay-as-you-go**: $0.2 per 100K requests
- **Estimated for TiendaFit**: ~$5-15/month depending on traffic

### Redis Cloud Pricing:
- **Free Tier**: 30MB, 30 connections
- **Paid**: Starting at $7/month for 100MB

## Next Steps

1. ✅ Choose Redis provider (Upstash recommended)
2. ✅ Create production Redis database
3. ✅ Configure environment variables in Vercel
4. ✅ Deploy and test rate limiting
5. ✅ Set up monitoring and alerts
6. ✅ Document access credentials securely

## Support

- **Redis Issues**: Check provider documentation
- **Vercel Issues**: [Vercel Support](https://vercel.com/support)
- **TiendaFit Specific**: Check application logs in Vercel dashboard