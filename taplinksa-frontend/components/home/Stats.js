import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
//import gsap from 'gsap';

export default function Stats() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const stats = [
    { number: 500, suffix: '+', label: 'عميل سعيد', icon: '😊' },
    { number: 1000, suffix: '+', label: 'مشروع منجز', icon: '✅' },
    { number: 5, suffix: '+', label: 'سنوات خبرة', icon: '⭐' },
    { number: 99, suffix: '%', label: 'رضا العملاء', icon: '💯' },
  ];

  return (
    <section ref={sectionRef} className="section-padding gradient-gold">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">{stat.icon}</div>
              <StatsCounter
                end={stat.number}
                suffix={stat.suffix}
                isInView={isInView}
              />
              <div className="text-dark/80 font-medium mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsCounter({ end, suffix, isInView }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    if (isInView && countRef.current) {
      gsap.to(countRef.current, {
        innerText: end,
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power1.out',
        onUpdate: function () {
          setCount(Math.ceil(this.targets()[0].innerText));
        },
      });
    }
  }, [isInView, end]);

  return (
    <div className="text-5xl font-bold text-dark">
      <span ref={countRef}>{count}</span>
      <span>{suffix}</span>
    </div>
  );
}
