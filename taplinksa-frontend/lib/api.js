import axios from 'axios';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL;
const WC_API_URL = process.env.NEXT_PUBLIC_WC_API_URL;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

// WordPress Posts API
export async function getPosts(page = 1, perPage = 10) {
  try {
    const response = await axios.get(`${WP_API_URL}/posts`, {
      params: {
        page,
        per_page: perPage,
        _embed: true,
      },
    });
    return {
      posts: response.data,
      total: parseInt(response.headers['x-wp-total']),
      totalPages: parseInt(response.headers['x-wp-totalpages']),
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], total: 0, totalPages: 0 };
  }
}

export async function getPostBySlug(slug) {
  try {
    const response = await axios.get(`${WP_API_URL}/posts`, {
      params: {
        slug,
        _embed: true,
      },
    });
    return response.data[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// WooCommerce Products API
export async function getProducts(page = 1, perPage = 12) {
  try {
    const response = await axios.get(`${WC_API_URL}/products`, {
      params: {
        page,
        per_page: perPage,
        consumer_key: WC_CONSUMER_KEY,
        consumer_secret: WC_CONSUMER_SECRET,
      },
    });
    return {
      products: response.data,
      total: parseInt(response.headers['x-wp-total']),
      totalPages: parseInt(response.headers['x-wp-totalpages']),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0, totalPages: 0 };
  }
}

export async function getProductBySlug(slug) {
  try {
    const response = await axios.get(`${WC_API_URL}/products`, {
      params: {
        slug,
        consumer_key: WC_CONSUMER_KEY,
        consumer_secret: WC_CONSUMER_SECRET,
      },
    });
    return response.data[0] || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getFeaturedProducts() {
  try {
    const response = await axios.get(`${WC_API_URL}/products`, {
      params: {
        featured: true,
        per_page: 6,
        consumer_key: WC_CONSUMER_KEY,
        consumer_secret: WC_CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// ============================================
// ✅ NEW: Digital Subscriptions API
// ============================================

/**
 * جلب جميع الاشتراكات الرقمية
 */
export async function getSubscriptions(params = {}) {
  try {
    const response = await axios.get(`${WC_API_URL}/products`, {
      params: {
        category: 'digital-subscriptions',
        status: 'publish',
        per_page: params.perPage || 100,
        page: params.page || 1,
        orderby: params.orderby || 'menu_order',
        order: params.order || 'asc',
        consumer_key: WC_CONSUMER_KEY,
        consumer_secret: WC_CONSUMER_SECRET,
      },
    });

    return {
      subscriptions: response.data,
      total: parseInt(response.headers['x-wp-total'] || 0),
      totalPages: parseInt(response.headers['x-wp-totalpages'] || 0),
    };
  } catch (error) {
    console.error('Error fetching subscriptions:', error.response?.data || error.message);
    return { subscriptions: [], total: 0, totalPages: 0 };
  }
}

/**
 * جلب اشتراك واحد بواسطة ID
 */
export async function getSubscriptionById(id) {
  try {
    const response = await axios.get(`${WC_API_URL}/products/${id}`, {
      params: {
        consumer_key: WC_CONSUMER_KEY,
        consumer_secret: WC_CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription:', error.response?.data || error.message);
    return null;
  }
}

/**
 * جلب اشتراك واحد بواسطة Slug
 */
export async function getSubscriptionBySlug(slug) {
  try {
    const response = await axios.get(`${WC_API_URL}/products`, {
      params: {
        slug,
        category: 'digital-subscriptions',
        consumer_key: WC_CONSUMER_KEY,
        consumer_secret: WC_CONSUMER_SECRET,
      },
    });
    return response.data[0] || null;
  } catch (error) {
    console.error('Error fetching subscription by slug:', error.response?.data || error.message);
    return null;
  }
}

/**
 * جلب الاشتراكات المميزة
 */
export async function getFeaturedSubscriptions(limit = 3) {
  try {
    const response = await axios.get(`${WC_API_URL}/products`, {
      params: {
        category: 'digital-subscriptions',
        featured: true,
        status: 'publish',
        per_page: limit,
        consumer_key: WC_CONSUMER_KEY,
        consumer_secret: WC_CONSUMER_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured subscriptions:', error.response?.data || error.message);
    return [];
  }
}

/**
 * جلب الاشتراكات حسب الأداة (Tool Name)
 */
export async function getSubscriptionsByTool(toolName) {
  try {
    const { subscriptions } = await getSubscriptions({ perPage: 100 });
    
    return subscriptions.filter((sub) => {
      const tool = sub.meta_data?.find(
        (meta) => meta.key === '_subscription_tool_name'
      )?.value;
      
      return tool && tool.toLowerCase().includes(toolName.toLowerCase());
    });
  } catch (error) {
    console.error('Error fetching subscriptions by tool:', error);
    return [];
  }
}

/**
 * جلب الاشتراكات حسب المدة
 */
export async function getSubscriptionsByDuration(duration, unit = 'months') {
  try {
    const { subscriptions } = await getSubscriptions({ perPage: 100 });
    
    return subscriptions.filter((sub) => {
      const subDuration = sub.meta_data?.find(
        (meta) => meta.key === '_subscription_duration'
      )?.value;
      
      const subUnit = sub.meta_data?.find(
        (meta) => meta.key === '_subscription_duration_unit'
      )?.value || 'months';
      
      return subDuration === String(duration) && subUnit === unit;
    });
  } catch (error) {
    console.error('Error fetching subscriptions by duration:', error);
    return [];
  }
}

/**
 * استخراج بيانات الاشتراك من meta_data
 */
export function getSubscriptionMeta(subscription) {
  if (!subscription || !subscription.meta_data) {
    return null;
  }

  const findMeta = (key) => {
    const meta = subscription.meta_data.find((m) => m.key === key);
    return meta ? meta.value : null;
  };

  return {
    toolName: findMeta('_subscription_tool_name') || subscription.name,
    duration: findMeta('_subscription_duration'),
    durationUnit: findMeta('_subscription_duration_unit') || 'months',
    activationType: findMeta('_subscription_activation_type'),
    deliveryNotes: findMeta('_subscription_delivery_notes'),
    costPrice: findMeta('_subscription_cost_price'),
  };
}

/**
 * تنسيق نص المدة بالعربية
 */
export function formatDuration(duration, unit) {
  if (!duration) return '';

  const units = {
    days: duration === '1' ? 'يوم' : 'أيام',
    weeks: duration === '1' ? 'أسبوع' : 'أسابيع',
    months: duration === '1' ? 'شهر' : 'أشهر',
    years: duration === '1' ? 'سنة' : 'سنوات',
  };

  return `${duration} ${units[unit] || 'شهر'}`;
}
