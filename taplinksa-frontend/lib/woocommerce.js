// lib/woocommerce.js

export async function fetchProductWithVariations(slug, headers) {
  const WC_API_URL = process.env.NEXT_PUBLIC_WC_API_URL || 'https://your-woocommerce-site.com/wp-json/wc/v3';

  try {
    // 1. Fetch main product
    const productRes = await fetch(`${WC_API_URL}/products?slug=${encodeURIComponent(slug)}`, { headers });
    const products = await productRes.json();

    const product = Array.isArray(products) && products.length > 0 ? products[0] : null;

    if (!product) {
      return { product: null, variations: [] };
    }

    // 2. If product has variations, fetch them
    let variations = [];
    if (product.type === 'variable') {
      try {
        const variationsRes = await fetch(
          `${WC_API_URL}/products/${product.id}/variations?per_page=100`,
          { headers }
        );
        variations = await variationsRes.json();
        variations = Array.isArray(variations) ? variations : [];
      } catch (err) {
        console.error('Error fetching variations:', err);
      }
    }

    return { product, variations };
  } catch (error) {
    console.error('Error fetching product with variations:', error);
    return { product: null, variations: [] };
  }
}

export async function fetchRelatedProducts(productId, headers) {
  const WC_API_URL = process.env.NEXT_PUBLIC_WC_API_URL;

  try {
    const res = await fetch(
      `${WC_API_URL}/products?per_page=8&orderby=popularity`,
      { headers }
    );
    let products = await res.json();
    products = Array.isArray(products) ? products : [];
    return products.filter(p => p.id !== productId).slice(0, 4);
  } catch (err) {
    console.error('Error fetching related products:', err);
    return [];
  }
}
