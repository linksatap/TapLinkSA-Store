import Layout from '@/components/layout/Layout';

export default function PrivacyPolicy() {
  return (
    <Layout
      title="سياسة الخصوصية | تاب لينك السعودية"
      description="سياسة الخصوصية وحماية البيانات في تاب لينك السعودية"
    >
      <div className="container-custom section-padding">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-gray-600 hover:text-gold">الرئيسية</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">سياسة الخصوصية</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">سياسة الخصوصية</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">المقدمة</h2>
              <p className="text-gray-700 leading-relaxed">
                نحن في تاب لينك السعودية نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحماية معلوماتك.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">جمع المعلومات</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                نقوم بجمع المعلومات التالية:
              </p>
              <ul className="list-disc mr-6 space-y-2 text-gray-700">
                <li>معلومات الاتصال (الاسم، البريد الإلكتروني، رقم الهاتف)</li>
                <li>معلومات الطلب والشراء</li>
                <li>بيانات التصفح والاستخدام</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">استخدام المعلومات</h2>
              <p className="text-gray-700 leading-relaxed">
                نستخدم معلوماتك لتقديم خدماتنا، معالجة الطلبات، التواصل معك، وتحسين تجربتك.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">حماية البيانات</h2>
              <p className="text-gray-700 leading-relaxed">
                نتخذ جميع الإجراءات الأمنية اللازمة لحماية بياناتك من الوصول غير المصرح به أو الإفصاح أو التعديل.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">حقوقك</h2>
              <p className="text-gray-700 leading-relaxed">
                لديك الحق في الوصول إلى بياناتك، تصحيحها، أو طلب حذفها. للاستفسارات، يرجى التواصل معنا.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
