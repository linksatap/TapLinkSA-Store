export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
        {title}
      </h2>
      <div className="w-24 h-1 bg-gold mx-auto mb-6" data-aos="fade-up" data-aos-delay="100" />
      {subtitle && (
        <p className="text-lg text-gray-600" data-aos="fade-up" data-aos-delay="200">
          {subtitle}
        </p>
      )}
    </div>
  );
}
