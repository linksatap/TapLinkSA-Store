// components/product/ProductDescription.js
export default function ProductDescription({ description }) {
  if (!description) return null;

  return (
    <section className="mb-8 pb-8 border-b border-gray-200">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-dark flex items-center gap-2">
        <span>📋</span> تفاصيل المنتج
      </h2>
      <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </section>
  );
}
