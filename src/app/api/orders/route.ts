import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db"
import { z } from "zod"
import { apiRateLimit, getClientIdentifier } from "@/lib/rate-limit"
import { sanitizeUserInput, validateAndSanitize } from "@/lib/sanitize"

const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID es requerido"),
  quantity: z.number().int().min(1, "Cantidad debe ser al menos 1"),
  price: z.number().positive("Precio debe ser positivo")
})

const createOrderSchema = z.object({
  addressId: z.string().min(1, "Dirección es requerida"),
  items: z.array(orderItemSchema).min(1, "Al menos un item es requerido"),
  paymentMethod: z.enum(["mercadopago", "cash_on_delivery"], {
    errorMap: () => ({ message: "Método de pago inválido" })
  }),
  subtotal: z.number().positive("Subtotal debe ser positivo"),
  tax: z.number().nonnegative("Tax debe ser no negativo"),
  shipping: z.number().nonnegative("Envío debe ser no negativo"),
  total: z.number().positive("Total debe ser positivo")
})

// GET - Obtener órdenes del usuario
export async function GET(request: NextRequest) {
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

    const orders = await db.order.findMany({
      where: {
        userId: session.user.id
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
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Error al obtener las órdenes" },
      { status: 500 }
    )
  }
}

// POST - Crear nueva orden
export async function POST(request: NextRequest) {
  try {
    // Rate limiting for creation (more restrictive)
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
    
    // Sanitize input data
    const sanitizedData = {
      addressId: sanitizeUserInput(body.addressId),
      items: body.items?.map((item: any) => ({
        productId: sanitizeUserInput(item.productId),
        quantity: item.quantity,
        price: item.price
      })),
      paymentMethod: sanitizeUserInput(body.paymentMethod),
      subtotal: body.subtotal,
      tax: body.tax,
      shipping: body.shipping,
      total: body.total
    }
    
    const validatedData = createOrderSchema.parse(sanitizedData)

    // Verify that the address belongs to the user
    const address = await db.address.findFirst({
      where: {
        id: validatedData.addressId,
        userId: session.user.id
      }
    })

    if (!address) {
      return NextResponse.json(
        { error: "Dirección no encontrada o no autorizada" },
        { status: 400 }
      )
    }

    // Verify products exist and prices match (security check)
    const productIds = validatedData.items.map(item => item.productId)
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Algunos productos no están disponibles" },
        { status: 400 }
      )
    }

    // Verify stock availability
    for (const item of validatedData.items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Producto ${item.productId} no encontrado` },
          { status: 400 }
        )
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}` },
          { status: 400 }
        )
      }
    }

    // Verify price calculations are correct (prevent manipulation)
    let calculatedSubtotal = 0
    for (const item of validatedData.items) {
      const product = products.find(p => p.id === item.productId)!
      calculatedSubtotal += Number(product.price) * item.quantity
    }
    
    const calculatedTax = calculatedSubtotal * 0.16
    const calculatedShipping = calculatedSubtotal > 1000 ? 0 : 100
    const calculatedTotal = calculatedSubtotal + calculatedTax + calculatedShipping

    // Allow small rounding differences (less than $0.10)
    if (Math.abs(validatedData.subtotal - calculatedSubtotal) > 0.1 ||
        Math.abs(validatedData.tax - calculatedTax) > 0.1 ||
        Math.abs(validatedData.shipping - calculatedShipping) > 0.1 ||
        Math.abs(validatedData.total - calculatedTotal) > 0.1) {
      return NextResponse.json(
        { error: "Error en el cálculo de precios" },
        { status: 400 }
      )
    }

    // Create order in a transaction
    const order = await db.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          addressId: validatedData.addressId,
          status: 'PENDING',
          subtotal: calculatedSubtotal,
          tax: calculatedTax,
          shipping: calculatedShipping,
          total: calculatedTotal,
          paymentMethod: validatedData.paymentMethod,
          paymentStatus: 'PENDING'
        }
      })

      // Create order items and update stock
      for (const item of validatedData.items) {
        const product = products.find(p => p.id === item.productId)!
        
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: Number(product.price)
          }
        })

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      }

      return newOrder
    })

    // Fetch complete order data for response
    const completeOrder = await db.order.findUnique({
      where: { id: order.id },
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
        address: true
      }
    })

    return NextResponse.json(completeOrder, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Error al crear la orden" },
      { status: 500 }
    )
  }
}