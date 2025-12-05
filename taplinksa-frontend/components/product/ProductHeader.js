// components/product/ProductHeader.js
export default function ProductHeader({ product }) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark mb-2 leading-tight">
        {product.name}
      </h1>

      {/* SKU & Rating */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-3">
        {product.sku && (
          <span className="flex items-center gap-1">
            <span className="font-medium">كود المنتج:</span>
            <code className="font-mono bg-gray-100 px-2 py-1 rounded">{product.sku}</code>
          </span>
        )}

        {product.average_rating && parseFloat(product.average_rating) > 0 && (
          <div className="flex items-center gap-1 pl-2 md:pl-4 border-l border-gray-300">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm">
                  {i < Math.round(parseFloat(product.average_rating)) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.rating_count || 0})</span>
          </div>
        )}
      </div>
    </div>
  );
}
