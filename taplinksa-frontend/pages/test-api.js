import { useEffect, useState } from 'react';

export default function TestAPI() {
  const [wpData, setWpData] = useState(null);
  const [wcData, setWcData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function testAPIs() {
      try {
        // اختبار WordPress API
        const wpResponse = await fetch('https://cms.smartshopperz.com/wp-json/wp/v2/posts?per_page=5');
        const wpJson = await wpResponse.json();
        setWpData(wpJson);

        // اختبار WooCommerce API (إذا كان لديك المفاتيح)
        // ملاحظة: هذا يحتاج إلى مفاتيح API من السيرفر
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    testAPIs();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>جاري التحميل...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>خطأ: {error}</div>;

  return (
    <div style={{ padding: '20px', direction: 'rtl' }}>
      <h1>اختبار API</h1>
      
      <h2>WordPress Posts:</h2>
      {wpData && (
        <ul>
          {wpData.map(post => (
            <li key={post.id}>
              <strong>{post.title.rendered}</strong>
              <br />
              <small>{new Date(post.date).toLocaleDateString('ar')}</small>
            </li>
          ))}
        </ul>
      )}

      {!wpData && <p>لا توجد مقالات</p>}
    </div>
  );
}
