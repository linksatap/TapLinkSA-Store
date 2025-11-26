import { useEffect, useState } from 'react';

export default function TestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        // جلب المنتجات مباشرة من WooCommerce API
        const consumerKey = 'ck_481d1b61c439fe33ecd1fb4be5cdd77c97d64e46'; // ضع مفتاحك هنا
        const consumerSecret = 'cs_15033797cc0c866c9b381af386b4fad48eb357e0'; // ضع مفتاحك هنا
        
        const url = `https://cms.smartshopperz.com/wp-json/wc/v3/products?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}&per_page=10`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', direction: 'rtl' }}>
        <h1>جاري تحميل المنتجات...</h1>
        <div style={{ fontSize: '48px', marginTop: '20px' }}>⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', direction: 'rtl', backgroundColor: '#fee', color: '#c00' }}>
        <h1>❌ حدث خطأ</h1>
        <p style={{ fontSize: '18px' }}>{error}</p>
        <hr />
        <h3>الأسباب المحتملة:</h3>
        <ul style={{ textAlign: 'right', lineHeight: '1.8' }}>
          <li>مفاتيح WooCommerce API غير صحيحة</li>
          <li>المفاتيح غير موجودة في <code>.env.local</code></li>
          <li>WooCommerce غير مفعّل على الموقع</li>
          <li>لا توجد صلاحيات كافية للمفاتيح</li>
        </ul>
        <hr />
        <h3>كيف تحصل على المفاتيح:</h3>
        <ol style={{ textAlign: 'right', lineHeight: '1.8' }}>
          <li>ادخل إلى: <code>https://cms.smartshopperz.com/wp-admin</code></li>
          <li>اذهب إلى: <strong>WooCommerce → الإعدادات → متقدم → REST API</strong></li>
          <li>اضغط "Add key" أو "إضافة مفتاح"</li>
          <li>الصلاحيات: <strong>Read/Write</strong></li>
          <li>انسخ المفاتيح وضعها في <code>.env.local</code></li>
        </ol>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', direction: 'rtl', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
          ✅ اختبار منتجات WooCommerce
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
          عدد المنتجات: <strong style={{ color: '#FBBF24' }}>{products.length}</strong>
        </p>

        {products.length === 0 ? (
          <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '12px', textAlign: 'center' }}>
            <h2>📦 لا توجد منتجات</h2>
            <p style={{ color: '#666' }}>أضف منتجات في WooCommerce أولاً</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* صورة المنتج */}
                {product.images && product.images[0] && (
                  <div style={{ marginBottom: '15px', overflow: 'hidden', borderRadius: '8px' }}>
                    <img
                      src={product.images[0].src}
                      alt={product.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* اسم المنتج */}
                <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#111' }}>
                  {product.name}
                </h3>

                {/* السعر */}
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#FBBF24' }}>
                    {product.price} ر.س
                  </span>
                  {product.on_sale && product.regular_price !== product.price && (
                    <span style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through', marginRight: '10px' }}>
                      {product.regular_price} ر.س
                    </span>
                  )}
                </div>

                {/* الوصف المختصر */}
                <div
                  style={{ fontSize: '14px', color: '#666', marginBottom: '15px', lineHeight: '1.6' }}
                  dangerouslySetInnerHTML={{ 
                    __html: product.short_description?.substring(0, 100) + '...' || 'لا يوجد وصف'
                  }}
                />

                {/* معلومات إضافية */}
                <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '13px', color: '#999' }}>
                  <div>ID: {product.id}</div>
                  <div>Slug: {product.slug}</div>
                  <div>الحالة: {product.stock_status === 'instock' ? '✅ متوفر' : '❌ غير متوفر'}</div>
                  {product.on_sale && <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>🔥 تخفيض</div>}
                  {product.featured && <div style={{ color: '#FBBF24', fontWeight: 'bold' }}>⭐ مميز</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* معلومات إضافية */}
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px' }}>
          <h3>📊 معلومات API</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', overflow: 'auto', fontSize: '12px' }}>
            {JSON.stringify(
              {
                endpoint: 'https://cms.smartshopperz.com/wp-json/wc/v3/products',
                products_count: products.length,
                first_product: products[0] ? {
                  id: products[0].id,
                  name: products[0].name,
                  price: products[0].price,
                  slug: products[0].slug,
                } : null
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
