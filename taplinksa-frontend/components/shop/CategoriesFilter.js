import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CategoriesFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="relative">
        {/* Desktop - Static Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <button
            onClick={() => onSelectCategory(null)}
            className={`py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
            }`}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectedCategory(category.slug)}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category.slug
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Mobile - Horizontal Scroll */}
        <div className="sm:hidden flex items-center gap-2">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="flex-shrink-0 p-2 rounded-lg bg-gray-100 text-slate-700 hover:bg-gray-200"
              aria-label="تمرير يسارا"
            >
              ←
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            onLoad={checkScroll}
            className="flex-1 flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
          >
            <button
              onClick={() => onSelectCategory(null)}
              className={`flex-shrink-0 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 snap-start ${
                selectedCategory === null
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-slate-700'
              }`}
            >
              الكل
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.slug)}
                className={`flex-shrink-0 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap snap-start ${
                  selectedCategory === category.slug
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-gray-100 text-slate-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="flex-shrink-0 p-2 rounded-lg bg-gray-100 text-slate-700 hover:bg-gray-200"
              aria-label="تمرير يمينا"
            >
              →
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
}
