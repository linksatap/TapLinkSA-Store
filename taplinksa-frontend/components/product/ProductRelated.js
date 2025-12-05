// components/product/ProductRelated.js - Fixed

import Link from 'next/link';
import { useState } from 'react';

export default function ProductRelated({ relatedProducts = [] }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  const handleLinkClick = () => {
    setIsLoading(true);
  };

  return (
    <section className="mt-16 mb-12" data-aos="fade-up">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-dark">منتجات مرتبطة</h2>
        <p className="text-gray-600 mt-2">قد تهتم بهذه المنتجات أيضاً</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          if (!product || !product.slug) {
            return null;
          }

          const price = parseFloat(product.price || 0);
          const regularPrice = parseFloat(product.regular_price || product.price || 0);
          const discountPercentage =
            regularPrice > price
              ? Math.round(((regularPrice - price) / regularPrice) * 100)
              : 0;
          const isOnSale = product.on_sale && discountPercentage > 0;
          const image = product.images?.[0];

          return (
            <Link key={product.id} href={`/shop/${product.slug}`}>
              <a
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden block"
                onClick={handleLinkClick}
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  {image?.src && (
                    <img
                      src={image.src}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}

                  {/* Discount Badge */}
                  {isOnSale && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{discountPercentage}%
                    </div>
                  )}

                  {/* Out of Stock */}
                  {product.stock_status !== 'instock' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">غير متوفر</span>
                    </div>
                  )}

                  {/* Overlay CTA */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-gold text-dark font-bold px-6 py-2 rounded-lg">
                      عرض التفاصيل
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Name */}
                  <h3 className="font-bold text-dark line-clamp-2 group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-lg font-bold text-gold">
                      {price.toFixed(2)} ر.س
                    </span>
                    {isOnSale && regularPrice > price && (
                      <span className="text-sm text-gray-500 line-through">
                        {regularPrice.toFixed(2)} ر.س
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {product.average_rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.round(product.average_rating)
                                ? 'text-gold'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.rating_count || 0})
                      </span>
                    </div>
                  )}
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
