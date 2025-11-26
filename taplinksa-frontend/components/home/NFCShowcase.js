import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsSection() {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const products = [
    {
      id: 'classic',
      name: 'بطاقة NFC كلاسيك',
      subtitle: 'للأفراد والشركات الصغيرة',
      price: 99,
      originalPrice: 149,
      badge: 'الأكثر مبيعاً',
      badgeColor: 'green',
      popular: true,
      image: '/images/nfc-classic.png',
      color: 'blue',
      features: [
        { text: 'تصميم أنيق', icon: '✨', included: true },
        { text: 'رمز QR محدود', icon: '📱', included: true },
        { text: 'ضمان سنة', icon: '🛡️', included: true },
        { text: 'تحديثات مجانية', icon: '🔄', included: false },
        { text: 'تصميم مخصص', icon: '🎨', included: false },
        { text: 'إضاءة LED', icon: '💡', included: false },
      ],
      includes: [
        'بطاقة NFC واحدة',
        'صندوق هدايا فاخر',
        'دليل استخدام بالعربية',
      ],
      deliveryTime: '2-3 أيام عمل'
    },
    {
      id: 'premium',
      name: 'بطاقة NFC بريميوم',
      subtitle: 'الحل الأمثل للمحترفين',
      price: 149,
      originalPrice: 199,
      badge: 'الأكثر طلباً',
      badgeColor: 'gold',
      popular: true,
      image: '/images/nfc-premium.png',
      color: 'gold',
      features: [
        { text: 'تصميم متقدم', icon: '🌟', included: true },
        { text: 'مطلية بالذهب', icon: '✨', included: true },
        { text: 'ضمان سنتين', icon: '🛡️', included: true },
        { text: 'تحديثات مجانية', icon: '🔄', included: true },
        { text: 'تصميم مخصص', icon: '🎨', included: true },
        { text: 'شحن سريع', icon: '⚡', included: true },
      ],
      includes: [
        'بطاقة NFC بريميوم',
        'محفظة جلدية فاخرة',
        'دعم فني مميز',
        'تصميم شخصي مجاناً'
      ],
      deliveryTime: '1-2 يوم عمل'
    },
    {
      id: 'holder',
      name: 'حامل NFC ذكي',
      subtitle: 'للمطاعم والمحلات',
      price: 199,
      originalPrice: 249,
      badge: 'جديد',
      badgeColor: 'purple',
      popular: false,
      image: '/images/nfc-holder.png',
      color: 'purple',
      features: [
        { text: 'تصميم مخصص', icon: '🎨', included: true },
        { text: 'شحن لاسلكي', icon: '🔋', included: true },
        { text: 'إضاءة LED', icon: '💡', included: true },
        { text: 'ضمان 3 سنوات', icon: '🛡️', included: true },
        { text: 'تطبيق إدارة', icon: '📊', included: true },
        { text: 'تركيب مجاني', icon: '🔧', included: true },
      ],
      includes: [
        'ستاند NFC ذكي',
        'شاحن لاسلكي',
        'تطبيق إدارة المحتوى',
        'تركيب وتدريب مجاني'
      ],
      deliveryTime: '3-5 أيام عمل'
    }
  ];

  const selectedProduct = products.find(p => p.id === selectedPlan);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      
      {/* خلفية ديكورية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">💳</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            منتجاتنا <span className="text-gold">الذكية</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اختر البطاقة المناسبة لك واستمتع بحضور رقمي احترافي
          </p>
        </motion.div>

        {/* البطاقات */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -15, scale: 1.02 }}
              onClick={() => setSelectedPlan(product.id)}
              className={`relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all ${
                selectedPlan === product.id 
                  ? 'ring-4 ring-gold ring-offset-4' 
                  : 'hover:shadow-2xl'
              }`}
            >
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-6 left-6 z-20">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
                      product.badgeColor === 'gold' ? 'bg-gradient-to-r from-gold to-yellow-500' :
                      product.badgeColor === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      'bg-gradient-to-r from-purple-500 to-purple-600'
                    }`}
                  >
                    {product.badge}
                  </motion.div>
                </div>
              )}

              {/* صورة المنتج أو بطاقة 3D */}
              <div className={`relative h-64 bg-gradient-to-br ${
                product.color === 'gold' ? 'from-gold via-yellow-400 to-amber-500' :
                product.color === 'blue' ? 'from-blue-500 via-blue-400 to-cyan-500' :
                'from-purple-500 via-purple-400 to-pink-500'
              } flex items-center justify-center overflow-hidden`}>
                
                {/* تأثيرات ديكورية */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{ duration: 20, repeat: Infinity }}
                  className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                />
                
                {/* أيقونة المنتج */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotateY: [0, 360, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="relative z-10"
                >
                  <div className="text-8xl">
                    {product.id === 'holder' ? '🎪' : '💳'}
                  </div>
                </motion.div>
              </div>

              <div className="p-8">
                {/* الاسم والسعر */}
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-6">{product.subtitle}</p>

                <div className="flex items-end gap-3 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-dark">{product.price}</span>
                    <span className="text-xl text-gray-600">ر.س</span>
                  </div>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through mb-2">
                      {product.originalPrice} ر.س
                    </span>
                  )}
                </div>

                {/* المزايا */}
                <ul className="space-y-3 mb-6">
                  {product.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className={`flex items-center gap-3 text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      <span className="text-xl">{feature.icon}</span>
                      <span className={feature.included ? 'font-medium' : 'line-through'}>
                        {feature.text}
                      </span>
                      {feature.included && (
                        <span className="mr-auto text-green-500">✓</span>
                      )}
                    </motion.li>
                  ))}
                </ul>

                {/* زر الشراء */}
                <Link
                  href={`/shop?product=${product.id}`}
                  className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${
                    selectedPlan === product.id
                      ? 'bg-gold text-dark shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-dark hover:bg-gold hover:text-white'
                  }`}
                >
                  اشتري الآن
                </Link>

                {/* وقت التوصيل */}
                <div className="mt-4 text-center text-sm text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <span>🚚</span>
                    <span>التوصيل: {product.deliveryTime}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* جدول المقارنة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-12"
        >
          <h3 className="text-3xl font-bold text-center mb-8">
            قارن بين <span className="text-gold">المنتجات</span>
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b-2">
                  <th className="p-4 text-gray-700">الميزة</th>
                  {products.map(product => (
                    <th key={product.id} className="p-4">
                      <div className="font-bold">{product.name}</div>
                      <div className="text-2xl text-gold font-bold">{product.price} ر.س</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['تصميم احترافي', 'ضمان', 'تحديثات', 'تصميم مخصص', 'دعم فني'].map((feature, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{feature}</td>
                    {products.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        <span className={product.features[i]?.included ? 'text-green-500 text-2xl' : 'text-gray-300 text-2xl'}>
                          {product.features[i]?.included ? '✓' : '×'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA نهائي */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link 
            href="/shop" 
            className="btn-secondary text-lg px-8 py-4 inline-block"
          >
            عرض جميع المنتجات
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
