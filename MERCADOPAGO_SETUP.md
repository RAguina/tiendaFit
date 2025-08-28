# 🚀 Configuración MercadoPago para TiendaFit

Esta guía te ayudará a configurar MercadoPago en tu aplicación TiendaFit.

## 📋 Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env.local`:

```bash
# MercadoPago - Variables de TEST (Sandbox)
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxx-xxxxxx-xxxxx-xxxxx-xxxxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxx-xxxxxx-xxxxx-xxxxx-xxxxxxx

# MercadoPago - Variables de PRODUCCIÓN (solo cuando vayas a producción)
# MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx-xxxxxx-xxxxx-xxxxx-xxxxxxx
# MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxx-xxxxxx-xxxxx-xxxxx-xxxxxxx
```

## 🛠️ Cómo Obtener las Credenciales

### 1. Crear cuenta en MercadoPago Developers
1. Ve a [https://www.mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Inicia sesión con tu cuenta de MercadoPago (o crea una nueva)
3. Crea una nueva aplicación

### 2. Obtener credenciales de TEST
1. En el panel de tu aplicación, ve a **"Credenciales"**
2. Busca la sección **"Credenciales de prueba"**
3. Copia:
   - **Access Token**: Empieza con `TEST-`
   - **Public Key**: Empieza con `TEST-`

### 3. Configurar Webhooks (Importante)
1. En el panel de MercadoPago, ve a **"Webhooks"**
2. Agrega esta URL de notificación:
   - **Desarrollo**: `http://localhost:3000/api/webhooks/mercadopago`
   - **Producción**: `https://tu-dominio.com/api/webhooks/mercadopago`
3. Selecciona los eventos: **"Pagos"**

## 🧪 Tarjetas de Prueba

Para testing, usa estas tarjetas de prueba:

### Tarjetas que APRUEBAN el pago:
```
Visa:         4509 9535 6623 3704
Mastercard:   5031 7557 3453 0604
American Express: 3711 803032 57522
```

### Tarjetas que RECHAZAN el pago:
```
Visa:         4013 5406 8274 6260
Mastercard:   5031 4332 1540 6351
```

**CVV**: Cualquier número de 3 dígitos  
**Fecha de vencimiento**: Cualquier fecha futura  
**Nombre**: Cualquier nombre  

## 🔄 Flujo Completo

### Para el usuario:
1. **Carrito** → Productos agregados
2. **Checkout** → Selección de dirección y método de pago
3. **MercadoPago** → Redirección automática para pago
4. **Confirmación** → Retorno automático con estado

### Para el desarrollador:
1. **Orden creada** → Estado: PENDING, Pago: PENDING
2. **Preference creada** → Redirección a MercadoPago
3. **Webhook recibido** → Actualización automática del estado
4. **Usuario retorna** → Página de confirmación

## 🌐 URLs de Retorno

El sistema está configurado para manejar estos retornos automáticamente:

- ✅ **Éxito**: `/payment/success?order_id=xxx`
- ❌ **Falla**: `/payment/failure?order_id=xxx`
- ⏳ **Pendiente**: `/payment/pending?order_id=xxx`

## 🔧 Configuración Técnica

### Endpoints creados:
- `POST /api/payments/create` - Crear preferencia de pago
- `POST /api/webhooks/mercadopago` - Recibir notificaciones
- `GET /api/orders/[id]` - Obtener detalles de orden

### Archivos principales:
- `src/lib/mercadopago/config.ts` - Configuración del SDK
- `src/lib/mercadopago/utils.ts` - Utilidades y helpers
- `src/app/api/payments/create/route.ts` - API de creación
- `src/app/api/webhooks/mercadopago/route.ts` - Webhook handler

## ✅ Testing Checklist

### Flujo completo a probar:
- [ ] Agregar productos al carrito
- [ ] Proceder al checkout
- [ ] Seleccionar "MercadoPago" como método de pago
- [ ] Completar formulario de dirección
- [ ] Hacer click en "Realizar Pedido"
- [ ] Ser redirigido a MercadoPago
- [ ] Realizar pago con tarjeta de prueba
- [ ] Ser redirigido de vuelta con confirmación
- [ ] Verificar que el estado se actualiza via webhook
- [ ] Verificar orden en el panel de usuario

### Estados a verificar:
- [ ] Orden PENDING después de creación
- [ ] Redirección correcta a MercadoPago
- [ ] Pago PAID después de webhook
- [ ] Orden CONFIRMED después de pago exitoso

## 🚨 Producción

### Antes de ir a producción:
1. **Obtén credenciales de producción** en MercadoPago Developers
2. **Actualiza las variables** de entorno con `APP_USR-`
3. **Configura el webhook** con tu dominio real
4. **Prueba con tarjetas reales** (montos pequeños)

### Variables de producción:
```bash
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx-xxxxxx-xxxxx-xxxxx-xxxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxx-xxxxxx-xxxxx-xxxxx-xxxxxxx
```

## 📞 Soporte

Si tienes problemas:
1. **Revisa los logs** en la consola del navegador y servidor
2. **Verifica las credenciales** en el panel de MercadoPago
3. **Confirma el webhook** esté recibiendo notificaciones
4. **Consulta la documentación** oficial: [https://www.mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)

¡Tu sistema de pagos está listo! 🎉