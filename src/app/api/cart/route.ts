import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { z } from 'zod';
import { sanitizeUserInput } from '@/lib/sanitize';
import { apiRateLimit, getClientIdentifier } from '@/lib/rate-limit';

const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1).max(50, 'Quantity must be between 1 and 50')
});

const updateCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(0).max(50, 'Quantity must be between 0 and 50')
});

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = apiRateLimit(clientId);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          }
        }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user cart
    let userCart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                stock: true,
                isActive: true
              }
            }
          }
        }
      }
    });

    if (!userCart) {
      userCart = await db.cart.create({
        data: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true,
                  stock: true,
                  isActive: true
                }
              }
            }
          }
        }
      });
    }

    // Filter out inactive products
    const activeCartItems = userCart.items.filter(item => item.product.isActive);

    const total = activeCartItems.reduce((sum, item) => 
      sum + (Number(item.product.price) * item.quantity), 0
    );

    return NextResponse.json({
      items: activeCartItems,
      total,
      itemCount: activeCartItems.length
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = apiRateLimit(clientId);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          }
        }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity } = addToCartSchema.parse({
      productId: sanitizeUserInput(body.productId),
      quantity: body.quantity
    });

    // Verify product exists and is active
    const product = await db.product.findUnique({
      where: { 
        id: productId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found or inactive' }, { status: 404 });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: `Only ${product.stock} items available in stock` },
        { status: 400 }
      );
    }

    // Get or create user cart
    let userCart = await db.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!userCart) {
      userCart = await db.cart.create({
        data: { userId: session.user.id }
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await db.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: userCart.id,
          productId: productId
        }
      }
    });

    let cartItem;

    if (existingCartItem) {
      // Update existing item
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: `Cannot add ${quantity} items. Maximum available: ${product.stock - existingCartItem.quantity}` },
          { status: 400 }
        );
      }

      cartItem = await db.cartItem.update({
        where: {
          cartId_productId: {
            cartId: userCart.id,
            productId: productId
          }
        },
        data: {
          quantity: newQuantity
        }
      });
    } else {
      // Create new cart item
      cartItem = await db.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: productId,
          quantity: quantity
        }
      });
    }

    return NextResponse.json({
      message: 'Item added to cart successfully',
      cartItem: {
        ...cartItem,
        product: {
          name: product.name,
          price: product.price
        }
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = apiRateLimit(clientId);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          }
        }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity } = updateCartSchema.parse({
      productId: sanitizeUserInput(body.productId),
      quantity: body.quantity
    });

    // Get user cart
    const userCart = await db.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!userCart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    if (quantity === 0) {
      // Remove item from cart
      await db.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: userCart.id,
            productId: productId
          }
        }
      });

      return NextResponse.json({ message: 'Item removed from cart' });
    }

    // Verify product exists and check stock
    const product = await db.product.findUnique({
      where: { 
        id: productId,
        isActive: true
      },
      select: {
        id: true,
        stock: true,
        price: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found or inactive' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: `Only ${product.stock} items available in stock` },
        { status: 400 }
      );
    }

    // Update cart item
    const cartItem = await db.cartItem.update({
      where: {
        cartId_productId: {
          cartId: userCart.id,
          productId: productId
        }
      },
      data: {
        quantity: quantity
      }
    });

    return NextResponse.json({
      message: 'Cart updated successfully',
      cartItem
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = apiRateLimit(clientId);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          }
        }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user cart
    const userCart = await db.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!userCart) {
      return NextResponse.json({ message: 'Cart is already empty' });
    }

    // Clear entire cart
    await db.cartItem.deleteMany({
      where: {
        cartId: userCart.id
      }
    });

    return NextResponse.json({ message: 'Cart cleared successfully' });

  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}