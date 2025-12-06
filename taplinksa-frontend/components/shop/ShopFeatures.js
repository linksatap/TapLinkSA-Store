import { motion } from 'framer-motion';

export default function ShopFeatures() {
  const features = [
    {
      icon: '🚚',
      title: 'توصيل سريع',
      description: 'خلال 2-3 أيام عمل',
    },
    {
      icon: '🔒',
      title: 'معاملات محمية',
      description: '100% آمن ومضمون',
    },
    {
      icon: '↩️',
      title: 'استرجاع بسيط',
      description: 'خلال 14 يوم من الاستلام',
    },
    {
      icon: '💬',
      title: 'دعم العملاء',
      description: 'نحن هنا لمساعدتك دائماً',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-16"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
        >
          <div className="text-4xl mb-3">{feature.icon}</div>
          <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
