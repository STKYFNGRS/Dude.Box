import { GridTileImage } from 'components/grid/tile';
import { getCollectionProducts } from 'lib/shopify';
import type { Product } from 'lib/shopify/types';
import Link from 'next/link';
import Grid from './index';

export async function ThreeItemGrid() {
  const homepageItems = await getCollectionProducts({
    collection: 'the-origin-collection-first-drop'
  });

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <div className="mx-auto">
      {/* Mobile and tablet layout */}
      <div className="md:hidden flex">
        <div className="w-[60vw] h-[60vw] max-w-[300px] max-h-[300px]">
          <Link href={`/product/${firstProduct.handle}`}>
            <GridTileImage
              alt={firstProduct.title}
              label={{
                title: firstProduct.title,
                amount: firstProduct.priceRange.maxVariantPrice.amount,
                currencyCode: firstProduct.priceRange.maxVariantPrice.currencyCode
              }}
              src={firstProduct.featuredImage?.url}
              fill
              sizes="60vw"
              priority={true}
            />
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="w-[40vw] h-[30vw] max-w-[140px] max-h-[140px] mb-4">
            <Link href={`/product/${secondProduct.handle}`}>
              <GridTileImage
                alt={secondProduct.title}
                label={{
                  title: secondProduct.title,
                  amount: secondProduct.priceRange.maxVariantPrice.amount,
                  currencyCode: secondProduct.priceRange.maxVariantPrice.currencyCode
                }}
                src={secondProduct.featuredImage?.url}
                fill
                sizes="40vw"
                priority={true}
              />
            </Link>
          </div>
          <div className="w-[40vw] h-[30vw] max-w-[140px] max-h-[140px]">
            <Link href={`/product/${thirdProduct.handle}`}>
              <GridTileImage
                alt={thirdProduct.title}
                label={{
                  title: thirdProduct.title,
                  amount: thirdProduct.priceRange.maxVariantPrice.amount,
                  currencyCode: thirdProduct.priceRange.maxVariantPrice.currencyCode
                }}
                src={thirdProduct.featuredImage?.url}
                fill
                sizes="40vw"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop: Fixed size layout */}
      <div className="hidden md:flex md:justify-center">
        <div className="flex gap-4">
          <div className="w-[600px] h-[600px]">
            <Link href={`/product/${firstProduct.handle}`}>
              <GridTileImage
                alt={firstProduct.title}
                label={{
                  title: firstProduct.title,
                  amount: firstProduct.priceRange.maxVariantPrice.amount,
                  currencyCode: firstProduct.priceRange.maxVariantPrice.currencyCode
                }}
                src={firstProduct.featuredImage?.url}
                fill
                sizes="600px"
                priority={true}
              />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-[290px] h-[290px]">
              <Link href={`/product/${secondProduct.handle}`}>
                <GridTileImage
                  alt={secondProduct.title}
                  label={{
                    title: secondProduct.title,
                    amount: secondProduct.priceRange.maxVariantPrice.amount,
                    currencyCode: secondProduct.priceRange.maxVariantPrice.currencyCode
                  }}
                  src={secondProduct.featuredImage?.url}
                  fill
                  sizes="290px"
                  priority={true}
                />
              </Link>
            </div>
            <div className="w-[290px] h-[290px]">
              <Link href={`/product/${thirdProduct.handle}`}>
                <GridTileImage
                  alt={thirdProduct.title}
                  label={{
                    title: thirdProduct.title,
                    amount: thirdProduct.priceRange.maxVariantPrice.amount,
                    currencyCode: thirdProduct.priceRange.maxVariantPrice.currencyCode
                  }}
                  src={thirdProduct.featuredImage?.url}
                  fill
                  sizes="290px"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}