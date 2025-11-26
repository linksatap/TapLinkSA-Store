import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const services = [
    {
      id: 1,
      category: 'digital-presence',
      icon: '🎯',
      title: 'إدارة Google Business',
      subtitle: 'ملفك التجاري على خرائط جوجل',
      description: 'نساعدك في تحسين ظهورك على خرائط جوجل وجذب المزيد من العملاء المحليين',
      features: [
        'إنشاء وتحسين الملف التجاري',
        'رفع التقييمات والمراجعات',
        'تحليل الأداء والمنافسين',
        'تحسين SEO المحلي'
      ],
      badge: 'الأكثر طلباً',
      popular: true,
      color: 'blue'
    },
    {
      id: 2,
      category: 'nfc',
      icon: '💳',
      title: 'بطاقات NFC الذكية',
      subtitle: 'حضور رقمي بلمسة واحدة',
      description: 'بطاقات عمل ذكية تنقل معلوماتك بلمسة واحدة مع إمكانية التخصيص الكامل',
      features: [
        'تصميم احترافي مخصص',
        'ربط جميع حساباتك الاجتماعية',
        'تحديث البيانات في أي وقت',
        'تقارير عن التفاعلات'
      ],
      badge: 'الأكثر مبيعاً',
      popular: true,
      color: 'gold'
    },
    {
      id: 3,
      category: 'nfc',
      icon: '🎪',
      title: 'ستاندات NFC الذكية',
      subtitle: 'حلول ذكية للأعمال',
      description: 'ستاندات عرض ذكية للمطاعم والمحلات التجارية مع إمكانية الربط المباشر',
      features: [
        'تصميم حسب طلبك',
        'ربط بقوائم الطعام الرقمية',
        'ربط بحسابات التواصل',
        'سهولة التحديث والصيانة'
      ],
      badge: null,
      popular: false,
      color: 'purple'
    },
    {
      id: 4,
      category: 'web',
      icon: '🌐',
      title: 'تصميم المواقع الإلكترونية',
      subtitle: 'مواقع احترافية متجاوبة',
      description: 'مواقع حديثة وسريعة بتصميم احترافي متوافقة مع جميع الأجهزة',
      features: [
        'تصميم متجاوب (Mobile First)',
        'سرعة عالية وSEO محسّن',
        'لوحة تحكم سهلة',
        'استضافة وصيانة دورية'
      ],
      badge: null,
      popular: false,
      color: 'green'
    },
    {
      id: 5,
      category: 'web',
      icon: '🛒',
      title: 'المتاجر الإلكترونية',
      subtitle: 'متجرك الاحترافي على الإنترنت',
      description: 'متاجر إلكترونية متكاملة مع أنظمة دفع وشحن وإدارة المخزون',
      features: [
        'ربط بوابات الدفع المحلية',
        'إدارة المنتجات والطلبات',
        'تقارير مبيعات تفصيلية',
        'تكامل مع شركات الشحن'
      ],
      badge: 'جديد',
      popular: false,
      color: 'orange'
    },
    {
      id: 6,
      category: 'social',
      icon: '🔗',
      title: 'ربط حسابات التواصل',
      subtitle: 'اربط جميع منصاتك في مكان واحد',
      description: 'ربط بطاقات NFC أو موقعك بجميع حساباتك الاجتماعية والتطبيقات',
      features: [
        'ربط Instagram, TikTok, Snapchat',
        'ربط واتساب للتواصل المباشر',
        'ربط قوائم الطعام والكتالوجات',
        'إضافة روابط مخصصة'
      ],
      badge: null,
      popular: false,
      color: 'pink'
    },
    {
      id: 7,
      category: 'digital-presence',
      icon: '⭐',
      title: 'رفع التقييمات',
      subtitle: 'حسّن سمعتك على جوجل',
      description: 'خدمات احترافية لرفع تقييماتك ومراجعاتك على Google Business',
      features: [
        'استراتيجيات للحصول على تقييمات',
        'الرد على المراجعات',
        'تحليل آراء العملاء',
        'تحسين السمعة الرقمية'
      ],
      badge: null,
      popular: false,
      color: 'yellow'
    },
    {
      id: 8,
      category: 'custom',
      icon: '🎨',
      title: 'حلول مخصصة',
      subtitle: 'خدمات حسب احتياجك',
      description: 'نقدم حلول مخصصة تماماً حسب متطلبات مشروعك الخاص',
      features: [
        'تحليل احتياجات المشروع',
        'تصميم وتطوير مخصص',
        'تكامل مع أنظمتك الحالية',
        'دعم فني مستمر'
      ],
      badge: null,
      popular: false,
      color: 'indigo'
    }
  ];

  const categories = [
    { id: 'all', label: 'جميع الخدمات', icon: '📋' },
    { id: 'digital-presence', label: 'التواجد الرقمي', icon: '🎯' },
    { id: 'nfc', label: 'بطاقات NFC', icon: '💳' },
    { id: 'web', label: 'المواقع والمتاجر', icon: '🌐' },
    { id: 'social', label: 'التواصل الاجتماعي', icon: '🔗' },
    { id: 'custom', label: 'حلول مخصصة', icon: '🎨' }
  ];

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    gold: 'from-gold to-yellow-500',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    yellow: 'from-yellow-500 to-yellow-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            خدماتنا <span className="text-gold">المميزة</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نقدم حلول متكاملة لتطوير حضورك الرقمي وعملك التجاري
          </p>
        </motion.div>

        {/* فلتر التصنيفات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-gold text-dark shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* الخدمات */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
            >
              {/* Badge */}
              {service.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-4 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${colorClasses[service.color]}`}>
                    {service.badge}
                  </span>
                </div>
              )}

              {/* خلفية متدرجة */}
              <div className={`h-2 bg-gradient-to-r ${colorClasses[service.color]}`} />

              <div className="p-6">
                {/* الأيقونة */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl mb-4"
                >
                  {service.icon}
                </motion.div>

                {/* العنوان */}
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-gold font-medium mb-3">{service.subtitle}</p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* المزايا */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* زر التفاصيل */}
                <Link
                  href={`/services/${service.id}`}
                  className="block w-full text-center py-3 rounded-lg font-bold transition-all bg-gray-100 text-dark hover:bg-gold hover:text-white"
                >
                  معرفة المزيد
                </Link>
              </div>

              {/* تأثير الـ Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[service.color]} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
            </motion.div>
          ))}
        </div>

        {/* CTA في النهاية */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-700 mb-6">
            لديك احتياج خاص؟ نحن هنا لمساعدتك!
          </p>
          <Link href="/contact" className="btn-primary text-lg px-8 py-4 inline-block">
            تواصل معنا الآن
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
