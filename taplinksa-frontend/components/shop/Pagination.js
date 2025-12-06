import { motion } from 'framer-motion';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all font-medium"
          aria-label="الصفحة 1"
        >
          1
        </button>
      );

      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === i
              ? 'bg-gold text-gray-900 border-gold border shadow-lg shadow-gold/40'
              : 'border border-gray-300 hover:bg-gray-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-current={currentPage === i ? 'page' : undefined}
          aria-label={`الصفحة ${i}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all font-medium"
          aria-label={`الصفحة ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 mb-8"
    >
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          aria-label="الصفحة السابقة"
        >
          ← السابق
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">{renderPageNumbers()}</div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          aria-label="الصفحة التالية"
        >
          التالي →
        </button>
      </div>

      {/* Page Info */}
      <p className="text-center mt-6 text-gray-600 text-sm">
        الصفحة <span className="font-bold">{currentPage}</span> من{' '}
        <span className="font-bold">{totalPages}</span>
      </p>
    </motion.div>
  );
}
