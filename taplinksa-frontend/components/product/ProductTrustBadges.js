// components/product/ProductTrustBadges.js
export default function ProductTrustBadges() {
  const badges = [
    {
      icon: '🚚',
      title: 'شحن مجاني',
      description: '+199 ر.س',
      color: 'blue',
    },
    {
      icon: '⚡',
      title: 'تسليم فوري',
      description: 'رقمي',
      color: 'amber',
    },
    {
      icon: '↩️',
      title: 'إرجاع مجاني',
      description: '14 يوم',
      color: 'purple',
    },
    {
      icon: '🔒',
      title: 'دفع آمن',
      description: 'محمي 100%',
      color: 'green',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-50 to-white border-blue-100',
    amber: 'from-amber-50 to-white border-amber-100',
    purple: 'from-purple-50 to-white border-purple-100',
    green: 'from-green-50 to-white border-green-100',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 pt-6 border-t border-gray-200">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className={`text-center p-3 md:p-4 bg-gradient-to-br ${colorClasses[badge.color]} rounded-lg shadow-sm border hover:shadow-md transition-shadow`}
        >
          <div className="text-2xl md:text-3xl mb-2">{badge.icon}</div>
          <p className="text-xs md:text-sm font-bold text-dark">{badge.title}</p>
          <p className="text-xs text-gray-600 mt-0.5">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
