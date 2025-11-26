import { motion } from 'framer-motion';

export default function TrustedBy() {
  const clients = [
    '🏢 شركة 1',
    '🏪 متجر 2',
    '🏬 مؤسسة 3',
    '🏭 شركة 4',
    '🏢 مكتب 5',
    '🏪 محل 6',
  ];

  return (
    <section className="py-12 bg-white border-y">
      <div className="container-custom">
        <p className="text-center text-gray-600 mb-8 font-medium">
          يثق بنا أكثر من 500+ عميل في جميع أنحاء المملكة
        </p>

        <div className="overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex gap-12 items-center"
          >
            {[...clients, ...clients, ...clients].map((client, index) => (
              <div
                key={index}
                className="text-4xl opacity-60 hover:opacity-100 hover:text-gold transition-all cursor-pointer flex-shrink-0"
              >
                {client}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
