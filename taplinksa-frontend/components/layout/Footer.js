import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // هنا تضيف كود الاشتراك
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  const footerLinks = {
    services: [
      { name: 'إدارة Google Business', href: '/services/google-business' },
      { name: 'بطاقات NFC الذكية', href: '/shop' },
      { name: 'تصميم المواقع', href: '/services/web-design' },
      { name: 'التسويق الرقمي', href: '/services/marketing' }
    ],
    quickLinks: [
      { name: 'الرئيسية', href: '/' },
      { name: 'من نحن', href: '/about' },
      { name: 'المتجر', href: '/shop' },
      { name: 'المدونة', href: '/blog' },
      { name: 'الجودة', href: '/quality' }
    ],
    legal: [
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'شروط الاستخدام', href: '/terms' },
      { name: 'سياسة الاسترجاع', href: '/refund' }
    ]
  };

  const socialLinks = [
    { name: 'WhatsApp', icon: '📱', href: 'https://wa.me/966538365924', color: 'hover:bg-green-500' },
    { name: 'Instagram', icon: '📷', href: '#', color: 'hover:bg-pink-500' },
    { name: 'Twitter', icon: '🐦', href: '#', color: 'hover:bg-blue-400' },
    { name: 'TikTok', icon: '🎵', href: '#', color: 'hover:bg-black' },
    { name: 'Snapchat', icon: '👻', href: '#', color: 'hover:bg-yellow-400' }
  ];

  return (
    <footer className="relative">
      {/* CTA Section */}
      
      {/* Main Footer */}
      <div className="bg-dark text-white pt-16 pb-8">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* عن تاب لينك */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gold mb-6 flex items-center gap-2">
                <span>💳</span>
                تاب لينك SA
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                نحن متخصصون في تقديم حلول التسويق الرقمي، بطاقات NFC الذكية للشركات والأفراد في بريدة والمملكة.
              </p>
              
              {/* Social Media */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 bg-white/10 hover:bg-gold text-white rounded-lg flex items-center justify-center text-xl transition-all ${social.color}`}
                    title={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* خدماتنا */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">خدماتنا</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2 group"
                    >
                      <span className="text-gold group-hover:translate-x-1 transition-transform">←</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* روابط سريعة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">روابط سريعة</h3>
              <ul className="space-y-3">
                {footerLinks.quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2 group"
                    >
                      <span className="text-gold group-hover:translate-x-1 transition-transform">←</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* تواصل معنا + Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">تواصل معنا</h3>
              
              <div className="space-y-4 mb-6">
                <a
                  href="tel:+966123456789"
                  className="flex items-center gap-3 text-gray-400 hover:text-gold transition-colors group"
                >
                  <span className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-dark transition-all">
                    📞
                  </span>
                  <span className="font-medium">+966 123 456 789</span>
                </a>

                <a
                  href="mailto:info@taplinksa.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-gold transition-colors group"
                >
                  <span className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-dark transition-all">
                    ✉️
                  </span>
                  <span className="font-medium">info@taplinksa.com</span>
                </a>

                <div className="flex items-start gap-3 text-gray-400">
                  <span className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center text-gold flex-shrink-0 mt-1">
                    📍
                  </span>
                  <span className="font-medium">بريدة - القصيم - السعودية</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-sm font-bold text-white mb-3">اشترك في نشرتنا 📬</h4>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 transition-all text-sm"
                  >
                    {subscribed ? '✓' : '→'}
                  </button>
                </form>
                {subscribed && (
                  <p className="text-green-400 text-xs mt-2">✓ تم الاشتراك بنجاح!</p>
                )}
              </div>
            </motion.div>
          </div>
{/* Payment Methods - Simple Version */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="mb-12 text-center"
>
  <h3 className="text-lg font-bold text-gray-400 mb-6">
    نقبل جميع طرق الدفع
  </h3>
  
  <div className="flex flex-wrap justify-center items-center gap-6">
    {/* الدفع عند الاستلام */}
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/10 hover:border-gold transition-all"
    >
      <span className="text-2xl">📦</span>
      <span className="text-white text-sm font-medium">الدفع عند الاستلام</span>
    </motion.div>

    {/* البطاقات البنكية */}
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg border border-white/10 hover:border-gold transition-all"
    >
      <span className="text-2xl">💳</span>
      <div className="flex gap-2 text-xs font-bold">
        <span className="text-purple-400">PAYPAL</span>
        <span className="text-white">|</span>
        <span className="text-blue-400">VISA</span>
        <span className="text-white">|</span>
        <span className="text-orange-400">MC</span>
      </div>
    </motion.div>

    {/* التحويل البنكي */}
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/10 hover:border-gold transition-all"
    >
      <span className="text-2xl">🏦</span>
      <span className="text-white text-sm font-medium">تحويل بنكي</span>
    </motion.div>

    {/* المحافظ الإلكترونية */}
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg border border-white/10 hover:border-gold transition-all"
    >
      <span className="text-2xl">📱</span>
      <div className="flex gap-2 text-xs font-bold">
        <span className="text-white">BARQ</span>
                <span className="text-white">|</span>

        <span className="text-white">URPAY</span>
                <span className="text-white">|</span>

        <span className="text-purple-400">STC pay</span>
      </div>
    </motion.div>

    
  </div>

  {/* Security badge */}
  <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-xs">
    <span className="text-green-500">🔒</span>
    <span>معاملات آمنة ومشفرة SSL</span>
  </div>
</motion.div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-wrap justify-between items-center gap-4">
              {/* Copyright */}
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} تاب لينك SA. جميع الحقوق محفوظة
              </p>

              {/* Legal Links */}
              <div className="flex flex-wrap gap-4">
                {footerLinks.legal.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-gray-400 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Made with love */}
              <p className="text-gray-500 text-sm">
                صُنع بـ <span className="text-red-500">❤️</span> في السعودية
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
