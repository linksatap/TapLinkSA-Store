// pages/shop/[slug].js - Updated with Variations Support

import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';

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

import ProductReviews from '../../components/product/ProductReviews';
import { fetchProductWithVariations, fetchRelatedProducts } from '../../lib/woocommerce';

export default function ProductPage({ product: initialProduct, variations: initialVariations = [], relatedProducts }) {
  const router = useRouter();
  const [selectedVariationId, setSelectedVariationId] = useState(null);
  
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

  const product = initialProduct;
  const images = product.images || [];

  // Handle variations
  const selectedVariation = useMemo(() => {
    if (!selectedVariationId || !initialVariations.length) {
      return null;
    }
    return initialVariations.find(v => v.id === selectedVariationId);
  }, [selectedVariationId, initialVariations]);

  // Get current product data (either variation or main product)
  const currentProduct = selectedVariation || product;
  const currentImages = selectedVariation?.image 
    ? [{ src: selectedVariation.image.src }] 
    : images;
  
  const price = parseFloat(selectedVariation?.price || product.price || 0);
  const regularPrice = parseFloat(selectedVariation?.regular_price || product.regular_price || price);
  
  const discountPercentage =
    regularPrice > price
      ? Math.round(((regularPrice - price) / regularPrice) * 100)
      : 0;
  const isOnSale = currentProduct.on_sale && discountPercentage > 0;
  const isOutOfStock = currentProduct.stock_status !== 'instock';

  // Handle variant selection
  const handleVariantSelect = (variationId) => {
    setSelectedVariationId(variationId);
    productState.setSelectedImage(0);
  };

  // Handle cart operations
  const handleAddToCart = () => {
    const itemData = {
      ...product,
      ...(selectedVariation && {
        variation_id: selectedVariation.id,
        attributes: selectedVariation.attributes,
        price: selectedVariation.price,
        image: selectedVariation.image,
      }),
    };
    
    productActions.handleAddToCart(
      itemData,
      productState.quantity,
      productState.selectedOptions
    );
  };

  const handleBuyNow = () => {
    const itemData = {
      ...product,
      ...(selectedVariation && {
        variation_id: selectedVariation.id,
        attributes: selectedVariation.attributes,
        price: selectedVariation.price,
      }),
    };
    
    productActions.handleBuyNow(
      itemData,
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
        <meta property="og:image" content={currentImages[0]?.src} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={price} />
        <meta property="product:price:currency" content="SAR" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: currentImages.map((img) => img.src),
            description: product.short_description?.replace(/<[^>]*>/g, ''),
            sku: currentProduct.sku,
            offers: {
              '@type': 'Offer',
              price: price,
              priceCurrency: 'SAR',
              availability: isOutOfStock
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
              url: `https://taplinksa.com/shop/${product.slug}`,
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

      <div className="bg-gradient-to-br from-gold/5 via-white to-gray-50 min-h-screen py-6 md:py-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
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
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* LEFT: Image Gallery */}
            <ProductImageGallery
              images={currentImages}
              productName={product.name}
              isOnSale={isOnSale}
              discountPercentage={discountPercentage}
              selectedImage={productState.selectedImage}
              onImageChange={productState.setSelectedImage}
            />

            {/* RIGHT: Product Details */}
            <div className="space-y-4" data-aos="fade-left">
              <ProductHeader product={product} />

              <ProductPrice
                price={price}
                regularPrice={regularPrice}
                isOnSale={isOnSale}
                discountPercentage={discountPercentage}
                isOutOfStock={isOutOfStock}
              />

              {product.short_description && (
                <div
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
              )}

              {/* Variants Selection */}
              {initialVariations.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-dark mb-4">اختر النوع:</h3>
                  <div className="space-y-3">
                    {initialVariations.map((variation) => {
                      const varPrice = parseFloat(variation.price || 0);
                      const varRegularPrice = parseFloat(variation.regular_price || varPrice);
                      const varDiscount =
                        varRegularPrice > varPrice
                          ? Math.round(((varRegularPrice - varPrice) / varRegularPrice) * 100)
                          : 0;

                      return (
                        <button
                          key={variation.id}
                          onClick={() => handleVariantSelect(variation.id)}
                          className={`w-full p-3 text-right border-2 rounded-lg transition-all ${
                            selectedVariationId === variation.id
                              ? 'border-gold bg-gold/10'
                              : 'border-gray-200 hover:border-gold'
                          } ${variation.stock_status !== 'instock' ? 'opacity-50' : ''}`}
                          disabled={variation.stock_status !== 'instock'}
                        >
                          <div className="flex justify-between items-center">
                            <div className="text-right">
                              <p className="font-bold text-dark">
                                {variation.attributes
                                  ?.map(attr => `${attr.option}`)
                                  .join(' - ')}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-gold font-bold">
                                  {varPrice.toFixed(2)} ر.س
                                </span>
                                {varDiscount > 0 && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {varRegularPrice.toFixed(2)} ر.س
                                  </span>
                                )}
                              </div>
                            </div>
                            {variation.stock_status !== 'instock' && (
                              <span className="text-red-500 text-sm">غير متوفر</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Regular Variants */}
              <ProductVariants
                attributes={product.attributes}
                selectedOptions={productState.selectedOptions}
                isOutOfStock={isOutOfStock}
                onOptionChange={productState.handleOptionChange}
              />

              <ProductQuantity
                quantity={productState.quantity}
                onQuantityChange={productState.handleQuantityChange}
                isOutOfStock={isOutOfStock}
              />

              <ProductActions
                isOutOfStock={isOutOfStock}
                loading={productActions.loading}
                addedToCart={productActions.addedToCart}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />

              <ProductTrustBadges />
            </div>
          </div>

          {/* Product Description & Specs */}
          {(product.description ||
            (product.attributes && product.attributes.length > 0)) && (
            <div
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8"
              data-aos="fade-up"
            >
              <ProductDescription description={product.description} />
              <ProductSpecs attributes={product.attributes} />
            </div>
          )}

          {/* Reviews Section */}
          <ProductReviews 
            productId={product.id}
            reviews={product.reviews || []}
          />

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-12">
              <ProductRelated relatedProducts={relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params, req }) {
  const { slug } = params;

  try {
    const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

    const headers = {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };

    // Fetch product and variations
    const { product, variations } = await fetchProductWithVariations(slug, headers);

    if (!product) {
      return {
        props: {
          product: { error: true },
          variations: [],
          relatedProducts: [],
        },
      };
    }

    // Fetch related products
    const relatedProducts = await fetchRelatedProducts(product.id, headers);

    return {
      props: {
        product,
        variations,
        relatedProducts,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        product: { error: true },
        variations: [],
        relatedProducts: [],
      },
    };
  }
}
