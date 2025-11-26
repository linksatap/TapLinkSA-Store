import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import SectionTitle from '@/components/ui/SectionTitle';

export default function About() {
  const values = [
    { icon: '💡', title: 'الابتكار', description: 'نسعى دائماً لتقديم حلول مبتكرة ومتطورة' },
    { icon: '⭐', title: 'الجودة', description: 'نلتزم بأعلى معايير الجودة في جميع خدماتنا' },
    { icon: '🤝', title: 'الثقة', description: 'نبني علاقات طويلة الأمد مع عملائنا' },
    { icon: '🎯', title: 'التميز', description: 'نهدف للتميز في كل ما نقدمه' },
  ];

  return (
    <Layout
      title="من نحن | تاب لينك السعودية"
      description="تعرف على تاب لينك السعودية - رواد حلول التسويق الرقمي في بريدة والقصيم"
    >
      <div className="container-custom section-padding">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-gray-600 hover:text-gold">الرئيسية</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">من نحن</li>
          </ol>
        </nav>

        <SectionTitle
          title="من نحن"
          subtitle="نحن تاب لينك السعودية - شريكك في التحول الرقمي"
        />

        <div className="max-w-4xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg mx-auto text-center mb-12"
          >
            <p className="text-xl text-gray-700 leading-relaxed">
              تأسست تاب لينك السعودية في بريدة - القصيم لتكون الشريك الأمثل للشركات والأفراد في رحلتهم نحو التحول الرقمي.
              نقدم حلولاً متكاملة تشمل بطاقات NFC الذكية، إدارة Google Business Profile، وتصميم المواقع الإلكترونية.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              data-aos="fade-up"
              className="bg-gradient-gold p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-dark">رؤيتنا</h3>
              <p className="text-dark/80 leading-relaxed">
                أن نكون الخيار الأول للشركات والأفراد في السعودية لحلول التسويق الرقمي والبطاقات الذكية
              </p>
            </motion.div>

            <motion.div
              data-aos="fade-up"
              data-aos-delay="100"
              className="bg-dark p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-gold">رسالتنا</h3>
              <p className="text-gray-300 leading-relaxed">
                تمكين عملائنا من بناء حضور رقمي قوي وفعّال من خلال حلول مبتكرة وخدمة متميزة
              </p>
            </motion.div>
          </div>

          <SectionTitle title="قيمنا" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                data-aos="flip-left"
                data-aos-delay={index * 100}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h4 className="text-xl font-bold mb-2">{value.title}</h4>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
