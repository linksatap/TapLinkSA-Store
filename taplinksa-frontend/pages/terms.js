import Layout from '@/components/layout/Layout';

export default function Terms() {
  return (
    <Layout
      title="الشروط والأحكام | تاب لينك السعودية"
      description="الشروط والأحكام الخاصة باستخدام خدمات تاب لينك السعودية"
    >
      <div className="container-custom section-padding">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-gray-600 hover:text-gold">الرئيسية</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">الشروط والأحكام</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">الشروط والأحكام</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">قبول الشروط</h2>
              <p className="text-gray-700 leading-relaxed">
                باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">الخدمات</h2>
              <p className="text-gray-700 leading-relaxed">
                نوفر خدمات بطاقات NFC الذكية، إدارة Google Business Profile، وتصميم المواقع الإلكترونية. نحتفظ بالحق في تعديل أو إيقاف أي خدمة في أي وقت.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">الطلبات والدفع</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                عند تقديم طلب، فإنك توافق على:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700">
                <li>تقديم معلومات صحيحة ودقيقة</li>
                <li>الدفع الكامل للخدمات المطلوبة</li>
                <li>الالتزام بمواعيد التسليم المحددة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">الملكية الفكرية</h2>
              <p className="text-gray-700 leading-relaxed">
                جميع المحتويات والتصاميم على موقعنا محمية بحقوق الطبع والنشر. لا يجوز استخدامها دون إذن كتابي مسبق.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">المسؤولية</h2>
              <p className="text-gray-700 leading-relaxed">
                نبذل قصارى جهدنا لتقديم خدمات عالية الجودة، ولكننا لا نتحمل المسؤولية عن أي أضرار غير مباشرة أو تبعية.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">التواصل</h2>
              <p className="text-gray-700 leading-relaxed">
                لأي استفسارات حول الشروط والأحكام، يرجى التواصل معنا عبر البريد الإلكتروني أو الهاتف.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
