import { motion } from 'framer-motion';

const features = [
  {
    icon: '🚚',
    title: 'توصيل سريع',
    description: 'خلال 2-3 أيام عمل',
  },
  {
    icon: '🛡️',
    title: 'معاملات محمية',
    description: '100% آمنة وموثوقة',
  },
  {
    icon: '↩️',
    title: 'سياسة الإرجاع',
    description: 'خلال 14 يوم من الاستلام',
  },
  {
    icon: '💬',
    title: 'دعم العملاء',
    description: 'نحن هنا لمساعدتك دائماً',
  },
];

export default function ShopFeatures() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="mt-20 pt-12 border-t border-gray-200"
    >
      <h2 className="text-2xl font-bold text-center mb-12 text-gray-900">
        لماذا تختار متجرنا؟
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 text-center border border-blue-200 hover:shadow-xl transition-shadow"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
            <p className="text-gray-700 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
