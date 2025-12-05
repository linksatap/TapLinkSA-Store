import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useState, memo } from 'react';
import { useCart } from '../../context/CartContext';
import Badge from '../ui/Badge';

const ProductCard = memo(({ product, priority = false, index = 0 }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  const image = product.images?.[0]?.src || '/placeholder-product.jpg';
  const hoverImage = product.images?.[1]?.src || image;
  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const discount = regularPrice > price ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;
  const isOutOfStock = product.stock_status !== 'instock';
  
  // Check if product is new (created within last 30 days)
  const isNew = () => {
    if (!product.date_created) return false;
    const created = new Date(product.date_created);
    const now = new Date();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    addToCart(product);
    setShowQuickAdd(true);
    
    // Show success feedback
    setTimeout(() => setShowQuickAdd(false), 2000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    addToCart(product);
    router.push('/checkout');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link 
        href={`/products/${product.slug}`}
        className="block bg-white rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
      >
        {/* Image Container with Aspect Ratio */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}
          
          {/* Product Image */}
          <Image
            src={isHovered ? hoverImage : image}
            alt={`${product.name} - ${product.categories?.[0]?.name || 'منتج'}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered && !isOutOfStock ? 'scale-105' : 'scale-100'}`}
            onLoadingComplete={() => setImageLoaded(true)}
            priority={priority}
            quality={85}
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-red-500 text-white font-bold px-6 py-3 rounded-full text-sm md:text-base">
                نفذت الكمية
              </span>
            </div>
          )}

          {/* Badges Container - Top Left */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
            {product.on_sale && discount > 0 && !isOutOfStock && (
              <Badge variant="sale" className="text-xs font-bold shadow-lg">
                وفر {discount}%
              </Badge>
            )}
            {product.featured && !isOutOfStock && (
              <Badge variant="featured" className="text-xs shadow-lg">
                🔥 الأكثر مبيعاً
              </Badge>
            )}
            {isNew() && !isOutOfStock && (
              <Badge variant="new" className="text-xs shadow-lg">
                ✨ جديد
              </Badge>
            )}
          </div>

          {/* Quick Add Button - Appears on Hover (Desktop Only) */}
          {!isOutOfStock && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10 
              }}
              transition={{ duration: 0.2 }}
              onClick={handleQuickAdd}
              className="hidden md:flex absolute bottom-3 left-3 right-3 bg-gold text-white font-bold py-2.5 rounded-lg items-center justify-center gap-2 hover:bg-gold-dark transition-colors shadow-xl"
            >
              {showQuickAdd ? (
                <>✓ تمت الإضافة</>
              ) : (
                <>🛒 إضافة سريعة</>
              )}
            </motion.button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 md:p-4">
          {/* Product Name */}
          <h3 className="text-sm md:text-base font-bold text-dark mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] group-hover:text-gold transition-colors">
            {product.name}
          </h3>

          {/* Rating (if available) */}
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

          {/* Stock Status Badge */}
          <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full mb-3 ${
            isOutOfStock 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'
            }`}></span>
            {isOutOfStock ? 'غير متوفر' : 'متوفر'}
          </div>

          {/* Mobile CTA Buttons */}
          <div className="grid grid-cols-2 gap-2 md:hidden">
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className="bg-white border-2 border-gold text-gold text-xs font-bold py-2 rounded-lg hover:bg-gold hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛒 أضف
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="bg-gold text-white text-xs font-bold py-2 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 اشتري
            </button>
          </div>
        </div>
      </Link>

      {/* Success Toast */}
      {showQuickAdd && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20"
        >
          ✓ تمت الإضافة
        </motion.div>
      )}
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
