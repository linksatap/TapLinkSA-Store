// components/product/ProductReviews.js - Hydration Fixed

import { useState, useEffect } from 'react';

export default function ProductReviews({ productId, reviews: initialReviews = [] }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fetching, setFetching] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    rating: 5,
    review: '',
    reviewer: '',
    reviewer_email: '',
  });

  // التأكد من أننا على الـ client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch reviews on mount
  useEffect(() => {
    if (!isClient || !productId) return;
    fetchReviews();
  }, [productId, isClient]);

  const fetchReviews = async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
        console.log('✅ Reviews loaded:', data.length);
      } else {
        console.error('Failed to fetch reviews:', res.status);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Validate form
      if (!formData.reviewer.trim()) {
        throw new Error('الاسم مطلوب');
      }
      if (!formData.reviewer_email.trim()) {
        throw new Error('البريد الإلكتروني مطلوب');
      }
      if (!formData.review.trim() || formData.review.trim().length < 10) {
        throw new Error('التقييم يجب أن يكون 10 أحرف على الأقل');
      }

      console.log('📤 Sending review to API for product:', productId);

      const res = await fetch(`/api/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل إضافة التقييم');
      }

      console.log('✅ Review added successfully');

      // Refresh reviews list
      await fetchReviews();

      setFormData({
        rating: 5,
        review: '',
        reviewer: '',
        reviewer_email: '',
      });
      setShowForm(false);
      setMessage('✅ تم إضافة التقييم بنجاح! شكراً لك');

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding review:', error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0;

  // Don't render on server to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-12">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-dark">التقييمات والآراء</h2>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.includes('✅')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">{averageRating}</div>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(averageRating) ? 'text-2xl text-gold' : 'text-2xl text-gray-300'
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500">{reviews.length} تقييم</p>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{rating} ⭐</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col justify-center">
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
            className="btn-primary py-3 px-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {showForm ? 'إلغاء' : 'اكتب تقييماً'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-12 pb-12 border-b space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="reviewer"
              placeholder="اسمك الكامل"
              required
              value={formData.reviewer}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:border-gold focus:outline-none"
            />
            <input
              type="email"
              name="reviewer_email"
              placeholder="بريدك الإلكتروني"
              required
              value={formData.reviewer_email}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">التقييم</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating }))}
                  disabled={loading}
                  className={`text-3xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                    rating <= formData.rating ? 'text-gold' : 'text-gray-300 hover:text-gold/50'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            name="review"
            placeholder="رأيك في المنتج... (10 أحرف على الأقل)"
            required
            rows="5"
            value={formData.review}
            onChange={handleInputChange}
            disabled={loading}
            minLength="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:border-gold focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '⏳ جاري الإرسال...' : '✓ إرسال التقييم'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {fetching ? (
          <div className="text-center py-8 text-gray-500">
            <p>جاري تحميل التقييمات...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={review.id || idx} className="pb-6 border-b last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-dark">{review.reviewer}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < review.rating ? 'text-gold' : 'text-gray-300'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {review.date_created 
                    ? new Date(review.date_created).toLocaleDateString('ar-SA')
                    : 'اليوم'}
                </p>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap">{review.review}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>لا توجد تقييمات حالياً</p>
            <p className="text-sm">كن أول من يقيّم هذا المنتج</p>
          </div>
        )}
      </div>
    </div>
  );
}