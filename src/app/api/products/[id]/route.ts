import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { z } from 'zod';
import { sanitizeUserInput } from '@/lib/sanitize';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const productId = sanitizeUserInput(params.id);
    
    const product = await db.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: true,
        stock: true,
        isActive: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.string().min(1).optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional()
});

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role (assuming you have role in user)
    // You may need to adjust this based on your user schema
    if (session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const productId = sanitizeUserInput(params.id);
    const body = await request.json();
    
    const validatedData = updateProductSchema.parse({
      name: body.name ? sanitizeUserInput(body.name) : undefined,
      description: body.description ? sanitizeUserInput(body.description) : undefined,
      price: body.price,
      stock: body.stock,
      categoryId: body.categoryId ? sanitizeUserInput(body.categoryId) : undefined,
      image: body.image ? sanitizeUserInput(body.image) : undefined,
      isActive: body.isActive
    });

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: validatedData
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    if (session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const productId = sanitizeUserInput(params.id);

    // Soft delete by setting isActive to false
    const deletedProduct = await db.product.update({
      where: { id: productId },
      data: { isActive: false }
    });

    return NextResponse.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}