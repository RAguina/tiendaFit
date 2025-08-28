import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db"
import { z } from "zod"
import { apiRateLimit, getClientIdentifier } from "@/lib/rate-limit"
import { sanitizeUserInput } from "@/lib/sanitize"
import { createMercadoPagoPreference } from "@/lib/mercadopago/utils"

const createPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID es requerido"),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = apiRateLimit(clientId)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          }
        }
      )
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { orderId } = createPaymentSchema.parse({
      orderId: sanitizeUserInput(body.orderId)
    })

    // Verify order belongs to user and is in correct status
    const order = await db.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        paymentStatus: 'PENDING'
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        address: true,
        user: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada o ya procesada" },
        { status: 404 }
      )
    }

    // Prepare items for MercadoPago
    const items = order.items.map(item => ({
      id: item.productId,
      title: item.product.name,
      quantity: item.quantity,
      unit_price: Number(item.price),
      currency_id: 'ARS'
    }))

    // Add shipping as separate item if applicable
    if (Number(order.shipping) > 0) {
      items.push({
        id: 'shipping',
        title: 'Envío',
        quantity: 1,
        unit_price: Number(order.shipping),
        currency_id: 'ARS'
      })
    }

    // Add tax as separate item
    if (Number(order.tax) > 0) {
      items.push({
        id: 'tax',
        title: 'IVA (16%)',
        quantity: 1,
        unit_price: Number(order.tax),
        currency_id: 'ARS'
      })
    }

    // Prepare payer information - use fake email to avoid MercadoPago wallet login
    const payer = {
      name: order.user.name?.split(' ')[0] || order.address.firstName,
      surname: order.user.name?.split(' ').slice(1).join(' ') || order.address.lastName,
      email: `comprador+tf${order.id}@example.com`, // Fake email to avoid 2FA
      phone: order.address.phone ? {
        area_code: '11', // Default area code for Argentina
        number: order.address.phone.replace(/\D/g, '') // Remove non-digits
      } : undefined
    }

    // Create MercadoPago preference
    const preference = await createMercadoPagoPreference({
      orderId: order.id,
      items,
      payer,
      metadata: {
        user_id: session.user.id,
        order_total: Number(order.total),
        payment_method: order.paymentMethod
      }
    })

    // Update order with MercadoPago preference ID
    await db.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: preference.id // Reusing this field for MP preference ID
      }
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ MercadoPago Preference Created:', {
        orderId: order.id,
        preferenceId: preference.id,
        totalAmount: Number(order.total),
        itemsCount: items.length
      })
    }

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      order: {
        id: order.id,
        total: Number(order.total),
        items: order.items.length
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating payment:", error)
    return NextResponse.json(
      { error: "Error al crear el pago" },
      { status: 500 }
    )
  }
}