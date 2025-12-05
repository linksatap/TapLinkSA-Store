/**
 * AOSInit Component
 * يحمّل مكتبة AOS (Animate On Scroll) بشكل ديناميكي لتحسين الأداء
 */

import { useEffect } from 'react';

export default function AOSInit() {
  useEffect(() => {
    // تحميل AOS فقط في المتصفح وبعد تحميل الصفحة
    const initAOS = async () => {
      try {
        const AOS = await import('aos');
        await import('aos/dist/aos.css');
        
        AOS.init({
          duration: 800,
          once: true, // تشغيل الأنيميشن مرة واحدة فقط
          offset: 50,
          easing: 'ease-out-cubic',
          disable: 'mobile', // تعطيل في الموبايل لتحسين الأداء
          startEvent: 'load', // البدء بعد تحميل الصفحة
        });
      } catch (error) {
        console.warn('⚠️ Failed to load AOS:', error);
      }
    };

    // تأخير التحميل قليلاً لإعطاء الأولوية للمحتوى الأساسي
    const timer = setTimeout(() => {
      initAOS();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
