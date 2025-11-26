import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import TrustedBy from '@/components/home/TrustedBy';
import ServicesSection from '@/components/home/ServicesSection';
import HowItWorks from '@/components/home/HowItWorks';
import Stats from '@/components/home/Stats';
import WhyUs from '@/components/home/WhyUs';
import Testimonials from '@/components/home/Testimonials';
import FAQSection from '@/components/home/FAQSection';
import MainCTA from '@/components/home/MainCTA';
import WhatsAppFloat from '@/components/common/WhatsAppFloat';
import ProductsShowcase from '../components/home/ProductsShowcase';

export default function Home() {
  return (
    <Layout
      title="تاب لينك السعودية | بطاقات NFC الذكية وحلول التسويق الرقمي"
      description="نحن تاب لينك السعودية، متخصصون في بطاقات NFC الذكية، إدارة Google Business Profile، وتصميم المواقع الإلكترونية في بريدة - القصيم"
      keywords="بطاقات NFC, بطاقات ذكية, جوجل بزنس, تصميم مواقع, بريدة, القصيم, السعودية"
    >
      <Hero />
      <TrustedBy />
      <ServicesSection />
      <ProductsShowcase />
      <HowItWorks />
      <Stats />
      <WhyUs />
      <Testimonials />
      <FAQSection />
      <MainCTA />
      <WhatsAppFloat />
    </Layout>
  );
}




