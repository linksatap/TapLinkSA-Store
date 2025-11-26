import SubscriptionCard from './SubscriptionCard';

export default function SubscriptionsGrid({ subscriptions, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-2xl h-96 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-8xl mb-6">📦</div>
        <h2 className="text-3xl font-bold text-dark mb-4">
          لا توجد اشتراكات متاحة حالياً
        </h2>
        <p className="text-xl text-gray-600">
          نعمل على إضافة المزيد من الاشتراكات قريباً!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
}
