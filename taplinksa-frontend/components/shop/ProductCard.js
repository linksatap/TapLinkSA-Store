import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Badge from '../ui/Badge';

export default function ProductCard({ product, priority = false }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const image = product.images?.[0]?.src || '/placeholder-product.jpg';
  const hoverImage = product.images?.[1]?.src || image;
  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const discount = regularPrice > price ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    // Show toast notification here
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    router.push('/checkout');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link 
        href={`/products/${product.slug}`}
        className="block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        {/* Badges Container */}
        <div className="absolute top-2 left-2 right-2 z-10 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {product.on_sale && discount > 0 && (
              <Badge variant="sale" className="text-xs font-bold">
                -{discount}%
              </Badge>
            )}
            {product.featured && (
              <Badge variant="featured" className="text-xs">
                🔥 الأكثر مبيعاً
              </Badge>
            )}
            {isNewProduct(product.date_created) && (
              <Badge variant="new" className="text-xs">
                ✨ جديد
              </Badge>
            )}
          </div>
          
          {/* Stock Badge */}
          {product.stock_status !== 'instock' && (
            <Badge variant="outofstock" className="text-xs">
              نفذت الكمية
            </Badge>
          )}
        </div>

        {/* Image Container with Aspect Ratio */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          <Image
            src={isHovered ? hoverImage : image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoadingComplete={() => setImageLoaded(true)}
            priority={priority}
            quality={85}
          />
          
          {/* Quick Actions Overlay */}
          <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_status !== 'instock'}
                className="flex-1 bg-white text-dark text-xs font-bold py-2 px-3 rounded-lg hover:bg-gold hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🛒 أضف للسلة
              </button>
              <button
                className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                aria-label="Add to wishlist"
              >
                ❤️
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 md:p-4">
          {/* Product Name */}
          <h3 className="text-sm md:text-base font-bold text-dark mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] group-hover:text-gold transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.average_rating && parseFloat(product.average_rating) > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex text-yellow-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.round(parseFloat(product.average_rating)) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.rating_count || 0})
              </span>
            </div>
          )}

          {/* Price Container */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg md:text-xl font-bold text-gold">
              {price.toFixed(2)} ر.س
            </span>
            {product.on_sale && regularPrice > price && (
              <span className="text-xs md:text-sm text-gray-400 line-through">
                {regularPrice.toFixed(2)} ر.س
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            product.stock_status === 'instock' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              product.stock_status === 'instock' ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {product.stock_status === 'instock' ? 'متوفر' : 'غير متوفر'}
          </div>

          {/* Buy Now Button - Mobile Only */}
          <button
            onClick={handleBuyNow}
            disabled={product.stock_status !== 'instock'}
            className="w-full mt-3 bg-gold text-white text-sm font-bold py-2.5 px-4 rounded-lg hover:bg-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed md:hidden"
          >
            🚀 شراء الآن
          </button>
        </div>
      </Link>
    </motion.div>
  );
}

// Helper function
function isNewProduct(dateCreated) {
  if (!dateCreated) return false;
  const created = new Date(dateCreated);
  const now = new Date();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
}
