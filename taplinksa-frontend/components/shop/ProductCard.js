import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import Badge from '../ui/Badge';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const image = product.images?.[0]?.src || '/placeholder-product.jpg';
  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  
  // Calculate discount percentage
  const discountPercentage = regularPrice > price 
    ? Math.round(((regularPrice - price) / regularPrice) * 100) 
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    router.push('/cart');
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    addToCart(product);
    router.push('/checkout');
  };

  const isOutOfStock = product.stock_status !== 'instock';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group h-full"
    >
      <Link 
        href={`/products/${product.slug}`}
        className="block h-full"
      >
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
          {/* Image Container with Fixed Aspect Ratio */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badges Container */}
            <div className="absolute top-2 left-2 right-2 z-10 flex flex-col gap-1.5">
              {product.on_sale && discountPercentage > 0 && (
                <Badge variant="sale" className="text-xs font-bold w-fit">
                  وفر {discountPercentage}%
                </Badge>
              )}
              {product.featured && (
                <Badge variant="featured" className="text-xs w-fit">
                  🔥 الأكثر مبيعاً
                </Badge>
              )}
            </div>

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
                  نفذت الكمية
                </span>
              </div>
            )}
          </div>

          {/* Product Info - Flex-1 to push buttons to bottom */}
          <div className="p-3 md:p-4 flex flex-col flex-1">
            {/* Product Name - Clamped to 2 lines */}
            <h3 className="text-sm md:text-base font-bold text-dark mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] group-hover:text-gold transition-colors">
              {product.name}
            </h3>

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
            <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-3 w-fit ${
              isOutOfStock 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'
              }`}></span>
              {isOutOfStock ? 'غير متوفر' : 'متوفر'}
            </div>

            {/* Spacer to push buttons to bottom */}
            <div className="flex-1"></div>

            {/* Action Buttons - Better spacing on mobile */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="bg-gold text-white text-xs md:text-sm font-bold py-2.5 md:py-3 px-3 md:px-4 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                <span>🚀</span>
                <span className="hidden sm:inline">شراء الآن</span>
                <span className="sm:hidden">شراء</span>
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="bg-white border-2 border-gold text-gold text-xs md:text-sm font-bold py-2.5 md:py-3 px-3 md:px-4 rounded-lg hover:bg-gold hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                <span>🛒</span>
                <span className="hidden sm:inline">إضافة للسلة</span>
                <span className="sm:hidden">أضف</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
