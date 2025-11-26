import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'أحمد المطيري',
      role: 'صاحب مطعم',
      company: 'مطعم الأصالة',
      image: '/images/testimonials/client1.jpg', // استبدل بصورة حقيقية
      rating: 5,
      text: 'البطاقات الذكية من تاب لينك غيّرت طريقة تعاملي مع العملاء. الآن يستطيعون الوصول لكل معلوماتي بلمسة واحدة!',
      date: 'منذ أسبوعين',
      verified: true,
      platform: 'Google'
    },
    {
      id: 2,
      name: 'فاطمة السالم',
      role: 'مصممة جرافيك',
      company: 'استوديو الإبداع',
      image: '/images/testimonials/client2.jpg',
      rating: 5,
      text: 'خدمة احترافية وسرعة في التنفيذ. التصميم كان أفضل من توقعاتي والدعم الفني ممتاز!',
      date: 'منذ شهر',
      verified: true,
      platform: 'Facebook'
    },
    {
      id: 3,
      name: 'خالد العتيبي',
      role: 'مدير مبيعات',
      company: 'شركة النجاح',
      image: '/images/testimonials/client3.jpg',
      rating: 5,
      text: 'أفضل استثمار للتسويق الشخصي. البطاقة الذكية توفر لي الوقت والجهد في كل لقاء عمل.',
      date: 'منذ 3 أشهر',
      verified: true,
      platform: 'Twitter'
    },
    {
      id: 4,
      name: 'نورة القحطاني',
      role: 'مالكة صالون',
      company: 'صالون الجمال',
      image: '/images/testimonials/client4.jpg',
      rating: 5,
      text: 'عملائي يحبون الفكرة! سهّلت عليهم حجز المواعيد ومتابعة حساباتي على السوشيال ميديا.',
      date: 'منذ شهرين',
      verified: true,
      platform: 'Instagram'
    }
  ];

  const stats = [
    { number: '500+', label: 'عميل سعيد', icon: '😊' },
    { number: '4.9/5', label: 'التقييم العام', icon: '⭐' },
    { number: '1200+', label: 'مراجعة إيجابية', icon: '💬' },
    { number: '98%', label: 'نسبة الرضا', icon: '✅' }
  ];

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <section className="py-20 bg-gradient-to-br from-dark via-gray-900 to-dark relative overflow-hidden">
      
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #FBB040 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
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
            <span className="text-6xl">💬</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            ماذا يقول <span className="text-gold">عملاؤنا</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            آراء عملائنا السعداء - اكتشف تجاربهم معنا
          </p>
        </motion.div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold text-gold mb-2">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* البطاقات */}
          <div className="relative h-[500px] lg:h-[400px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl h-full flex flex-col">
                  
                  {/* رأس البطاقة */}
                  <div className="flex items-start gap-6 mb-6">
                    {/* صورة العميل */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative"
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-yellow-500 p-1">
                        <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-5xl overflow-hidden">
                          {/* استخدم Image component للصور الحقيقية */}
                          <span>🧑‍💼</span>
                        </div>
                      </div>
                      {/* verified badge */}
                      {testimonials[currentIndex].verified && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-dark"
                        >
                          <span className="text-white text-sm">✓</span>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* معلومات العميل */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-gold font-medium mb-1">
                        {testimonials[currentIndex].role}
                      </p>
                      <p className="text-gray-400 text-sm mb-3">
                        {testimonials[currentIndex].company}
                      </p>
                      
                      {/* النجوم */}
                      <div className="flex gap-1">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-gold text-2xl"
                          >
                            ★
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Platform */}
                    <div className="text-right">
                      <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300">
                        {testimonials[currentIndex].platform}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        {testimonials[currentIndex].date}
                      </p>
                    </div>
                  </div>

                  {/* علامات الاقتباس */}
                  <div className="text-gold/30 text-8xl font-serif leading-none mb-4">"</div>

                  {/* النص */}
                  <p className="text-xl lg:text-2xl text-white leading-relaxed flex-1">
                    {testimonials[currentIndex].text}
                  </p>

                  <div className="text-gold/30 text-8xl font-serif leading-none text-left self-end">"</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* أزرار التنقل */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="w-14 h-14 rounded-full bg-gold text-dark flex items-center justify-center text-2xl font-bold hover:bg-yellow-500 transition-colors shadow-lg"
            >
              ←
            </motion.button>

            {/* النقاط */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`transition-all ${
                    index === currentIndex
                      ? 'w-12 h-3 bg-gold'
                      : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                  } rounded-full`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="w-14 h-14 rounded-full bg-gold text-dark flex items-center justify-center text-2xl font-bold hover:bg-yellow-500 transition-colors shadow-lg"
            >
              →
            </motion.button>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-300 mb-6">
            كن واحداً من عملائنا السعداء!
          </p>
          <a 
            href="/contact" 
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            ابدأ رحلتك معنا الآن
          </a>
        </motion.div>
      </div>
    </section>
  );
}
