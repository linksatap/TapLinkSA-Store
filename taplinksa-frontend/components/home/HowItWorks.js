import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      number: '01',
      icon: '📞',
      title: 'تواصل معنا',
      description: 'ابدأ رحلتك معنا من خلال التواصل عبر الواتساب أو الإنستاب',
      details: 'فريقنا جاهز للرد على استفساراتك على مدار الساعة',
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '02',
      icon: '🎨',
      title: 'تصميم الهوية والبطاقة',
      description: 'فريقنا يصمم لك بطاقة فريدة تعكس هويتك التجارية',
      details: 'تصميم احترافي متكامل مع ألوان وخطوط علامتك التجارية',
      color: 'from-purple-500 to-purple-600'
    },
    {
      number: '03',
      icon: '⚡',
      title: 'برمجة وربط البيانات',
      description: 'نقوم ببرمجة البطاقة وربط جميع معلوماتك وحساباتك',
      details: 'ربط سلس مع جميع منصات التواصل الاجتماعي والمواقع',
      color: 'from-orange-500 to-orange-600'
    },
    {
      number: '04',
      icon: '✅',
      title: 'التجربة والتسليم',
      description: 'نختبر البطاقة ونسلمها لك جاهزة للاستخدام',
      details: 'شحن مجاني وسريع + دعم فني مستمر بعد التسليم',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      
      {/* خلفية ديكورية */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
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
            <span className="text-6xl">🚀</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            كيف <span className="text-gold">نعمل</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            أربع خطوات بسيطة للحصول على بطاقتك الذكية وبدء تحولك الرقمي
          </p>
        </motion.div>

        {/* الخطوات */}
        <div className="relative">
          
          {/* خط الربط بين الخطوات - Desktop */}
          <div className="hidden lg:block absolute top-24 right-0 left-0 h-1">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-gradient-to-l from-gold via-yellow-400 to-gold"
              style={{ transformOrigin: 'right' }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
                className="relative"
              >
                {/* البطاقة */}
                <motion.div
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
                >
                  
                  {/* الخلفية المتدرجة عند Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  {/* الرقم الكبير في الخلفية */}
                  <div className="absolute top-4 left-4 text-8xl font-bold text-gray-100 group-hover:text-gold/10 transition-colors">
                    {step.number}
                  </div>

                  {/* الأيقونة */}
                  <motion.div
                    animate={{
                      rotate: activeStep === index ? [0, 360] : 0,
                      scale: activeStep === index ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.6 }}
                    className={`relative z-10 w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg mx-auto group-hover:shadow-xl transition-shadow`}
                  >
                    {step.icon}
                  </motion.div>

                  {/* الرقم */}
                  <motion.div
                    className="text-center mb-4 relative z-10"
                    animate={{
                      scale: activeStep === index ? 1.1 : 1
                    }}
                  >
                    <span className={`text-5xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                      {step.number}
                    </span>
                  </motion.div>

                  {/* العنوان */}
                  <h3 className="text-xl font-bold mb-3 text-center relative z-10">
                    {step.title}
                  </h3>

                  {/* الوصف */}
                  <p className="text-gray-600 text-center text-sm leading-relaxed mb-4 relative z-10">
                    {step.description}
                  </p>

                  {/* التفاصيل الإضافية */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: activeStep === index ? 'auto' : 0,
                      opacity: activeStep === index ? 1 : 0
                    }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-4 pt-4 border-t-2 border-dashed border-gray-200 text-sm text-gray-500 text-center relative z-10`}>
                      💡 {step.details}
                    </div>
                  </motion.div>

                  {/* سهم للخطوة التالية - Desktop */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 text-4xl text-gold"
                    >
                      ←
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA في النهاية */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-700 mb-6">
            جاهز للبدء؟ دعنا نصنع بطاقتك الذكية اليوم!
          </p>
          <a 
            href="/contact" 
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            ابدأ الآن 🚀
          </a>
        </motion.div>
      </div>
    </section>
  );
}
