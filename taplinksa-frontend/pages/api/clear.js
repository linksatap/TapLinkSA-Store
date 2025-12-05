import { clearCache, deleteCachedPattern, getCacheStats } from '../../../lib/cache';

export default async function handler(req, res) {
  // فقط POST و DELETE
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key, pattern, action } = req.body;
    
    // يمكنك إضافة تحقق من الصلاحيات هنا
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.CACHE_CLEAR_SECRET}`) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    if (action === 'clear') {
      // مسح كل الـ Cache
      clearCache();
      return res.status(200).json({
        success: true,
        message: 'Cache cleared completely'
      });
    }

    if (action === 'pattern' && pattern) {
      // مسح حسب النمط
      const deleted = deleteCachedPattern(pattern);
      return res.status(200).json({
        success: true,
        message: `Deleted ${deleted} cache entries matching pattern: ${pattern}`
      });
    }

    if (action === 'stats') {
      // الحصول على الإحصائيات
      const stats = getCacheStats();
      return res.status(200).json({
        success: true,
        stats
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid action'
    });

  } catch (error) {
    console.error('Error in cache clear API:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to clear cache' 
    });
  }
}
