import { motion } from 'framer-motion';
import { useState } from 'react';

export default function NFCCard3D() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000">
      <motion.div
        className="relative w-full h-64 cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ 
          rotateY: 15,
          rotateX: -10,
          scale: 1.05,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* البطاقة الرئيسية */}
        <div className="relative w-full h-full bg-gradient-to-br from-gold via-yellow-400 to-amber-500 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* تأثير لامع متحرك */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: isHovered ? ["-100%", "200%"] : "-100%",
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: isHovered ? Infinity : 0,
            }}
            style={{
              transform: "skewX(-20deg)",
            }}
          />

          {/* دوائر خلفية متحركة */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -20, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* محتوى البطاقة */}
          <div className="relative h-full p-6 flex flex-col justify-between z-10">
            
            {/* الجزء العلوي */}
            <div className="flex justify-between items-start">
              <div>
                <motion.h3 
                  className="text-2xl font-bold text-dark mb-1"
                  animate={{
                    y: isHovered ? -5 : 0,
                  }}
                >
                  NFC Card
                </motion.h3>
                <motion.p 
                  className="text-dark/80 text-sm"
                  animate={{
                    y: isHovered ? -5 : 0,
                  }}
                  transition={{ delay: 0.1 }}
                >
                  Smart Business Solution
                </motion.p>
              </div>

              {/* أيقونة NFC متحركة */}
              <motion.div
                animate={{
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.6 }}
              >
                <svg 
                  className="w-12 h-12 text-dark" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM18 6h-5c-1.1 0-2 .9-2 2v2.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.37-1-1.72V8h3v7.28c-.6.35-1 .98-1 1.72 0 1.1.9 2 2 2s2-.9 2-2c0-.74-.4-1.37-1-1.72V8c0-1.1-.9-2-2-2z"/>
                </svg>
              </motion.div>
            </div>

            {/* الجزء الأوسط - موجات NFC */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <motion.div
                  className="absolute w-20 h-20 border-4 border-dark/20 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="absolute w-20 h-20 border-4 border-dark/30 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.5,
                  }}
                />
                <div className="relative w-20 h-20 bg-dark/10 rounded-full flex items-center justify-center">
                  <motion.div
                    className="w-12 h-12 bg-dark rounded-full"
                    animate={{
                      scale: isHovered ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: isHovered ? Infinity : 0,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* الجزء السفلي */}
            <div>
              <motion.div 
                className="flex justify-between items-end"
                animate={{
                  y: isHovered ? 5 : 0,
                }}
              >
                <div>
                  <p className="text-dark/70 text-xs mb-1">تاب لينك السعودية</p>
                  <p className="text-dark font-bold text-lg">TapLink SA</p>
                </div>
                <motion.div
                  animate={{
                    rotate: isHovered ? [0, 10, 0] : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isHovered ? Infinity : 0,
                  }}
                >
                  <svg 
                    className="w-8 h-8 text-dark" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" 
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* حواف متوهجة */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              boxShadow: isHovered 
                ? "0 0 30px rgba(251, 191, 36, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3)"
                : "0 0 0px rgba(251, 191, 36, 0)",
            }}
            animate={{
              boxShadow: isHovered 
                ? [
                    "0 0 30px rgba(251, 191, 36, 0.6)",
                    "0 0 50px rgba(251, 191, 36, 0.8)",
                    "0 0 30px rgba(251, 191, 36, 0.6)",
                  ]
                : "0 0 0px rgba(251, 191, 36, 0)",
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
            }}
          />
        </div>

        {/* ظل البطاقة 3D */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gold/50 to-amber-500/50 rounded-3xl blur-xl -z-10"
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 0.8 : 0.5,
          }}
        />
      </motion.div>
    </div>
  );
}
