import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch, placeholder = 'ابحث عن منتجات...' }) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className={`relative flex items-center bg-white rounded-lg border-2 transition-all duration-300 ${
        isFocused ? 'border-teal-500 shadow-lg' : 'border-gray-200'
      }`}>
        <span className="px-4 text-gray-400">🔍</span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 px-2 py-3 md:py-4 outline-none text-slate-900 placeholder-gray-400 text-sm md:text-base"
          aria-label="البحث عن منتجات"
        />
        {value && (
          <button
            onClick={handleClear}
            className="px-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="مسح البحث"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
}
