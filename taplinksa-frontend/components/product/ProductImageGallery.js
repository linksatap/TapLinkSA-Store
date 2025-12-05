// components/product/ProductImageGallery.js
import { useState } from 'react';
import Image from 'next/image';

export default function ProductImageGallery({
  images = [],
  productName,
  isOnSale,
  discountPercentage,
  selectedImage,
  onImageChange,
}) {
  if (!images.length) return null;

  return (
    <div className="space-y-4" data-aos="fade-right">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-2xl shadow-xl overflow-hidden group">
        <Image
          src={images[selectedImage]?.src || images[0]?.src}
          alt={`${productName}${selectedImage > 0 ? ` - صورة ${selectedImage + 1}` : ''}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 md:p-8 group-hover:scale-105 transition-transform duration-300"
          priority
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3C/svg%3E"
        />

        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg z-10 animate-pulse">
            وفر {discountPercentage}%
          </div>
        )}

        {/* Navigation Arrows (RTL Fixed) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => onImageChange((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10 active:scale-95"
              aria-label="الصورة التالية"
              title="الصورة التالية (اليمين)"
            >
              ←
            </button>
            <button
              onClick={() => onImageChange((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10 active:scale-95"
              aria-label="الصورة السابقة"
              title="الصورة السابقة (اليسار)"
            >
              →
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs z-10 font-medium">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => onImageChange(index)}
              className={`relative aspect-square bg-white rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gold/50 ${
                selectedImage === index
                  ? 'ring-4 ring-gold shadow-lg scale-105'
                  : 'ring-2 ring-gray-200 hover:ring-gold hover:shadow-md'
              }`}
              title={`صورة ${index + 1}`}
              aria-label={`اختر صورة ${index + 1}`}
              aria-pressed={selectedImage === index}
            >
              <Image
                src={img.src}
                alt={`${productName} - صورة ${index + 1}`}
                fill
                sizes="(max-width: 768px) 80px, 100px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
