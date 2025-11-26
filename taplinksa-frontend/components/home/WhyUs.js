import { motion } from 'framer-motion';
import { useState } from 'react';

export default function WhyChooseUsSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const features = [
    {
      icon: '🇸🇦',
      title: 'خبرة محلية في السوق السعودي',
      description: '+5 سنوات في خدمة العملاء السعوديين',
      stat: '500+',
      statLabel: 'عميل سعودي',
      color: 'from-green-500 to-green-600',
      bgPattern: '🏢'
    },
    {
      icon: '🎯',
      title: 'تصاميم محدثة وفريدة',
      description: 'تصاميم عصرية تواكب أحدث الاتجاهات',
      stat: '1000+',
      statLabel: 'تصميم فريد',
      color: 'from-purple-500 to-purple-600',
      bgPattern: '✨'
    },
    {
      icon: '⚡',
      title: 'سرعة في التنفيذ والتسليم',
      description: 'نسلم مشروعك في أقصر وقت ممكن',
      stat: '24-48',
      statLabel: 'ساعة تسليم',
      color: 'from-orange-500 to-orange-600',
      bgPattern: '🚀'
    },
    {
      icon: '💬',
      title: 'دعم فني متواصل 24/7',
      description: 'فريق دعم جاهز للرد في أي وقت',
      stat: '24/7',
      statLabel: 'متاح دائماً',
      color: 'from-blue-500 to-blue-600',
      bgPattern: '🎧'
    },
    {
      icon: '🛡️',
      title: 'ضمان الجودة والموثوقية',
      description: 'ضمان شامل على جميع منتجاتنا',
      stat: '3',
      statLabel: 'سنوات ضمان',
      color: 'from-red-500 to-red-600',
      bgPattern: '✅'
    },
    {
      icon: '💰',
      title: 'أسعار تنافسية ومناسبة',
      description: 'أفضل قيمة مقابل المال في السوق',
      stat: '30%',
      statLabel: 'توفير',
      color: 'from-gold to-yellow-500',
      bgPattern: '💎'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-dark via-gray-900 to-dark relative overflow-hidden">
      
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {features[i % features.length].bgPattern}
          </motion.div>
        ))}
      </div>

      <div className="container-custom relative z-10">
        
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">⭐</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            لماذا تختار <span className="text-gold">تاب لينك</span>؟
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            نحن الخيار الأمثل لحلولك الرقمية - جودة، سرعة، ودعم لا مثيل له
          </p>
        </motion.div>

        {/* المزايا */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              {/* البطاقة */}
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-gold/50 transition-all overflow-hidden h-full">
                
                {/* توهج خلفي */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity blur-xl`} />

                {/* الأيقونة */}
                <motion.div
                  animate={{
                    scale: hoveredIndex === index ? [1, 1.2, 1] : 1,
                    rotate: hoveredIndex === index ? [0, 10, -10, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 text-7xl mb-4"
                >
                  {feature.icon}
                </motion.div>

                {/* العنوان */}
                <h3 className="text-xl font-bold text-white mb-3 relative z-10 flex items-start gap-2">
                  <motion.span
                    animate={{
                      scale: hoveredIndex === index ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-gold flex-shrink-0"
                  >
                    ✓
                  </motion.span>
                  <span>{feature.title}</span>
                </h3>

                {/* الوصف */}
                <p className="text-gray-400 text-sm mb-6 relative z-10 leading-relaxed">
                  {feature.description}
                </p>

                {/* الإحصائية */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    y: hoveredIndex === index ? 0 : 20,
                  }}
                  className="relative z-10 pt-6 border-t border-white/10"
                >
                  <div className="flex items-end justify-between">
                    <div>
                      <div className={`text-4xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                        {feature.stat}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {feature.statLabel}
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: hoveredIndex === index ? 360 : 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-3xl opacity-20"
                    >
                      {feature.bgPattern}
                    </motion.div>
                  </div>
                </motion.div>

                {/* خط متوهج في الأسفل */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: hoveredIndex === index ? 1 : 0,
                  }}
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-300 mb-6">
            انضم إلى مئات العملاء الراضين عن خدماتنا
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              تواصل معنا الآن
            </a>
            <a 
              href="/shop" 
              className="btn-secondary text-lg px-8 py-4 inline-block"
            >
              تصفح المنتجات
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
