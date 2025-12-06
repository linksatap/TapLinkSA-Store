import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout } = useUser();
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

  // تحديد إذا كان الرابط نشط
  const isActiveLink = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  // دالة تسجيل الخروج
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled || !isHomePage
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/">
            <a className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={150}
                height={50}
              />
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 mx-auto">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`transition-colors duration-200 ${
                    isActiveLink(link.href)
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Desktop Icons Section */}
          <div className="hidden md:flex items-center gap-6">
            {/* Shopping Cart Icon */}
            <Link href="/cart">
              <a className="relative flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group">
                <FiShoppingCart
                  size={24}
                  className="text-gray-700 group-hover:text-blue-600"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white bg-red-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </a>
            </Link>

            {/* User Profile Icon - Desktop */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
              >
                <FiUser
                  size={24}
                  className="text-gray-700 group-hover:text-blue-600"
                />
              </button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    {user ? (
                      <>
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                          <p className="font-semibold text-gray-900">
                            {user.name || user.email}
                          </p>
                          {user.email && (
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          )}
                        </div>

                        {/* Menu Items */}
                        <Link href="/profile">
                          <a className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                            👤 الملف الشخصي
                          </a>
                        </Link>
                        <Link href="/orders">
                          <a className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                            📦 طلباتي
                          </a>
                        </Link>
                        <Link href="/addresses">
                          <a className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                            📍 عناويني
                          </a>
                        </Link>
                        <Link href="/saved-items">
                          <a className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                            ❤️ المفضلة
                          </a>
                        </Link>

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 border-t border-gray-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                        >
                          🚪 تسجيل الخروج
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login">
                          <a className="block px-4 py-2.5 hover:bg-blue-50 text-blue-600 font-semibold transition-colors">
                            🔐 تسجيل دخول
                          </a>
                        </Link>
                        <Link href="/register">
                          <a className="block px-4 py-2.5 hover:bg-gray-50 text-gray-700 font-medium transition-colors border-t border-gray-200">
                            ➕ إنشاء حساب
                          </a>
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Close user menu when clicking outside */}
            {showUserMenu && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <FiX size={24} />
            ) : (
              <FiMenu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              
              {/* Mobile Navigation Links */}
              <nav className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        isActiveLink(link.href)
                          ? 'bg-blue-100 text-blue-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
              </nav>

              {/* Mobile Cart Link */}
              <Link href="/cart">
                <a className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium mb-2">
                  <FiShoppingCart size={20} />
                  السلة
                  {cartCount > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white bg-red-500 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </a>
              </Link>

              {/* Mobile User Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {user ? (
                  <>
                    <div className="px-4 py-2 mb-2 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900">
                        {user.name || user.email}
                      </p>
                      {user.email && (
                        <p className="text-sm text-gray-600">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <Link href="/profile">
                      <a className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        👤 الملف الشخصي
                      </a>
                    </Link>
                    <Link href="/orders">
                      <a className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        📦 طلباتي
                      </a>
                    </Link>
                    <Link href="/addresses">
                      <a className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        📍 عناويني
                      </a>
                    </Link>
                    <Link href="/saved-items">
                      <a className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        ❤️ المفضلة
                      </a>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 rounded-lg text-red-600 font-semibold hover:bg-red-50 transition-colors mt-2"
                    >
                      🚪 تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <a className="block px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-600 font-semibold transition-colors mb-2">
                        🔐 تسجيل دخول
                      </a>
                    </Link>
                    <Link href="/register">
                      <a className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                        ➕ إنشاء حساب
                      </a>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}