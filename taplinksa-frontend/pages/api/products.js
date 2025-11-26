import { getProducts } from '../../lib/api';

export default async function handler(req, res) {
  try {
    const { per_page = 6, page = 1 } = req.query;
    
    console.log('🔄 API Route called');
    
    const data = await getProducts(parseInt(page), parseInt(per_page));
    
    console.log('✅ Products:', data.products?.length || 0);
    
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ API Error:', error.message);
    res.status(500).json({ 
      products: [], 
      total: 0, 
      totalPages: 0,
      error: error.message 
    });
  }
}
