import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function StickyAddToCart({ show, product, price, onAddToCart, onBuyNow }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gold shadow-2xl md:hidden"
        >
          <div className="container-custom px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Product Thumbnail */}
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={product.images?.[0]?.src || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{product.name}</p>
                <p className="text-lg font-bold text-gold">{price.toFixed(2)} ر.س</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={onAddToCart}
                  className="bg-white border-2 border-gold text-gold font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                >
                  🛒 أضف
                </button>
                <button
                  onClick={onBuyNow}
                  className="bg-gold text-white font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                >
                  🚀 اشتري
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
