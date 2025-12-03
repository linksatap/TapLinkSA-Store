import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export default function SubscriptionCard({ subscription }) {
  const { addToCart } = useCart();

  // استخراج البيانات المخصصة
  const toolName = subscription.meta_data?.find(
    (meta) => meta.key === '_subscription_tool_name'
  )?.value || subscription.name;

  const duration = subscription.meta_data?.find(
    (meta) => meta.key === '_subscription_duration'
  )?.value;

  const durationUnit = subscription.meta_data?.find(
    (meta) => meta.key === '_subscription_duration_unit'
  )?.value || 'months';

  const deliveryNotes = subscription.meta_data?.find(
    (meta) => meta.key === '_subscription_delivery_notes'
  )?.value;

  // تنسيق المدة
  const getDurationText = () => {
    if (!duration) return '';
    
    const units = {
      days: duration === '1' ? 'يوم' : 'أيام',
      weeks: duration === '1' ? 'أسبوع' : 'أسابيع',
      months: duration === '1' ? 'شهر' : 'أشهر',
      years: duration === '1' ? 'سنة' : 'سنوات',
    };

    return `${duration} ${units[durationUnit] || 'شهر'}`;
  };

  const handleAddToCart = () => {
    addToCart(subscription, 1);
  };

  const hasDiscount = parseFloat(subscription.regular_price) > parseFloat(subscription.price);
  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(subscription.regular_price) - parseFloat(subscription.price)) /
          parseFloat(subscription.regular_price)) *
          100
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
    >
      {/* Header with Tool Icon/Image */}
      <div className="relative aspect-square w-full max-w-[600px] 
bg-gradient-to-br from-gold via-yellow-400 to-yellow-500 
p-6 flex items-center justify-center mx-auto rounded-2xl">

        {subscription.images && subscription.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={subscription.images[0].src}
              alt={toolName}
              fill
              className="object-contain p-4"
            />
          </div>
        ) : (
          <div className="text-6xl">📦</div>
        )}
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            خصم {discountPercentage}%
          </div>
        )}

        {/* Duration Badge */}
        {duration && (
          <div className="absolute bottom-4 right-4 bg-dark/80 text-gold px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm">
            ⏱️ {getDurationText()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Tool Name */}
        <h3 className="text-2xl font-bold text-dark mb-3 line-clamp-2">
          {toolName}
        </h3>

        {/* Short Description */}
        {subscription.short_description && (
          <div
            className="text-gray-600 text-sm mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ 
              __html: subscription.short_description.replace(/<[^>]*>/g, '') 
            }}
          />
        )}

        {/* Delivery Notes */}
        {deliveryNotes && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-r-4 border-blue-400">
            <p className="text-xs text-blue-800">
              📝 {deliveryNotes}
            </p>
          </div>
        )}

        {/* Features */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            <span>تفعيل فوري</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            <span>اشتراك رسمي 100%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-500">✓</span>
            <span>دعم فني متواصل</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Price & CTA */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gold">
                  {parseFloat(subscription.price).toFixed(2)}
                </span>
                <span className="text-lg text-gray-600">ر.س</span>
              </div>
              {hasDiscount && (
                <div className="text-sm text-gray-400 line-through">
                  {parseFloat(subscription.regular_price).toFixed(2)} ر.س
                </div>
              )}
            </div>

            {/* Stock Status */}
            {subscription.stock_status === 'instock' ? (
              <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                ✓ متوفر
              </span>
            ) : (
              <span className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                غير متوفر
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={subscription.stock_status !== 'instock'}
              className="flex-1 py-3 px-4 bg-gold text-dark font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🛒 أضف للسلة
            </button>
            
            <Link
              href={`/shop/${subscription.slug}`}
              className="py-3 px-4 border-2 border-gold text-gold font-bold rounded-xl hover:bg-gold hover:text-dark transition-all"
            >
              👁️
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
