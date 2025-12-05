
// Cache لمدة 5 دقائق افتراضياً
const cache = new NodeCache({ 
  stdTTL: 300, // 5 دقائق
  checkperiod: 60, // تحقق كل دقيقة
  useClones: false, // أداء أفضل
  deleteOnExpire: true,
  maxKeys: 1000 // حد أقصى 1000 مفتاح
});

// دالة للحصول على البيانات من الـ Cache
export const getCachedData = (key) => {
  try {
    const data = cache.get(key);
    if (data) {
      console.log(`📦 Cache HIT: ${key}`);
      return data;
    }
    console.log(`❌ Cache MISS: ${key}`);
    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

// دالة لحفظ البيانات في الـ Cache
export const setCachedData = (key, data, ttl = 300) => {
  try {
    const success = cache.set(key, data, ttl);
    if (success) {
      console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
    }
    return success;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

// دالة لحذف مفتاح معين من الـ Cache
export const deleteCachedData = (key) => {
  try {
    const deleted = cache.del(key);
    if (deleted > 0) {
      console.log(`🗑️ Cache DELETE: ${key}`);
    }
    return deleted;
  } catch (error) {
    console.error('Cache delete error:', error);
    return 0;
  }
};

// دالة لحذف جميع المفاتيح التي تبدأ بنمط معين
export const deleteCachedPattern = (pattern) => {
  try {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    const deleted = cache.del(matchingKeys);
    console.log(`🗑️ Cache DELETE Pattern: ${pattern} (${deleted} keys)`);
    return deleted;
  } catch (error) {
    console.error('Cache delete pattern error:', error);
    return 0;
  }
};

// دالة لمسح الـ Cache بالكامل
export const clearCache = () => {
  try {
    cache.flushAll();
    console.log('🗑️ Cache CLEARED completely');
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

// دالة للحصول على إحصائيات الـ Cache
export const getCacheStats = () => {
  try {
    const stats = cache.getStats();
    return {
      keys: stats.keys,
      hits: stats.hits,
      misses: stats.misses,
      ksize: stats.ksize,
      vsize: stats.vsize
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return null;
  }
};

export default cache;
