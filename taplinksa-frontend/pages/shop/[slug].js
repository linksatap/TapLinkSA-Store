import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { fetchProductBySlug } from '../../lib/woocommerce';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // ▼▼▼ إضافة حالات الأنواع (Variants)
  const [selectedOptions, setSelectedOptions] = useState({});

  // ▼▼ تحميل المنتج
  useEffect(() => {
    if (!slug) return;

    async function loadProduct() {
      const data = await fetchProductBySlug(slug);
      setProduct(data);
      setMainImage(data?.images?.[0]?.src || '');
    }

    loadProduct();
  }, [slug]);

  if (!product) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[300px] text-lg font-bold">
          جاري التحميل...
        </div>
      </Layout>
    );
  }

  // ▼▼ حساب السعر
  const price = parseFloat(product.price) || 0;
  const regularPrice = parseFloat(product.regular_price) || 0;
  const salePrice = parseFloat(product.sale_price) || null;
  const hasDiscount = salePrice && salePrice < regularPrice;
  const discountPercent =
    hasDiscount && regularPrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : 0;

  // ▼▼ تجهيز الأنواع
  const variantAttributes = product.attributes?.filter((a) => a.variation);

  const handleOptionChange = (name, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Layout title={product.name}>
      <div className="container mx-auto px-4 py-10 max-w-6xl">

        {/* ====== قسم الصور ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* الصورة الرئيسية */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square bg-white rounded-2xl shadow overflow-hidden">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* الصور المصغرة */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img.src)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 
                    ${mainImage === img.src ? 'border-gold' : 'border-gray-300'}`}
                >
                  <Image src={img.src} alt="thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ====== تفاصيل المنتج ====== */}
          <div className="flex flex-col gap-6">

            {/* العنوان */}
            <h1 className="text-3xl font-bold text-dark">{product.name}</h1>

            {/* السعر */}
            <div className="bg-gradient-to-r from-gold/20 to-yellow-100 p-6 rounded-2xl shadow-lg">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-5xl font-bold text-dark">
                    {(hasDiscount ? salePrice : price).toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-600 ml-1">ر.س</span>
                </div>

                {hasDiscount && (
                  <div className="text-right">
                    <p className="text-gray-400 line-through">{regularPrice} ر.س</p>
                    <p className="text-red-600 font-bold">وفر {discountPercent}%</p>
                  </div>
                )}
              </div>
            </div>

            {/* ▼▼ عرض الأنواع Variants */}
            {variantAttributes?.length > 0 && (
              <div className="space-y-4 bg-white p-5 rounded-2xl shadow-md">
                <h3 className="font-bold text-lg">الخيارات المتاحة:</h3>

                {variantAttributes.map((attr) => (
                  <div key={attr.id} className="space-y-2">
                    <p className="font-bold">{attr.name}</p>

                    <div className="flex flex-wrap gap-2">
                      {attr.options.map((option) => {
                        const isSelected = selectedOptions[attr.name] === option;

                        return (
                          <button
                            key={option}
                            onClick={() => handleOptionChange(attr.name, option)}
                            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all 
                            ${isSelected
                                ? 'bg-gold text-dark border-gold shadow-lg'
                                : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                              }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* الكمية */}
            <div className="flex items-center gap-3">
              <span className="font-bold">الكمية:</span>

              <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-200 font-bold"
                >
                  -
                </button>

                <span className="px-5 py-2 font-bold">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-gray-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex flex-col gap-4 mt-3">
              <button
                onClick={() => addToCart(product, quantity, selectedOptions)}
                className="w-full bg-gold text-dark py-4 text-lg font-bold rounded-2xl hover:bg-yellow-400 transition shadow-md"
              >
                أضف إلى السلة
              </button>

              <button className="w-full bg-dark text-white py-4 text-lg font-bold rounded-2xl hover:bg-black transition shadow">
                اشترِ الآن
              </button>
            </div>

            {/* معلومات سريعة */}
            <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm space-y-1">
              <p>📦 التوصيل: 1 – 3 أيام عمل</p>
              <p>🔄 الاسترجاع: خلال 14 يوم</p>
            </div>
          </div>
        </div>

        {/* ===== الوصف ===== */}
        <div className="mt-14 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">وصف المنتج</h2>
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="prose prose-lg max-w-full"
          />
        </div>
      </div>
    </Layout>
  );
}
