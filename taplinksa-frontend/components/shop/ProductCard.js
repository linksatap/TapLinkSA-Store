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
  const hasDiscount = product.on_sale && regularPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - price) / regularPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    router.push('/cart');
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    router.push('/checkout');
  };

  const isOutOfStock = product.stock_status !== 'instock';

  return (
    <motion.div
      whileHover={!isOutOfStock ? { y: -8 } : {}}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/shop/${product.slug}`} className="block h-full">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group h-full flex flex-col">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />

            {/* Sale Badge */}
            {product.on_sale && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="absolute top-4 right-4"
              >
                <Badge variant="sale">
                  <span className="font-bold text-sm">خصم {discountPercent}%</span>
                </Badge>
              </motion.div>
            )}

            {/* Featured Badge */}
            {product.featured && (
              <motion.div
                initial={{ scale: 0, rotate: 45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="absolute top-4 left-4"
              >
                <Badge variant="primary">الأكثر مبيعاً</Badge>
              </motion.div>
            )}

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                  غير متوفر
                </span>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className="p-6 flex flex-col flex-1">
            {/* Product Name */}
            <Link href={`/shop/${product.slug}`}>
              <h3 className="text-lg font-bold mb-3 group-hover:text-gold transition-colors line-clamp-2 text-gray-900">
                {product.name}
              </h3>
            </Link>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.short_description.replace(/<[^>]*>/g, '')}
              </p>
            )}

            {/* Price Section */}
            <div className="mb-4 py-4 border-t border-b border-gray-200">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gold">{price} ⃁</span>
                {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through">
                    {regularPrice} ⃁
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-green-600 text-sm font-semibold">
                  وفر {(regularPrice - price).toFixed(2)} ⃁
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <Badge
                variant={isOutOfStock ? 'error' : 'success'}
                className="w-full text-center justify-center"
              >
                {isOutOfStock ? 'غير متوفر' : 'متوفر الآن'}
              </Badge>
            </div>

            {/* Action Buttons - Flex grow to push to bottom */}
            <div className="flex flex-col gap-3 mt-auto">
              <motion.button
                whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full bg-gold hover:bg-yellow-500 disabled:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:shadow-sm disabled:opacity-60"
                aria-label={`شراء ${product.name}`}
              >
                🚀 شراء الآن
              </motion.button>

              <motion.button
                whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 border-2 border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={`إضافة ${product.name} للسلة`}
              >
                🛒 إضافة للسلة
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
