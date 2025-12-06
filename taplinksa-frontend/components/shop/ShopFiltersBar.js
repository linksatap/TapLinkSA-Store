import { motion } from 'framer-motion';
import SortSelect from './SortSelect';

export default function ShopFiltersBar({
  products,
  initialTotal,
  currentSortBy,
  onSortChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Results Counter */}
        <div className="text-gray-700">
          <p>
            عرض{' '}
            <span className="font-bold text-gold text-lg">{products.length}</span>
            {' '}من أصل{' '}
            <span className="font-bold text-lg">{initialTotal}</span>
            {' '}منتج
          </p>
        </div>

        {/* Sort Selector */}
        <SortSelect currentSortBy={currentSortBy} onSortChange={onSortChange} />
      </div>
    </motion.div>
  );
}
