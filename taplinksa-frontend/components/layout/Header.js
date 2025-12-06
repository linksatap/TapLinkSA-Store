import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout } = useUser();
  const cartCount = getCartCount();

  const isHomePage = router.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    if (!isHomePage) {
      setScrolled(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [router.pathname]);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/services', label: 'الخدمات' },
    { href: '/shop', label: 'المتجر' },
    { href: '/subscriptions', label: 'الاشتراكات الرقمية' },
    { href: '/coupons', label: 'العروض والكوبونات' },
    { href: '/about', label: 'من نحن' },
  ];

  const isActiveLink = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

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
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            <motion.span
              className={`text-2xl font-bold ${
                scrolled || !isHomePage ? 'text-dark' : 'text-white'
              }`}
            >
              <span className="text-gold"> متجر</span>
              <span>تاب لينك </span>
              <span className="text-gold">SA</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation + Cart */}
          <ul
            className={`hidden lg:flex items-center gap-8 ${
              scrolled || !isHomePage ? 'text-dark' : 'text-white'
            }`}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-medium transition-colors hover:text-gold relative ${
                    isActiveLink(link.href) ? 'text-gold' : ''
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

            {/* ✅ Cart Icon - في نهاية القائمة على الديسكتوب فقط */}
            <li>
              <Link href="/cart" className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
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
                  </div>
                </motion.div>
              </Link>
            </li>
          </ul>

          {/* Desktop Actions - بدون Cart */}
          <div className="hidden lg:flex items-center gap-4">
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
                    className={`w-4 h-4 transition-transform ${
                      showUserMenu ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 z-50"
                    >
                      <Link
                        href="/my-orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all text-dark"
                      >
                        <span className="text-lg">📦</span>
                        <span>طلباتي</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-3 hover:bg-gray-50 text-dark transition-all"
                      >
                        الملف الشخصي
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all text-red-600 border-t border-gray-100"
                      >
                        <span className="text-lg">🚪</span>
                        <span>تسجيل الخروج</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className={`px-4 py-2 font-medium rounded-lg transition-all ${
                    scrolled || !isHomePage
                      ? 'text-dark hover:text-gold'
                      : 'text-white hover:text-gold'
                  }`}
                >
                  دخول
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl"
                >
                  تسجيل
                </Link>
              </div>
            )}

            {/* CTA Button */}
            <Link
              href="/contact"
              className="btn-primary animate-glow"
            >
              تواصل معنا
            </Link>
          </div>

          {/* Mobile Icons Container */}
          <div className="lg:hidden flex items-center gap-2">
            {/* ✅ Mobile Cart Icon - ثابت بجانب Hamburger */}
            <Link href="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div
                  className="p-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: scrolled || !isHomePage
                      ? '#f0f0f0'
                      : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{
                      color: scrolled || !isHomePage ? '#000' : '#fff',
                    }}
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
                </div>
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-50 rounded-lg transition-all duration-300 ${
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
          </div>
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
                {/* Mobile User Section */}
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
                        طلباتي
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                      >
                        ملفي
                      </Link>
                    </div>
                  </li>
                )}

                {/* Navigation Links */}
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

                {/* Mobile User Actions */}
                {user && (
                  <li className="pt-4 border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                    >
                      تسجيل الخروج
                    </button>
                  </li>
                )}

                {!user && (
                  <li className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center py-3 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold hover:text-dark transition-all"
                      >
                        دخول
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center py-3 bg-gold text-dark font-bold rounded-lg hover:bg-yellow-500 transition-all"
                      >
                        تسجيل
                      </Link>
                    </div>
                  </li>
                )}

                {/* CTA Button */}
                <li>
                  <Link
                    href="/contact"
                    className="btn-primary w-full block text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    تواصل معنا
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