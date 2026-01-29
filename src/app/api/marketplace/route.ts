import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract query parameters
    const search = searchParams.get('search') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const storesParam = searchParams.get('stores');
    const stores = storesParam ? storesParam.split(',').filter(Boolean) : undefined;
    const productType = searchParams.get('productType') || undefined;
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build where clause
    const where: any = {
      active: true,
      store: {
        status: 'approved'
      }
    };

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add price filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Add store filter
    if (stores && stores.length > 0) {
      where.store_id = { in: stores };
    }

    // Add product type filter
    if (productType && productType !== 'all') {
      where.interval = productType;
    }

    // Build orderBy clause
    let orderBy: any;
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'store':
        orderBy = { store: { name: 'asc' } };
        break;
      case 'newest':
      default:
        orderBy = { created_at: 'desc' };
        break;
    }

    // Fetch products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              subdomain: true,
              logo_url: true
            }
          }
        },
        orderBy,
        take: limit,
        skip: (page - 1) * limit
      }),
      prisma.product.count({ where })
    ]);

    // Also fetch all approved stores for filter options
    const allStores = await prisma.store.findMany({
      where: {
        status: 'approved',
        products: {
          some: {
            active: true
          }
        }
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      stores: allStores
    });
  } catch (error) {
    console.error("Marketplace API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
