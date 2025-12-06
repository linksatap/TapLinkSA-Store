import { motion } from 'framer-motion';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  if (showEllipsisStart) {
    pages.push(1);
    pages.push('...');
  }

  for (
    let i = Math.max(1, currentPage - 1);
    i <= Math.min(totalPages, currentPage + 1);
    i++
  ) {
    if (!pages.includes(i)) pages.push(i);
  }

  if (showEllipsisEnd) {
    pages.push('...');
    pages.push(totalPages);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center gap-2 py-12"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-3 py-2 rounded-lg border-2 border-gray-200 text-slate-700 hover:border-teal-500 hover:text-teal-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        aria-label="الصفحة السابقة"
      >
        ←
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
              currentPage === page
                ? 'bg-teal-600 text-white shadow-md'
                : 'border-2 border-gray-200 text-slate-700 hover:border-teal-500'
            }`}
            aria-label={`الصفحة ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-3 py-2 rounded-lg border-2 border-gray-200 text-slate-700 hover:border-teal-500 hover:text-teal-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        aria-label="الصفحة التالية"
      >
        →
      </button>
    </motion.div>
  );
}
