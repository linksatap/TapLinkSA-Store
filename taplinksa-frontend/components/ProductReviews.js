import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useUser();

  const [formData, setFormData] = useState({
    rating: 5,
    review: '',
    reviewer: '',
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('يجب تسجيل الدخول لإضافة تقييم');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          reviewer: formData.reviewer || user.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل إضافة التقييم');
      }

      setSuccess('✅ تم إضافة تقييمك بنجاح! سيظهر بعد المراجعة.');
      setFormData({ rating: 5, review: '', reviewer: '' });
      setShowForm(false);
      
      // تحديث التقييمات
      setTimeout(() => {
        fetchReviews();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, size = 'text-xl') => {
    return (
      <div className={`flex gap-1 ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-dark mb-2">التقييمات والمراجعات</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-2xl font-bold text-dark">{averageRating}</span>
            </div>
            <span className="text-gray-600">({reviews.length} تقييم)</span>
          </div>
        </div>

        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gold text-dark font-bold rounded-xl hover:bg-yellow-500 transition-all"
          >
            {showForm ? '❌ إلغاء' : '⭐ أضف تقييمك'}
          </button>
        )}
      </div>

      {/* Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-600"
        >
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Add Review Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-gray-50 rounded-xl"
        >
          <h3 className="text-xl font-bold mb-4">أضف تقييمك</h3>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">التقييم *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="text-4xl transition-all hover:scale-110"
                >
                  <span className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reviewer Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">الاسم (اختياري)</label>
            <input
              type="text"
              value={formData.reviewer}
              onChange={(e) => setFormData({ ...formData, reviewer: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none"
              placeholder={user.name || 'اسمك'}
            />
          </div>

          {/* Review */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">المراجعة * (10 أحرف على الأقل)</label>
            <textarea
              required
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none resize-none"
              placeholder="شاركنا رأيك في المنتج..."
              minLength={10}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gold text-dark font-bold rounded-xl hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '⏳ جاري الإرسال...' : '✅ إرسال التقييم'}
          </button>
        </motion.form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2 animate-bounce">⏳</div>
          <p className="text-gray-600">جاري تحميل التقييمات...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gray-50 rounded-xl"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-dark">{review.reviewer}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(review.date_created).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                {renderStars(review.rating, 'text-lg')}
              </div>
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: review.review }}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-xl text-gray-600">لا توجد تقييمات بعد</p>
          <p className="text-gray-500">كن أول من يقيّم هذا المنتج!</p>
        </div>
      )}
    </div>
  );
}
