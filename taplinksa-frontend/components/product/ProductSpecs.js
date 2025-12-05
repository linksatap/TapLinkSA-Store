// components/product/ProductSpecs.js
export default function ProductSpecs({ attributes = [] }) {
  const specs = attributes.filter((attr) => !attr.variation);

  if (!specs.length) return null;

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-dark flex items-center gap-2">
        <span>⚙️</span> المواصفات التقنية
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {specs.map((attr, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-100 hover:border-gold/30 transition-colors"
          >
            <span className="font-bold text-dark text-sm md:text-base">{attr.name}:</span>
            <span className="mr-2 text-gray-700 text-sm md:text-base">
              {Array.isArray(attr.options) ? attr.options.join(', ') : attr.options}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
