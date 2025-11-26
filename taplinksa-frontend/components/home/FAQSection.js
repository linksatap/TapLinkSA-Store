import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'جميع الأسئلة', icon: '📋' },
    { id: 'general', name: 'عامة', icon: '💡' },
    { id: 'technical', name: 'تقنية', icon: '⚙️' },
    { id: 'pricing', name: 'الأسعار', icon: '💰' },
    { id: 'shipping', name: 'الشحن', icon: '🚚' }
  ];

  const faqs = [
    {
      category: 'general',
      icon: '💳',
      question: 'ما هي بطاقات NFC الذكية؟',
      answer: 'بطاقات NFC هي بطاقات ذكية تستخدم تقنية الاتصال القريب المدى (Near Field Communication) لنقل المعلومات بشكل فوري. بمجرد تقريب الهاتف من البطاقة، يتم فتح ملفك الرقمي الذي يحتوي على جميع بياناتك وحساباتك الاجتماعية ومعلومات التواصل.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      category: 'technical',
      icon: '🎨',
      question: 'كم يستغرق تصميم وتسليم البطاقة؟',
      answer: 'عملية التصميم تستغرق من 24-48 ساعة عمل. بعد موافقتك على التصميم، نقوم بالبرمجة والطباعة خلال 24 ساعة. الشحن داخل المملكة يستغرق 1-3 أيام عمل حسب موقعك.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      category: 'technical',
      icon: '🔄',
      question: 'هل يمكن تحديث معلومات البطاقة؟',
      answer: 'نعم بالتأكيد! يمكنك تحديث جميع معلوماتك في أي وقت من خلال لوحة التحكم الخاصة بك. التحديثات تظهر فوراً ولا تحتاج إلى طباعة بطاقة جديدة. هذه من أهم مميزات البطاقات الذكية!',
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'technical',
      icon: '📱',
      question: 'هل تقدمون خدمة الدعم الفني؟',
      answer: 'نعم، نقدم دعم فني مجاني 24/7 عبر الواتساب والبريد الإلكتروني. فريقنا جاهز لمساعدتك في أي استفسار أو مشكلة تقنية. كما نوفر فيديوهات تعليمية ودليل استخدام شامل.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      category: 'pricing',
      icon: '💰',
      question: 'ما هي أسعار البطاقات؟',
      answer: 'نقدم باقات متنوعة تبدأ من 99 ريال للبطاقة الكلاسيك. البطاقة البريميوم بـ 149 ريال والحامل الذكي بـ 199 ريال. جميع الأسعار شاملة التصميم والبرمجة والشحن المجاني.',
      color: 'from-gold to-yellow-500'
    },
    {
      category: 'shipping',
      icon: '🚚',
      question: 'هل الشحن مجاني؟',
      answer: 'نعم، نوفر شحن مجاني لجميع مناطق المملكة. التوصيل يستغرق 1-3 أيام عمل. نستخدم شركات شحن موثوقة ويمكنك تتبع الشحنة في أي وقت.',
      color: 'from-red-500 to-red-600'
    },
    {
      category: 'general',
      icon: '✅',
      question: 'هل تقدمون ضمان؟',
      answer: 'نعم، جميع منتجاتنا مشمولة بضمان شامل لمدة سنة على الأقل. البطاقات البريميوم لها ضمان سنتين. الضمان يشمل العيوب المصنعية والمشاكل التقنية.',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      category: 'technical',
      icon: '🔗',
      question: 'ما هي المنصات المدعومة؟',
      answer: 'ندعم جميع منصات التواصل الاجتماعي: واتساب، سناب شات، إنستغرام، تيك توك، تويتر، لينكد إن، يوتيوب. كما يمكن إضافة روابط مخصصة لموقعك أو متجرك الإلكتروني.',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            <span className="text-6xl">❓</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            الأسئلة <span className="text-gold">الشائعة</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            إجابات على أكثر الأسئلة شيوعاً
          </p>

          {/* خانة البحث */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن سؤالك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-14 rounded-full border-2 border-gray-200 focus:border-gold outline-none text-lg transition-all"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl">
                🔍
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* فلتر الفئات */}
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
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* الأسئلة */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                whileHover={{ scale: 1.01 }}
                className={`w-full text-right bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden ${
                  openIndex === index ? 'ring-2 ring-gold' : ''
                }`}
              >
                {/* رأس السؤال */}
                <div className="flex items-center gap-4 p-6">
                  {/* الأيقونة */}
                  <motion.div
                    animate={{
                      rotate: openIndex === index ? 360 : 0,
                      scale: openIndex === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${faq.color} flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {faq.icon}
                  </motion.div>

                  {/* السؤال */}
                  <h3 className="flex-1 text-lg md:text-xl font-bold text-dark">
                    {faq.question}
                  </h3>

                  {/* السهم */}
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      openIndex === index ? 'bg-gold text-dark' : 'bg-gray-100 text-gray-600'
                    } transition-colors`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>

                {/* الإجابة */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className={`pr-18 text-gray-700 leading-relaxed border-r-4 border-gold/30 pr-6`}>
                          {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* رسالة إذا لم توجد نتائج */}
        {filteredFAQs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-600">لم نجد أسئلة مطابقة لبحثك</p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-700 mb-6">
            لم تجد إجابة لسؤالك؟
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              تواصل معنا
            </a>
            <a 
              href="/faq" 
              className="btn-secondary text-lg px-8 py-4 inline-block"
            >
              عرض جميع الأسئلة
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
