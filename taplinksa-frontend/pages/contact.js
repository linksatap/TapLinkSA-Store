import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle form submission to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout
      title="اتصل بنا | تاب لينك السعودية"
      description="تواصل معنا للحصول على استشارة مجانية أو الاستفسار عن خدماتنا"
    >
      <div className="container-custom section-padding">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-gray-600 hover:text-gold">الرئيسية</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">اتصل بنا</li>
          </ol>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
            تواصل معنا
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" data-aos="fade-up" data-aos-delay="100"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            نحن هنا للإجابة على استفساراتك ومساعدتك في بناء حضورك الرقمي
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">رقم الجوال</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الخدمة المطلوبة</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                >
                  <option value="">اختر الخدمة</option>
                  <option value="nfc">بطاقات NFC</option>
                  <option value="google">إدارة Google Business</option>
                  <option value="website">تصميم موقع</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الرسالة</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                إرسال الرسالة
              </button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 text-green-800 p-4 rounded-lg text-center"
                >
                  ✓ تم إرسال رسالتك بنجاح!
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-gradient-gold p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-dark">معلومات التواصل</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📞</span>
                  <div>
                    <div className="font-bold text-dark mb-1">الهاتف</div>
                    <div className="text-dark/80" dir="ltr">+966 123 456 789</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-3xl">📧</span>
                  <div>
                    <div className="font-bold text-dark mb-1">البريد الإلكتروني</div>
                    <div className="text-dark/80">info@taplinksa.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-3xl">📍</span>
                  <div>
                    <div className="font-bold text-dark mb-1">العنوان</div>
                    <div className="text-dark/80">بريدة - القصيم - السعودية</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-3xl">⏰</span>
                  <div>
                    <div className="font-bold text-dark mb-1">ساعات العمل</div>
                    <div className="text-dark/80">السبت - الخميس: 9 صباحاً - 6 مساءً</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.7!2d43.9750!3d26.3260!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE5JzMzLjYiTiA0M8KwNTgnMzAuMCJF!5e0!3m2!1sar!2ssa!4v1234567890"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                title="موقع تاب لينك السعودية"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
