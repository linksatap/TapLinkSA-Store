// components/product/ProductReviews.js - Updated with API Integration

import { useState } from 'react';

export default function ProductReviews({ productId, reviews: initialReviews = [], onReviewAdded }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    name: '',
    email: '',
  });

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
      // Send to API endpoint
      const res = await fetch('/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'خطأ في إضافة التقييم');
      }

      // Add new review to list
      const newReview = {
        ...formData,
        date: new Date().toLocaleDateString('ar-SA'),
      };
      
      setReviews(prev => [newReview, ...prev]);
      setFormData({ rating: 5, title: '', comment: '', name: '', email: '' });
      setShowForm(false);
      setMessage('✅ تم إضافة التقييم بنجاح!');
      
      if (onReviewAdded) {
        onReviewAdded(newReview);
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding review:', error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-12">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-dark">التقييمات والآراء</h2>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
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
                <span key={i} className={i < Math.round(averageRating) ? 'text-2xl text-gold' : 'text-2xl text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500">{reviews.length} تقييم</p>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = reviews.length > 0 ? (count / reviews.length * 100) : 0;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{rating} ⭐</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold"
                      style={{ width: `${percentage}%` }}
                    />
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
            className="btn-primary py-3 px-6 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
              name="name"
              placeholder="اسمك"
              required
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
              className="form-control disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <input
              type="email"
              name="email"
              placeholder="بريدك الإلكتروني"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className="form-control disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <input
            type="text"
            name="title"
            placeholder="عنوان التقييم"
            required
            value={formData.title}
            onChange={handleInputChange}
            disabled={loading}
            className="form-control disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <div>
            <label className="block text-sm font-bold mb-2">التقييم</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating }))}
                  disabled={loading}
                  className={`text-3xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    rating <= formData.rating ? 'text-gold' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            name="comment"
            placeholder="رأيك في المنتج..."
            required
            rows="5"
            value={formData.comment}
            onChange={handleInputChange}
            disabled={loading}
            className="form-control disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={idx} className="pb-6 border-b last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-dark">{review.name}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-gold' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <h4 className="font-bold mb-2">{review.title}</h4>
              <p className="text-gray-600">{review.comment}</p>
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