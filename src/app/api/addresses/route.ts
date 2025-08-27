import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db"
import { z } from "zod"

const createAddressSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  company: z.string().optional(),
  address1: z.string().min(1, "La dirección es requerida"),
  address2: z.string().optional(),
  city: z.string().min(1, "La ciudad es requerida"),
  state: z.string().min(1, "El estado/provincia es requerido"),
  postalCode: z.string().min(1, "El código postal es requerido"),
  country: z.string().min(1, "El país es requerido"),
  phone: z.string().optional(),
  isDefault: z.boolean().optional().default(false)
})

// GET - Obtener direcciones del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const addresses = await db.address.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json(
      { error: "Error al obtener las direcciones" },
      { status: 500 }
    )
  }
}

// POST - Crear nueva dirección
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createAddressSchema.parse(body)

    // Si esta dirección se marca como predeterminada, desmarcar las otras
    if (validatedData.isDefault) {
      await db.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      })
    }

    // Si es la primera dirección, marcarla como predeterminada automáticamente
    const existingAddresses = await db.address.count({
      where: {
        userId: session.user.id
      }
    })

    const newAddress = await db.address.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        isDefault: existingAddresses === 0 ? true : validatedData.isDefault
      }
    })

    return NextResponse.json(newAddress, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating address:", error)
    return NextResponse.json(
      { error: "Error al crear la dirección" },
      { status: 500 }
    )
  }
}