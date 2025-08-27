import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db"
import { z } from "zod"

const updateAddressSchema = z.object({
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

interface RouteParams {
  params: {
    id: string
  }
}

// PUT - Actualizar dirección
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateAddressSchema.parse(body)

    // Verificar que la dirección pertenece al usuario
    const existingAddress = await db.address.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Dirección no encontrada" },
        { status: 404 }
      )
    }

    // Si esta dirección se marca como predeterminada, desmarcar las otras
    if (validatedData.isDefault) {
      await db.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          id: { not: params.id }
        },
        data: {
          isDefault: false
        }
      })
    }

    const updatedAddress = await db.address.update({
      where: {
        id: params.id
      },
      data: validatedData
    })

    return NextResponse.json(updatedAddress)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating address:", error)
    return NextResponse.json(
      { error: "Error al actualizar la dirección" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar dirección
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Verificar que la dirección pertenece al usuario
    const existingAddress = await db.address.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Dirección no encontrada" },
        { status: 404 }
      )
    }

    await db.address.delete({
      where: {
        id: params.id
      }
    })

    // Si se eliminó la dirección predeterminada, establecer otra como predeterminada
    if (existingAddress.isDefault) {
      const firstAddress = await db.address.findFirst({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      if (firstAddress) {
        await db.address.update({
          where: {
            id: firstAddress.id
          },
          data: {
            isDefault: true
          }
        })
      }
    }

    return NextResponse.json({ message: "Dirección eliminada correctamente" })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json(
      { error: "Error al eliminar la dirección" },
      { status: 500 }
    )
  }
}