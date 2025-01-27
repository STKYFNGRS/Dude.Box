import { getCollectionProducts } from 'lib/shopify';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';

export async function Carousel() {
  const products = await getCollectionProducts({ collection: 'the-origin-collection-first-drop' });

  if (!products?.length) return null;

  // Duplicating products for infinite scroll effect
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="flex justify-center">
      <div className="w-[900px] md:w-[900px] overflow-hidden">
        <div className="animate-carousel flex gap-4 px-4">
          {carouselProducts.map((product, i) => (
            <div
              key={`${product.handle}${i}`}
              className="relative aspect-square h-[200px] w-[200px] max-w-[200px] flex-none"
            >
              <Link href={`/product/${product.handle}`} className="relative h-full w-full">
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode: product.priceRange.maxVariantPrice.currencyCode
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="200px"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}