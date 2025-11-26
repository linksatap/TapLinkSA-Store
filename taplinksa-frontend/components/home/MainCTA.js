import { motion } from 'framer-motion';

export default function MainCTA() {
  // استبدل برقمك الحقيقي
  const whatsappNumber = '+966507004339';
  const whatsappMessage = encodeURIComponent('مرحباً، أريد الاستفسار عن بطاقات NFC الذكية');

  return (
    <section className="relative bg-gradient-to-r from-gold via-yellow-400 to-gold py-16 overflow-hidden">
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
          backgroundImage: 'radial-gradient(circle, #1a1a1a 2px, transparent 2px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4">
              جاهز لتُحدث ثورة رقمية؟ 🚀
            </h2>
            <p className="text-lg md:text-xl text-dark/80">
              ابدأ الآن واحصل على بطاقتك الذكية أو استشارة مجانية لمشروعك
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {/* واتساب */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-dark text-gold font-bold rounded-xl hover:bg-dark/90 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              📞 تواصل عبر واتساب
            </a>
            
            {/* صفحة الاتصال */}
            <a
              href="/contact"
              className="px-8 py-4 bg-white text-dark font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              ✉️ أرسل رسالة
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mt-8 text-dark"
          >
            {[
              { icon: '✅', text: 'ضمان الجودة' },
              { icon: '⚡', text: 'تسليم سريع' },
              { icon: '🎯', text: 'دعم فني 24/7' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 font-medium">
                <span className="text-2xl">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
