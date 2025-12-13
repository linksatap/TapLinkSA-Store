import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

// إنشاء مجلد data إذا لم يكن موجوداً
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

export default async function handler(req, res) {
  
  // ✅ GET - جلب الإعدادات
  if (req.method === 'GET') {
    try {
      if (fs.existsSync(SETTINGS_FILE)) {
        const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
        const settings = JSON.parse(data);
        return res.status(200).json({ success: true, settings });
      } else {
        // إعدادات افتراضية
        const defaultSettings = {
          vatEnabled: true,
          vatRate: 15,
          freeShippingEnabled: true,
          freeShippingThreshold: 199,
          standardShippingCost: 25,
          expressShippingCost: 45,
          codEnabled: true,
          codFee: 10,
          currency: 'SAR',
          currencySymbol: 'ر.س'
        };
        return res.status(200).json({ success: true, settings: defaultSettings });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error reading settings' });
    }
  }

  // ✅ POST - حفظ الإعدادات
  if (req.method === 'POST') {
    try {
      const settings = req.body;
      
      // حفظ في ملف JSON
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      
      return res.status(200).json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error saving settings' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
