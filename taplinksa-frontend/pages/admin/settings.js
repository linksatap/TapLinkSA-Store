import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Settings() {
  const [settings, setSettings] = useState({
    // إعدادات الضريبة
    vatEnabled: true,
    vatRate: 15,
    
    // إعدادات الشحن
    freeShippingEnabled: true,
    freeShippingThreshold: 199,
    standardShippingCost: 25,
    expressShippingCost: 45,
    
    // إعدادات COD
    codEnabled: true,
    codFee: 10,
    
    // إعدادات عامة
    currency: 'SAR',
    currencySymbol: 'ر.س'
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // جلب الإعدادات الحالية
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ تم حفظ الإعدادات بنجاح!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ حدث خطأ أثناء الحفظ');
      }
    } catch (error) {
      setMessage('❌ حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="الإعدادات">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">إعدادات المتجر</h1>

        {/* رسالة النجاح/الخطأ */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl ${
              message.includes('✅')
                ? 'bg-green-50 border-2 border-green-200 text-green-800'
                : 'bg-red-50 border-2 border-red-200 text-red-800'
            }`}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* إعدادات الضريبة */}
          <SettingsSection title="⚖️ إعدادات الضريبة">
            <ToggleSwitch
              label="تفعيل ضريبة القيمة المضافة"
              checked={settings.vatEnabled}
              onChange={(checked) => handleChange('vatEnabled', checked)}
            />
            
            {settings.vatEnabled && (
              <InputField
                label="نسبة الضريبة (%)"
                type="number"
                value={settings.vatRate}
                onChange={(e) => handleChange('vatRate', parseFloat(e.target.value))}
                min="0"
                max="100"
                step="0.1"
              />
            )}
          </SettingsSection>

          {/* إعدادات الشحن */}
          <SettingsSection title="🚚 إعدادات الشحن">
            <ToggleSwitch
              label="تفعيل الشحن المجاني"
              checked={settings.freeShippingEnabled}
              onChange={(checked) => handleChange('freeShippingEnabled', checked)}
            />
            
            {settings.freeShippingEnabled && (
              <InputField
                label="الحد الأدنى للشحن المجاني (ر.س)"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', parseFloat(e.target.value))}
                min="0"
              />
            )}

            <InputField
              label="تكلفة الشحن العادي (ر.س)"
              type="number"
              value={settings.standardShippingCost}
              onChange={(e) => handleChange('standardShippingCost', parseFloat(e.target.value))}
              min="0"
            />

            <InputField
              label="تكلفة الشحن السريع (ر.س)"
              type="number"
              value={settings.expressShippingCost}
              onChange={(e) => handleChange('expressShippingCost', parseFloat(e.target.value))}
              min="0"
            />
          </SettingsSection>

          {/* إعدادات الدفع عند الاستلام */}
          <SettingsSection title="💳 الدفع عند الاستلام (COD)">
            <ToggleSwitch
              label="تفعيل الدفع عند الاستلام"
              checked={settings.codEnabled}
              onChange={(checked) => handleChange('codEnabled', checked)}
            />
            
            {settings.codEnabled && (
              <InputField
                label="رسوم الدفع عند الاستلام (ر.س)"
                type="number"
                value={settings.codFee}
                onChange={(e) => handleChange('codFee', parseFloat(e.target.value))}
                min="0"
              />
            )}
          </SettingsSection>

          {/* زر الحفظ */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gold text-dark font-bold rounded-xl hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '⏳ جاري الحفظ...' : '💾 حفظ الإعدادات'}
            </button>

            <button
              type="button"
              onClick={fetchSettings}
              className="px-8 py-3 bg-gray-200 text-dark font-bold rounded-xl hover:bg-gray-300 transition-all"
            >
              🔄 إعادة تعيين
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

// Settings Section Component
function SettingsSection({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <label className="font-medium">{label}</label>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          checked ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// Input Field Component
function InputField({ label, type, value, onChange, min, max, step }) {
  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none"
      />
    </div>
  );
}
