import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import CategoriesFilter from './CategoriesFilter';
import SortSelect from './SortSelect';

export default function ShopFiltersBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearch,
  sortBy,
  onSort,
  totalProducts,
}) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <>
      {/* Desktop Layout - Always Visible */}
      <div className="hidden sm:flex flex-col gap-4 sticky top-0 z-20 bg-white border-b border-gray-200 p-4 md:p-6 rounded-b-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-900">
            المنتجات ({totalProducts})
          </h2>
        </div>

        <SearchBar onSearch={onSearch} />

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <CategoriesFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
            />
          </div>
          <SortSelect onSort={onSort} currentSort={sortBy} />
        </div>
      </div>

      {/* Mobile Layout - Collapsible */}
      <div className="sm:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              المنتجات ({totalProducts})
            </h2>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                showMobileFilters
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-gray-100 text-slate-700'
              }`}
              aria-label="فتح الفلاتر"
            >
              ⚙️ الفلاتر
            </button>
          </div>

          <SearchBar onSearch={onSearch} />

          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 pt-3 border-t border-gray-200"
              >
                <CategoriesFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={onSelectCategory}
                />
                <SortSelect onSort={onSort} currentSort={sortBy} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
