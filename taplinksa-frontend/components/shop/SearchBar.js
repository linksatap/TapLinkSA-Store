import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SearchBar({ searchTerm, onSearch, onClear }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mb-8"
    >
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              // Parent component handles state
              const event = new Event('input', { bubbles: true });
              event.target = e.target;
              onSearch(event);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="ابحث عن اشتراكات أو خدمات..."
            className={`w-full px-6 py-4 pr-16 rounded-xl border-2 transition-all duration-300 text-lg ${
              isFocused
                ? 'border-gold shadow-lg shadow-gold/30'
                : 'border-gray-200 shadow-md'
            } focus:outline-none bg-white`}
            aria-label="البحث عن المنتجات"
          />

          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-gold text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300 active:scale-95"
            aria-label="بحث"
          >
            🔍
          </button>

          {searchTerm && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="مسح البحث"
            >
              ✕
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
