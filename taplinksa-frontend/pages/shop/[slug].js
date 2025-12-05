// pages/products/[slug].js - Fixed Version
// Refactored to use component-based architecture

import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { useRouter } from 'next/router';

// Import all product components
import {
  ProductImageGallery,
  ProductHeader,
  ProductPrice,
  ProductVariants,
  ProductQuantity,
  ProductActions,
  ProductTrustBadges,
  ProductDescription,
  ProductSpecs,
  ProductRelated,
  ProductSkeleton,
  useProductState,
  useProductActions,
} from '../../components/product';

export default function ProductPage({ product: initialProduct, relatedProducts }) {
  const router = useRouter();
  
  // Use custom hooks for state management
  const productState = useProductState(initialProduct);
  const productActions = useProductActions();

  // Loading state
  if (router.isFallback || !initialProduct) {
    return (
      <Layout>
        <ProductSkeleton />
      </Layout>
    );
  }

  // Product not found
  if (!initialProduct || initialProduct.error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-6">😔</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              عذراً، لم نتمكن من العثور على هذا المنتج
            </h1>
            <button
              onClick={() => router.push('/shop')}
              className="btn-primary"
            >
              العودة للمتجر
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Compute derived values
  const product = initialProduct;
  const images = product.images || [];
  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const discountPercentage =
    regularPrice > price
      ? Math.round(((regularPrice - price) / regularPrice) * 100)
      : 0;
  const isOnSale = product.on_sale && discountPercentage > 0;
  const isOutOfStock = product.stock_status !== 'instock';

  // Handle cart operations
  const handleAddToCart = () => {
    productActions.handleAddToCart(
      product,
      productState.quantity,
      productState.selectedOptions
    );
  };

  const handleBuyNow = () => {
    productActions.handleBuyNow(
      product,
      productState.quantity,
      productState.selectedOptions
    );
  };

  return (
    <Layout title={`${product.name} | تاب لينك السعودية`}>
      <Head>
        <title>{product.name} | تاب لينك السعودية</title>
        <meta
          name="description"
          content={product.short_description?.replace(/<[^>]*>/g, '') || product.name}
        />
        <meta property="og:title" content={product.name} />
        <meta
          property="og:description"
          content={product.short_description?.replace(/<[^>]*>/g, '')}
        />
        <meta property="og:image" content={images[0]?.src} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={price} />
        <meta property="product:price:currency" content="SAR" />

        {/* Product Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: images.map((img) => img.src),
            description: product.short_description?.replace(/<[^>]*>/g, ''),
            sku: product.sku,
            offers: {
              '@type': 'Offer',
              price: price,
              priceCurrency: 'SAR',
              availability: isOutOfStock
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
              url: `https://taplinksa.com/products/${product.slug}`,
            },
            ...(product.average_rating && {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.average_rating,
                reviewCount: product.rating_count || 0,
              },
            }),
          })}
        </script>
      </Head>

      <div className="bg-gradient-to-br from-gold/5 via-white to-gray-50 min-h-screen py-6 md:py-12">
        <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" data-aos="fade-right">
            <ol className="flex items-center gap-2 text-gray-600">
              <li>
                <a href="/" className="hover:text-gold transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>/</li>
              <li>
                <a href="/shop" className="hover:text-gold transition-colors">
                  المتجر
                </a>
              </li>
              <li>/</li>
              <li className="text-gold font-medium truncate">{product.name}</li>
            </ol>
          </nav>

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* LEFT: Image Gallery */}
            <ProductImageGallery
              images={images}
              productName={product.name}
              isOnSale={isOnSale}
              discountPercentage={discountPercentage}
              selectedImage={productState.selectedImage}
              onImageChange={productState.setSelectedImage}
            />

            {/* RIGHT: Product Details */}
            <div className="space-y-6" data-aos="fade-left">
              {/* Product Header */}
              <ProductHeader product={product} />

              {/* Price Section */}
              <ProductPrice
                price={price}
                regularPrice={regularPrice}
                isOnSale={isOnSale}
                discountPercentage={discountPercentage}
                isOutOfStock={isOutOfStock}
              />

              {/* Short Description */}
              {product.short_description && (
                <div
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
              )}

              {/* Variants */}
              <ProductVariants
                attributes={product.attributes}
                selectedOptions={productState.selectedOptions}
                isOutOfStock={isOutOfStock}
                onOptionChange={productState.handleOptionChange}
              />

              {/* Quantity */}
              <ProductQuantity
                quantity={productState.quantity}
                onQuantityChange={productState.handleQuantityChange}
                isOutOfStock={isOutOfStock}
              />

              {/* CTA Buttons */}
              <ProductActions
                isOutOfStock={isOutOfStock}
                loading={productActions.loading}
                addedToCart={productActions.addedToCart}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />

              {/* Trust Badges */}
              <ProductTrustBadges />
            </div>
          </div>

          {/* Product Description & Specs */}
          {(product.description ||
            (product.attributes && product.attributes.length > 0)) && (
            <div
              className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-12"
              data-aos="fade-up"
            >
              <ProductDescription description={product.description} />
              <ProductSpecs attributes={product.attributes} />

              {!product.description &&
                product.attributes.filter((attr) => !attr.variation).length ===
                  0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>لا توجد مواصفات تقنية متاحة لهذا المنتج</p>
                  </div>
                )}
            </div>
          )}

          {/* Related Products */}
          <ProductRelated relatedProducts={relatedProducts} />
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params, req }) {
  const { slug } = params;

  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'taplinksa.com';
    const baseUrl = `${protocol}://${host}`;

    // WooCommerce REST API endpoints
    const WC_API_URL = process.env.NEXT_PUBLIC_WC_API_URL || 'https://your-woocommerce-site.com/wp-json/wc/v3';
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    // Build auth header for WooCommerce REST API
    const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

    const [productRes, relatedRes] = await Promise.all([
      // Fetch single product by slug
      fetch(`${WC_API_URL}/products?slug=${slug}`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }),
      // Fetch related products
      fetch(`${WC_API_URL}/products?per_page=4&orderby=popularity`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }).catch(() => ({
        json: () => ({ products: [] }),
      })),
    ]);

    const products = await productRes.json();
    const relatedData = await relatedRes.json();

    // Get first product from array
    const product = Array.isArray(products) && products.length > 0 ? products[0] : null;

    if (!product) {
      return {
        props: {
          product: { error: true },
          relatedProducts: [],
        },
        revalidate: 60,
      };
    }

    return {
      props: {
        product,
        relatedProducts: Array.isArray(relatedData) ? relatedData.slice(0, 4) : [],
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      props: {
        product: { error: true },
        relatedProducts: [],
      },
      revalidate: 60,
    };
  }
}
