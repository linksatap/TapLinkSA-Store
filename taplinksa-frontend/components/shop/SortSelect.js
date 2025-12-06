import { motion } from 'framer-motion';

export default function SortSelect({ onSort, currentSort }) {
  const sortOptions = [
    { value: 'latest', label: 'الأحدث' },
    { value: 'popular', label: 'الأكثر مبيعاً' },
    { value: 'price_asc', label: 'السعر: من الأقل للأعلى' },
    { value: 'price_desc', label: 'السعر: من الأعلى للأقل' },
    { value: 'rating', label: 'الأعلى تقييماً' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full md:w-auto"
    >
      <select
        value={currentSort}
        onChange={(e) => onSort(e.target.value)}
        className="w-full md:w-auto py-3 px-4 rounded-lg border-2 border-gray-200 bg-white text-slate-900 font-medium focus:border-teal-500 focus:outline-none cursor-pointer hover:border-gray-300 transition-all duration-200"
        aria-label="ترتيب المنتجات"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
}
