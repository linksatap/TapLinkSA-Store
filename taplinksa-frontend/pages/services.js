import Layout from '@/components/layout/Layout';
import ServicesSection from '@/components/home/ServicesSection';
import MainCTA from '@/components/home/MainCTA';

export default function Services() {
  return (
    <Layout
      title="خدماتنا | تاب لينك السعودية"
      description="اكتشف خدماتنا المتكاملة: بطاقات NFC الذكية، إدارة Google Business، تصميم المواقع"
    >
      <div className="container-custom section-padding">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-gray-600 hover:text-gold">الرئيسية</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">الخدمات</li>
          </ol>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
            خدماتنا المتكاملة
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" data-aos="fade-up" data-aos-delay="100"></div>
        </div>
      </div>

      <ServicesSection />
      <MainCTA />
    </Layout>
  );
}
