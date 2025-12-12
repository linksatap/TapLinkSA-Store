import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function ShippingPolicy() {
  return (
    <Layout>
      <Head>
        <title>سياسة الشحن والتوصيل | تاب لينك السعودية</title>
        <meta 
          name="description" 
          content="تعرف على سياسة الشحن والتوصيل في تاب لينك - شحن مجاني للطلبات فوق 199 ريال، توصيل سريع لجميع مدن المملكة، وتسليم فوري للمنتجات الرقمية" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://taplinksa.com/shipping-policy" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gold/10 via-white to-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="text-6xl mb-6">📦</div>
            <h1 className="text-3xl md:text-5xl font-bold text-dark mb-4">
              سياسة الشحن والتوصيل
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              نوفر خدمات شحن سريعة وموثوقة لجميع أنحاء المملكة العربية السعودية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <InfoCard
              icon="🚚"
              title="شحن مجاني"
              description="للطلبات فوق 199 ريال"
              highlight="bg-green-50 border-green-200"
            />
            <InfoCard
              icon="⚡"
              title="تسليم فوري"
              description="للمنتجات الرقمية"
              highlight="bg-blue-50 border-blue-200"
            />
            <InfoCard
              icon="📍"
              title="تغطية شاملة"
              description="جميع مدن المملكة"
              highlight="bg-purple-50 border-purple-200"
            />
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            
            {/* 1. أنواع الشحن */}
            <PolicySection
              title="أنواع الشحن المتاحة"
              icon="📦"
            >
              <ShippingType
                title="1. التوصيل للمنتجات الرقمية (فوري)"
                items={[
                  'تسليم فوري عبر البريد الإلكتروني خلال 5-30 دقيقة',
                  'الاشتراكات الرقمية (نتفليكس، شاهد، OSN، Spotify، وغيرها)',
                  'أكواد التفعيل والبطاقات الرقمية',
                  'مجاني 100% - لا توجد رسوم شحن',
                ]}
                iconColor="text-blue-500"
              />

              <ShippingType
                title="2. الشحن السريع (1-3 أيام عمل)"
                items={[
                  'للمنتجات الفيزيائية (بطاقات NFC، ستاندات، إلخ)',
                  'التوصيل لجميع مدن المملكة',
                  'تتبع الشحنة عبر رقم التتبع',
                  'مجاني للطلبات فوق 199 ريال',
                  '25 ريال للطلبات أقل من 199 ريال',
                ]}
                iconColor="text-green-500"
              />

              <ShippingType
                title="3. التوصيل داخل القصيم (نفس اليوم)"
                items={[
                  'التوصيل خلال 24 ساعة لمدينة بريدة والمناطق القريبة',
                  'خدمة متاحة للطلبات قبل الساعة 2 ظهراً',
                  'رسوم التوصيل: 15 ريال فقط',
                ]}
                iconColor="text-purple-500"
              />
            </PolicySection>

            {/* 2. أوقات التوصيل */}
            <PolicySection
              title="أوقات التوصيل المتوقعة"
              icon="⏰"
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-right font-bold">المنطقة</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-bold">المدة المتوقعة</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-bold">رسوم الشحن</th>
                    </tr>
                  </thead>
                  <tbody>
                    <DeliveryRow
                      region="بريدة والقصيم"
                      time="1-2 يوم عمل"
                      cost="15 ريال أو مجاني (+199)"
                    />
                    <DeliveryRow
                      region="الرياض وجدة والدمام"
                      time="2-3 أيام عمل"
                      cost="25 ريال أو مجاني (+199)"
                    />
                    <DeliveryRow
                      region="المدن الرئيسية الأخرى"
                      time="3-4 أيام عمل"
                      cost="25 ريال أو مجاني (+199)"
                    />
                    <DeliveryRow
                      region="المناطق النائية"
                      time="4-7 أيام عمل"
                      cost="35 ريال أو مجاني (+199)"
                    />
                    <DeliveryRow
                      region="المنتجات الرقمية"
                      time="5-30 دقيقة"
                      cost="مجاني"
                      highlight
                    />
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>📌 ملاحظة:</strong> الأوقات المذكورة تقديرية وقد تختلف حسب الموقع الجغرافي وظروف الشحن. 
                  أيام العمل لا تشمل عطلات نهاية الأسبوع والأعياد الرسمية.
                </p>
              </div>
            </PolicySection>

            {/* 3. طرق الشحن */}
            <PolicySection
              title="شركاء الشحن"
              icon="🚛"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <ShippingPartner
                  name="سمسا للشحن (SMSA)"
                  features={['تغطية شاملة', 'تتبع لحظي', 'توصيل آمن']}
                />
                <ShippingPartner
                  name="أرامكس (Aramex)"
                  features={['خدمة سريعة', 'دعم ممتاز', 'تأمين الشحنة']}
                />
              </div>
            </PolicySection>

            {/* 4. تتبع الشحنة */}
            <PolicySection
              title="تتبع شحنتك"
              icon="📍"
            >
              <ol className="space-y-4">
                <StepItem
                  number="1"
                  title="استلام رقم التتبع"
                  description="سيصلك رقم التتبع عبر البريد الإلكتروني ورسالة SMS فور شحن الطلب"
                />
                <StepItem
                  number="2"
                  title="تتبع الشحنة"
                  description="استخدم رقم التتبع على موقع شركة الشحن أو تطبيقها"
                />
                <StepItem
                  number="3"
                  title="استلام الطلب"
                  description="سيتصل بك مندوب التوصيل قبل الوصول بـ 30 دقيقة"
                />
              </ol>

              <div className="mt-6 text-center">
                <Link 
                  href="/track-order"
                  className="inline-block bg-gold text-dark font-bold px-8 py-3 rounded-xl hover:bg-gold-dark transition-all"
                >
                  🔍 تتبع طلبك الآن
                </Link>
              </div>
            </PolicySection>

            {/* 5. الدفع عند الاستلام */}
            <PolicySection
              title="الدفع عند الاستلام (COD)"
              icon="💳"
            >
              <ul className="space-y-3">
                <ListItem text="متاح لجميع المنتجات الفيزيائية" />
                <ListItem text="ادفع نقداً أو ببطاقة مدى عند استلام الطلب" />
                <ListItem text="لا توجد رسوم إضافية" />
                <ListItem text="تأكد من فحص المنتج قبل الدفع" />
              </ul>

              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>💡 نصيحة:</strong> للمنتجات الرقمية، يجب الدفع إلكترونياً (بطاقة ائتمان/مدى أو Apple Pay) 
                  لضمان التسليم الفوري.
                </p>
              </div>
            </PolicySection>

            {/* 6. مشاكل الشحن */}
            <PolicySection
              title="في حالة وجود مشكلة"
              icon="🆘"
            >
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">تواصل معنا فوراً في الحالات التالية:</h3>
                <ul className="space-y-2">
                  <ListItem text="تأخر الشحنة عن الموعد المتوقع بأكثر من يومين" />
                  <ListItem text="تلف المنتج عند الاستلام" />
                  <ListItem text="استلام منتج خاطئ" />
                  <ListItem text="عدم وصول كود التفعيل للمنتجات الرقمية" />
                </ul>

                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <ContactMethod
                    icon="📧"
                    label="البريد الإلكتروني"
                    value="support@taplinksa.com"
                  />
                  <ContactMethod
                    icon="📱"
                    label="واتساب"
                    value="+966 XX XXX XXXX"
                  />
                  <ContactMethod
                    icon="⏰"
                    label="ساعات العمل"
                    value="9 ص - 10 م"
                  />
                </div>
              </div>
            </PolicySection>

            {/* 7. ملاحظات مهمة */}
            <PolicySection
              title="ملاحظات مهمة"
              icon="⚠️"
            >
              <div className="space-y-4">
                <ImportantNote
                  title="عنوان الشحن"
                  text="يرجى التأكد من صحة عنوان الشحن ورقم الهاتف. أي خطأ قد يؤدي لتأخير التوصيل."
                />
                <ImportantNote
                  title="المناطق النائية"
                  text="بعض المناطق النائية قد تستغرق وقتاً أطول وقد تطبق رسوم إضافية."
                />
                <ImportantNote
                  title="الطلبات الدولية"
                  text="حالياً نقدم الشحن داخل المملكة فقط. للطلبات الدولية، تواصل معنا."
                />
                <ImportantNote
                  title="العطلات الرسمية"
                  text="قد يتأخر الشحن خلال العطلات الرسمية والمناسبات (رمضان، عيد الفطر، إلخ)."
                />
              </div>
            </PolicySection>

          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-gold via-yellow-400 to-gold rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
              جاهز للطلب؟ 🛒
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              تسوق الآن واستمتع بشحن سريع وموثوق لجميع أنحاء المملكة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-dark text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition-all"
              >
                تصفح المتجر
              </Link>
              <Link
                href="/contact"
                className="bg-white text-dark font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all border-2 border-dark"
              >
                تواصل معنا
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "سياسة الشحن والتوصيل | تاب لينك السعودية",
            "description": "سياسة الشحن والتوصيل لمتجر تاب لينك - شحن مجاني للطلبات فوق 199 ريال",
            "publisher": {
              "@type": "Organization",
              "name": "TapLink SA",
              "url": "https://taplinksa.com"
            }
          })
        }}
      />
    </Layout>
  );
}

// === Components ===

function InfoCard({ icon, title, description, highlight }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-xl border-2 ${highlight} text-center`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
}

function PolicySection({ title, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6 flex items-center gap-3">
        <span className="text-4xl">{icon}</span>
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function ShippingType({ title, items, iconColor }) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-xl font-bold text-dark mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className={`${iconColor} mt-1`}>✓</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeliveryRow({ region, time, cost, highlight }) {
  return (
    <tr className={highlight ? 'bg-green-50 font-bold' : ''}>
      <td className="border border-gray-200 px-4 py-3">{region}</td>
      <td className="border border-gray-200 px-4 py-3">{time}</td>
      <td className="border border-gray-200 px-4 py-3">{cost}</td>
    </tr>
  );
}

function ShippingPartner({ name, features }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h4 className="font-bold text-lg mb-3">{name}</h4>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-gray-700">
            <span className="text-green-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepItem({ number, title, description }) {
  return (
    <li className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-gold rounded-full flex items-center justify-center font-bold text-dark">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-lg mb-1">{title}</h4>
        <p className="text-gray-700">{description}</p>
      </div>
    </li>
  );
}

function ListItem({ text }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-green-500 mt-1">✓</span>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}

function ContactMethod({ icon, label, value }) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-bold text-dark">{value}</p>
    </div>
  );
}

function ImportantNote({ title, text }) {
  return (
    <div className="p-4 bg-gray-50 border-r-4 border-gold rounded-lg">
      <h4 className="font-bold text-dark mb-1">{title}</h4>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
}
