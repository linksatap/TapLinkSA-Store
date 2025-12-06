import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext'; // ✅ أضف هذا

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); // ✅ أضف هذا
  const { getCartCount } = useCart();
  const { user, logout } = useUser(); // ✅ أضف هذا
  const cartCount = getCartCount();
  
  // التحقق من الصفحة الحالية
  const isHomePage = router.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // إذا لم تكن الصفحة الرئيسية، اجعل Header دائماً solid
    if (!isHomePage) {
      setScrolled(true);
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false); // ✅ أضف هذا
  }, [router.pathname]);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/services', label: 'الخدمات' },
    { href: '/shop', label: 'المتجر' },
{ href: '/subscriptions', label: 'الاشتراكات الرقمية' },
    { href: '/coupons', label: ' العروض والكوبونات ' },

    { href: '/about', label: 'من نحن ' },
  ];



  

  // تحديد إذا كان الرابط نشط
  const isActiveLink = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  // ✅ أضف دالة تسجيل الخروج
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage
          ? 'bg-white shadow-lg py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-12 h-12"
            >
              <Image
                src="/images/logo.svg"
                alt="تاب لينك السعودية"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            <span className="text-2xl font-bold">
              <span className="text-gold">متجر تاب لينك</span>
              <span className={scrolled || !isHomePage ? 'text-dark' : 'text-white'}>
                {' '}SA
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-medium transition-colors hover:text-gold relative ${
                    isActiveLink(link.href)
                      ? 'text-gold'
                      : scrolled || !isHomePage
                      ? 'text-dark'
                      : 'text-white'
                  }`}
                >
                  {link.label}
                  {isActiveLink(link.href) && (
                    <motion.div
                      layoutId="activeLink"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* ✅ قسم المستخدم - جديد */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    scrolled || !isHomePage
                      ? 'hover:bg-gray-100 text-dark'
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <span className="text-xl">👤</span>
                  <span className="hidden md:inline">{user.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
                    >
                      <Link
                        href="/my-orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all text-dark"
                      >
                        <span>📦</span>
                        <span>طلباتي</span>
                      </Link>
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
  ⚙️ حسابي
</Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all text-red-600 border-t border-gray-100"
                      >
                        <span>🚪</span>
                        <span>تسجيل الخروج</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {/* أزرار Login/Register */}
                <Link
                  href="/login"
                  className={`px-4 py-2 font-medium rounded-lg transition-all ${
                    scrolled || !isHomePage
                      ? 'text-dark hover:text-gold'
                      : 'text-white hover:text-gold'
                  }`}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
                >
                  إنشاء حساب
                </Link>
              </>
            )}






            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full transition-colors ${
                  scrolled || !isHomePage
                    ? 'hover:bg-gray-100'
                    : 'hover:bg-white/10'
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    scrolled || !isHomePage ? 'text-dark' : 'text-white'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gold text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* CTA Button */}
            <Link href="/contact" className="btn-primary animate-glow">
              ابدأ الآن
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-50 rounded-lg transition-all duration-300 ${
              isOpen 
                ? 'bg-gold' 
                : scrolled || !isHomePage
                ? 'hover:bg-gray-100'
                : 'hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className={`w-6 h-0.5 transition-colors ${
                isOpen 
                  ? 'bg-dark' 
                  : scrolled || !isHomePage 
                  ? 'bg-dark' 
                  : 'bg-white'
              }`}
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className={`w-6 h-0.5 transition-colors ${
                isOpen 
                  ? 'bg-dark' 
                  : scrolled || !isHomePage 
                  ? 'bg-dark' 
                  : 'bg-white'
              }`}
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className={`w-6 h-0.5 transition-colors ${
                isOpen 
                  ? 'bg-dark' 
                  : scrolled || !isHomePage 
                  ? 'bg-dark' 
                  : 'bg-white'
              }`}
            />
          </button>
          
            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full transition-colors ${
                  scrolled || !isHomePage
                    ? 'hover:bg-gray-100'
                    : 'hover:bg-white/10'
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    scrolled || !isHomePage ? 'text-dark' : 'text-white'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gold text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-white rounded-b-2xl shadow-xl"
            >
              <ul className="flex flex-col gap-4 py-6 px-4">
                {/* ✅ معلومات المستخدم في Mobile */}
                {user && (
                  <li className="pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">👤</span>
                      <div>
                        <p className="font-bold text-dark">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/my-orders"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                      >
                        📦 طلباتي
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                      >
                        ⚙️ حسابي
                      </Link>
                    </div>
                  </li>
                )}

                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block text-dark font-medium py-2 hover:text-gold transition-colors ${
                        isActiveLink(link.href) ? 'text-gold' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                
                {/* Cart in Mobile */}
                <li>
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-dark font-medium py-2 hover:text-gold transition-colors"
                  >
                    السلة
                    {cartCount > 0 && (
                      <span className="bg-gold text-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
                
                <li className="pt-4 border-t">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                    >
                      🚪 تسجيل الخروج
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <Link
                        href="/login"
                        className="flex-1 text-center py-3 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold hover:text-dark transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/register"
                        className="flex-1 text-center py-3 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        إنشاء حساب
                      </Link>
                    </div>
                  )}
                </li>
                
                <li>
                  <Link 
                    href="/contact" 
                    className="btn-primary w-full block text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    ابدأ الآن
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
