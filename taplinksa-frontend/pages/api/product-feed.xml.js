// pages/api/product-feed.xml.js - النسخة النهائية البسيطة والمضمونة
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  channel>
    <title>تاب لينك السعودية</title>
    <link>https://taplinksa.com</link>
    <description>بطاقات NFC الذكية وحلول التسويق الرقمي</description>
    
    <item>
      <g:id>1</g:id>
      <g:title>بطاقة NFC بيضاء فاخرة</g:title>
      <g:description>بطاقة NFC ذكية عالية الجودة من تاب لينك السعودية شحن مجاني ضمان سنة دعم 24/7</g:description>
      <g:link>https://taplinksa.com/product/white-nfc</g:link>
      <g:image_link>https://taplinksa.com/images/nfc-white.jpg</g:image_link>
      <g:price>299.00 SAR</g:price>
      <g:sale_price>249.00 SAR</g:sale_price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>TapLink SA</g:brand>
      <g:google_product_category>922</g:google_product_category>
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Standard</g:service>
        <g:price>25.00 SAR</g:price>
      </g:shipping>
    </item>
    
    <item>
      <g:id>2</g:id>
      <g:title>بطاقة NFC سوداء لرفع التقييمات</g:title>
      <g:description>بطاقة NFC مخصصة لرفع تقييمات Google Business شحن سريع في السعودية</g:description>
      <g:link>https://taplinksa.com/product/black-nfc-reviews</g:link>
      <g:image_link>https://taplinksa.com/images/nfc-black.jpg</g:image_link>
      <g:price>199.00 SAR</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>TapLink SA</g:brand>
      <g:google_product_category>922</g:google_product_category>
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Standard</g:service>
        <g:price>25.00 SAR</g:price>
      </g:shipping>
    </item>
    
    <item>
      <g:id>3</g:id>
      <g:title>اشتراك نيتفلكس شهري</g:title>
      <g:description>اشتراك نيتفلكس رسمي 100% تفعيل فوري شحن رقمي فوري</g:description>
      <g:link>https://taplinksa.com/subscriptions/netflix</g:link>
      <g:image_link>https://taplinksa.com/images/netflix.jpg</g:image_link>
      <g:price>49.00 SAR</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>TapLink SA</g:brand>
      <g:google_product_category>313</g:google_product_category>
      <g:shipping>
        <g:country>SA</g:country>
        <g:service>Digital</g:service>
        <g:price>0.00 SAR</g:price>
      </g:shipping>
    </item>
  </channel>
</rss>`;
  
  res.status(200).send(xml);
}
