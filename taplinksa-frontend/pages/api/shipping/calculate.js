import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { postcode, items = [], subtotal } = req.body;

    if (!postcode) {
      return res.status(400).json({
        success: false,
        error: 'الرمز البريدي مطلوب'
      });
    }

    // التحقق من المنتجات الرقمية
    const allDigital = items.length > 0 && items.every(item => 
      item.virtual === true || item.downloadable === true
    );

    if (allDigital) {
      return res.status(200).json({
        success: true,
        shipping: {
          cost: 0,
          name: 'منتجات رقمية',
          deliveryTime: 'فوري',
          postcode: postcode,
          freeShippingApplied: true,
          reason: 'المنتجات الرقمية لا تحتاج شحن'
        }
      });
    }

    // جلب مناطق الشحن من WooCommerce
    const zonesResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_WC_API_URL}/shipping/zones`,
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY,
          password: process.env.WC_CONSUMER_SECRET,
        },
      }
    );

    const zones = zonesResponse.data;
    let shippingInfo = null;

    // دالة للتحقق من تطابق الرمز البريدي
    const matchesPostcode = (code, pattern) => {
      // إزالة المسافات
      pattern = pattern.trim();
      
      // إذا كان النطاق (مثل: 51000...51999)
      if (pattern.includes('...')) {
        const [start, end] = pattern.split('...').map(s => parseInt(s.trim()));
        const postcodeNum = parseInt(code);
        return postcodeNum >= start && postcodeNum <= end;
      }
      
      // إذا كان نطاق بـ - (مثل: 51000-51999)
      if (pattern.includes('-') && !pattern.includes('*')) {
        const [start, end] = pattern.split('-').map(s => parseInt(s.trim()));
        const postcodeNum = parseInt(code);
        return postcodeNum >= start && postcodeNum <= end;
      }
      
      // إذا كان يحتوي على wildcard (مثل: 51*)
      if (pattern.includes('*')) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        return regex.test(code);
      }
      
      // تطابق مباشر
      return code === pattern;
    };

    // البحث في كل منطقة شحن
    for (const zone of zones) {
      try {
        // جلب المواقع (الرموز البريدية)
        const locationsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_WC_API_URL}/shipping/zones/${zone.id}/locations`,
          {
            auth: {
              username: process.env.WC_CONSUMER_KEY,
              password: process.env.WC_CONSUMER_SECRET,
            },
          }
        );

        const postcodeLocations = locationsResponse.data.filter(loc => loc.type === 'postcode');
        
        // التحقق من تطابق الرمز البريدي
        const matched = postcodeLocations.some(loc => matchesPostcode(postcode, loc.code));

        if (matched) {
          // جلب طرق الشحن
          const methodsResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_WC_API_URL}/shipping/zones/${zone.id}/methods`,
            {
              auth: {
                username: process.env.WC_CONSUMER_KEY,
                password: process.env.WC_CONSUMER_SECRET,
              },
            }
          );

          const enabledMethod = methodsResponse.data.find(m => m.enabled);
          
          if (enabledMethod) {
            const cost = parseFloat(enabledMethod.settings?.cost?.value || 0);
            
            shippingInfo = {
              zoneId: zone.id,
              zoneName: zone.name,
              cost: cost,
              name: enabledMethod.title || zone.name,
              deliveryTime: '2-3 أيام عمل',
              postcode: postcode,
              methodId: enabledMethod.method_id
            };
            break;
          }
        }
      } catch (error) {
        console.error(`Error checking zone ${zone.id}:`, error.message);
        continue;
      }
    }

    // إذا لم يُعثر على منطقة مطابقة
    if (!shippingInfo) {
      // جلب Zone الافتراضي (ID = 0)
      try {
        const defaultMethodsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_WC_API_URL}/shipping/zones/0/methods`,
          {
            auth: {
              username: process.env.WC_CONSUMER_KEY,
              password: process.env.WC_CONSUMER_SECRET,
            },
          }
        );

        const defaultMethod = defaultMethodsResponse.data.find(m => m.enabled);
        
        shippingInfo = {
          zoneId: 0,
          zoneName: 'المناطق الأخرى',
          cost: defaultMethod ? parseFloat(defaultMethod.settings?.cost?.value || 35) : 19,
          name: defaultMethod?.title || 'شحن افتراضي',
          deliveryTime: '3-5 أيام عمل',
          postcode: postcode,
          methodId: defaultMethod?.method_id || 'flat_rate'
        };
      } catch (error) {
        // Fallback
        shippingInfo = {
          zoneId: 0,
          zoneName: 'المناطق الأخرى',
          cost: 19,
          name: 'شحن افتراضي',
          deliveryTime: '3-5 أيام عمل',
          postcode: postcode
        };
      }
    }

    // شحن مجاني للطلبات فوق 500 ر.س
    const freeShippingThreshold = 500;
    if (subtotal >= freeShippingThreshold && shippingInfo.cost > 0) {
      shippingInfo.originalCost = shippingInfo.cost;
      shippingInfo.cost = 0;
      shippingInfo.freeShippingApplied = true;
      shippingInfo.reason = `شحن مجاني للطلبات فوق ${freeShippingThreshold} ر.س`;
    }

    res.status(200).json({
      success: true,
      shipping: shippingInfo
    });

  } catch (error) {
    console.error('Error calculating shipping:', error);
    res.status(500).json({ 
      error: 'Failed to calculate shipping',
      details: error.message 
    });
  }
}
