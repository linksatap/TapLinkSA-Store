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
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
    >
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {product.on_sale && (
            <Badge variant="sale" className="absolute top-4 right-4">
              تخفيض
            </Badge>
          )}
          
          {product.featured && (
            <Badge variant="primary" className="absolute top-4 left-4">
              الأكثر مبيعاً
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div
          className="text-gray-600 text-sm mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: product.short_description }}
        />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gold">
              {price} ر.س
            </span>
            {product.on_sale && regularPrice > price && (
              <span className="text-sm text-gray-400 line-through">
                {regularPrice}
              </span>
            )}
          </div>
          
          <Badge variant={product.stock_status === 'instock' ? 'success' : 'error'}>
            {product.stock_status === 'instock' ? 'متوفر' : 'غير متوفر'}
          </Badge>
        </div>

        {/* أزرار الشراء */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleBuyNow}
            disabled={product.stock_status !== 'instock'}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 شراء الآن
          </button>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_status !== 'instock'}
            className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🛒 إضافة للسلة
          </button>
        </div>
      </div>
    </motion.div>
  );
}
