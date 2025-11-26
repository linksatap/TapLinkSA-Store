import Layout from '@/components/layout/Layout';
import Accordion from '@/components/ui/Accordion';
import SectionTitle from '@/components/ui/SectionTitle';

export default function FAQ() {
  const faqs = [
    {
      question: 'ما هي بطاقات NFC الذكية؟',
      answer: 'بطاقات NFC هي بطاقات عمل ذكية تتيح لك مشاركة معلومات الاتصال والروابط الاجتماعية بمجرد تقريب الهاتف من البطاقة، دون الحاجة لطباعة أو تطبيقات إضافية.'
    },
    {
      question: 'كيف تعمل بطاقات NFC؟',
      answer: 'عند تقريب الهاتف الذكي من البطاقة، يتم نقل المعلومات المبرمجة في البطاقة تلقائياً إلى الهاتف. يمكن للمستخدم حفظ معلومات الاتصال أو فتح الروابط مباشرة.'
    },
    {
      question: 'هل يمكن تحديث معلومات البطاقة؟',
      answer: 'نعم، يمكنك تحديث جميع المعلومات المرتبطة بالبطاقة في أي وقت من خلال لوحة التحكم الخاصة بك، دون الحاجة لطباعة بطاقات جديدة.'
    },
    {
      question: 'ما هي خدمة إدارة Google Business؟',
      answer: 'نساعدك في إنشاء وتحسين ملفك التجاري على خرائط جوجل، مما يزيد من ظهورك في نتائج البحث المحلية ويجذب المزيد من العملاء.'
    },
    {
      question: 'كم يستغرق تصميم الموقع الإلكتروني؟',
      answer: 'يعتمد ذلك على حجم المشروع وتعقيده، ولكن عادة ما يستغرق من أسبوعين إلى شهر واحد لإنشاء موقع متكامل.'
    },
    {
      question: 'هل تقدمون خدمة الدعم الفني؟',
      answer: 'نعم، نقدم دعماً فنياً متواصلاً لجميع عملائنا عبر الهاتف والواتساب والبريد الإلكتروني.'
    },
    {
      question: 'ما هي مدة التسليم للبطاقات الذكية؟',
      answer: 'يتم تسليم البطاقات خلال 3-5 أيام عمل من تأكيد الطلب والتصميم.'
    },
    {
      question: 'هل يمكن تصميم بطاقات بهوية خاصة؟',
      answer: 'بالتأكيد! نوفر خدمة التصميم المخصص بالكامل حسب هوية علامتك التجارية وتفضيلاتك.'
    }
  ];

  return (
    <Layout
      title="الأسئلة الشائعة | تاب لينك السعودية"
      description="إجابات على الأسئلة الأكثر شيوعاً حول بطاقات NFC وخدماتنا"
    >
      <div className="container-custom section-padding">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-gray-600 hover:text-gold">الرئيسية</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">الأسئلة الشائعة</li>
          </ol>
        </nav>

        <SectionTitle
          title="الأسئلة الشائعة"
          subtitle="إجابات على الأسئلة الأكثر شيوعاً"
        />

        <div className="max-w-4xl mx-auto mt-12">
          <Accordion items={faqs} />
        </div>
      </div>
    </Layout>
  );
}
