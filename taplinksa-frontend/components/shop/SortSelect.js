import { motion } from 'framer-motion';

export default function SortSelect({ currentSortBy, onSortChange }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="flex items-center gap-3"
    >
      <label htmlFor="sort-select" className="font-medium text-gray-700 whitespace-nowrap">
        ترتيب حسب:
      </label>
      <select
        id="sort-select"
        value={currentSortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-gold focus:outline-none bg-white cursor-pointer font-medium transition-all duration-300 hover:border-gray-300 text-gray-900 appearance-none"
        aria-label="ترتيب المنتجات"
      >
        <option value="date">الأحدث أولاً</option>
        <option value="popularity">الأكثر مبيعاً</option>
        <option value="rating">الأعلى تقييماً</option>
        <option value="price">الأقل سعراً</option>
        <option value="price-desc">الأعلى سعراً</option>
      </select>
    </motion.div>
  );
}
