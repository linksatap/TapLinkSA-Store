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
  const isOnSale = product.on_sale && regularPrice > price;
  const isInStock = product.stock_status === 'instock';
  const discount = isOnSale 
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true, margin: '-50px' }}
      className="group flex flex-col h-full bg-white rounded-lg border border-gray-200 hover:border-teal-300 overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      {/* Product Image Container */}
      <div className="relative w-full bg-gray-50 aspect-square overflow-hidden flex items-center justify-center">
        <Link href={`/product/${product.slug}`}>
          <a className="relative w-full h-full block">
            <Image
              src={image}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
              priority={false}
            />
          </a>
        </Link>

        {/* Badge Container - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {isOnSale && discount > 0 && (
            <Badge 
              variant="sale" 
              className="bg-red-500 text-white text-xs font-bold px-2 py-1"
            >
              -{discount}%
            </Badge>
          )}
          {product.featured && (
            <Badge 
              variant="featured" 
              className="bg-amber-400 text-slate-900 text-xs font-bold px-2 py-1"
            >
              الأكثر مبيعاً
            </Badge>
          )}
        </div>

        {/* Stock Status - Top Right */}
        {!isInStock && (
          <div className="absolute top-3 right-3 bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            غير متوفر
          </div>
        )}
      </div>

      {/* Product Info Container */}
      <div className="flex-1 flex flex-col p-4 space-y-3">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <a className="line-clamp-2 font-semibold text-slate-900 hover:text-teal-600 transition-colors text-sm leading-tight">
            {product.name}
          </a>
        </Link>

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            {price.toFixed(2)} ر.س
          </span>
          {isOnSale && regularPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              {regularPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div className={`text-xs font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
          {isInStock ? '✓ متوفر' : '✗ غير متوفر'}
        </div>

        {/* Spacer for flex layout */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={handleBuyNow}
            disabled={!isInStock}
            className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              isInStock
                ? 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label={`شراء ${product.name} الآن`}
          >
            شراء الآن
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              isInStock
                ? 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50 active:scale-95'
                : 'border-2 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label={`إضافة ${product.name} للسلة`}
          >
            السلة
          </button>
        </div>
      </div>
    </motion.div>
  );
}
