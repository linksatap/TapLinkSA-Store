import { motion } from 'framer-motion';
import Link from 'next/link';
import NFCCard3D from '../NFCCard3D';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { number: '500+', label: 'عميل سعيد', icon: '😊' },
    { number: '100+', label: 'مشروع', icon: '📊' },
    { number: '+5', label: 'سنوات خبرة', icon: '🏆' },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#252b3b] to-[#1a1f2e] overflow-hidden">
      
      {/* خلفية متحركة مع Particles */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* دوائر متحركة كبيرة */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 50,
            y: mousePosition.y * 50,
            scale: [1, 1.2, 1],
          }}
          transition={{
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * -30,
            y: mousePosition.y * -30,
            scale: [1, 1.3, 1],
          }}
          transition={{
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* المحتوى */}
      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          
          {/* الجانب الأيسر - المحتوى */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-right"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-6 py-3 mb-8 backdrop-blur-sm"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                ✨
              </motion.span>
              <span className="text-gold font-bold">الحل الأمثل للتسويق الذكي</span>
            </motion.div>

            {/* العنوان الرئيسي */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">لمسة واحدة...</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-400 to-gold animate-gradient">
                حضور رقمي كامل
              </span>
            </motion.h1>

            {/* الوصف */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl"
            >
              تساعدك في بناء هويتك الرقمية بطريقة احترافية من خلال بطاقات NFC 
              الذكية وحلول التسويق المتكاملة
            </motion.p>

            {/* الأزرار */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="/contact" className="btn-primary text-lg px-8 py-4 animate-glow">
                اطلب الآن
              </Link>
              <Link href="/about" className="btn-secondary text-lg px-8 py-4">
                تعرف علينا
              </Link>
            </motion.div>

            {/* الإحصائيات المحسّنة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/50 transition-all"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                    className="text-4xl mb-2"
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-3xl font-bold text-gold mb-1"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* الجانب الأيمن - بطاقة NFC 3D */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* توهج خلف البطاقة */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gold/20 to-yellow-500/20 blur-3xl rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <NFCCard3D />

            {/* عناصر ديكور حول البطاقة */}
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 border-2 border-gold/30 rounded-full"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            />
            
            <motion.div
              className="absolute -bottom-10 -left-10 w-16 h-16 border-2 border-blue-500/30 rounded-full"
              animate={{
                rotate: -360,
                scale: [1, 1.3, 1],
              }}
              transition={{
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* موجة في الأسفل */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" className="w-full h-auto">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            fill="rgba(251, 191, 36, 0.1)"
            d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z"
          />
        </svg>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gold/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-gold rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
