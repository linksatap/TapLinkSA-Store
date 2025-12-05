import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductImageGallery({ images, productName, onSale, discount }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-2xl shadow-xl overflow-hidden group">
        {/* Badges */}
        {onSale && discount > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
            وفر {discount}%
          </div>
        )}

        {/* Zoom Icon */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label="Zoom image"
        >
          🔍
        </button>

        <Image
          src={images[selectedIndex]?.src || '/placeholder-product.jpg'}
          alt={`${productName} - صورة ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          priority
          quality={90}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? 'border-gold scale-105 shadow-lg'
                  : 'border-gray-200 hover:border-gold/50'
              }`}
            >
              <Image
                src={image.src}
                alt={`${productName} - صورة مصغرة ${index + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full max-w-4xl aspect-square"
            >
              <Image
                src={images[selectedIndex]?.src || '/placeholder-product.jpg'}
                alt={productName}
                fill
                className="object-contain"
                quality={100}
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 bg-white text-dark p-3 rounded-full text-2xl hover:bg-gray-100"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
