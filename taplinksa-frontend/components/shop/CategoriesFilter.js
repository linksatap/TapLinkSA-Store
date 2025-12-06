import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CategoriesFilter({
  categories,
  currentCategory,
  onCategoryChange,
  initialTotal,
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const displayCategories = showAllCategories ? categories : categories.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mb-8"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-900">التصنيفات</h3>

        {/* All Categories Button */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <button
            onClick={() => onCategoryChange()}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              !currentCategory
                ? 'bg-gold text-gray-900 shadow-lg shadow-gold/40 font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={!currentCategory}
            aria-label="جميع التصنيفات"
          >
            جميع التصنيفات
            <span className="text-sm mr-2 opacity-75">({initialTotal})</span>
          </button>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                currentCategory === cat.id.toString()
                  ? 'bg-gold text-gray-900 shadow-lg shadow-gold/40'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={currentCategory === cat.id.toString()}
              aria-label={`تصنيف ${cat.name}`}
            >
              {cat.name}
              <span className="text-xs opacity-75 ml-1">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Show More Button */}
        {categories.length > 4 && (
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="text-gold font-semibold text-sm hover:underline transition-all"
            aria-expanded={showAllCategories}
          >
            {showAllCategories ? 'عرض أقل ▲' : 'عرض المزيد ▼'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
