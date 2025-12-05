import { useState, useCallback, useRef } from 'react';

/**
 * Custom Hook لإدارة نموذج الدفع والتحقق من الحقول
 */
export function useCheckoutForm(initialData = {}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    postcode: '',
    address: '',
    notes: '',
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const validationTimers = useRef({});

  /**
   * قواعد التحقق لكل حقل
   */
  const validationRules = {
    name: (value) => {
      if (!value.trim()) return 'الاسم الكامل مطلوب';
      if (value.trim().length < 3) return 'الاسم يجب أن يكون 3 أحرف على الأقل';
      if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(value)) return 'الاسم يجب أن يحتوي على حروف فقط';
      return null;
    },
    
    email: (value) => {
      if (!value.trim()) return 'البريد الإلكتروني مطلوب';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'البريد الإلكتروني غير صحيح';
      return null;
    },
    
    phone: (value) => {
      if (!value.trim()) return 'رقم الهاتف مطلوب';
      const cleanPhone = value.replace(/\s/g, '');
      if (!/^(05|5)[0-9]{8}$/.test(cleanPhone)) {
        return 'رقم الهاتف غير صحيح (مثال: 0512345678)';
      }
      return null;
    },
    
    state: (value) => {
      if (!value.trim()) return 'المنطقة مطلوبة';
      return null;
    },
    
    city: (value) => {
      if (!value.trim()) return 'المدينة مطلوبة';
      return null;
    },
    
    postcode: (value) => {
      if (!value.trim()) return 'الرمز البريدي مطلوب';
      if (!/^\d{5}$/.test(value)) return 'الرمز البريدي يجب أن يكون 5 أرقام';
      return null;
    },
    
    address: (value) => {
      if (!value.trim()) return 'العنوان الكامل مطلوب';
      if (value.trim().length < 10) return 'يرجى إدخال عنوان مفصل (10 أحرف على الأقل)';
      return null;
    },
  };

  /**
   * التحقق من حقل واحد
   */
  const validateField = useCallback((name, value) => {
    if (!validationRules[name]) return null;
    
    const error = validationRules[name](value);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
    
    return error;
  }, []);

  /**
   * التحقق من جميع الحقول المطلوبة
   */
  const validateAllFields = useCallback(() => {
    const requiredFields = ['name', 'email', 'phone', 'state', 'city', 'postcode', 'address'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      const error = validationRules[field]?.(formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    
    // تعيين جميع الحقول كـ touched
    const allTouched = {};
    requiredFields.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * معالج تغيير الحقول مع التحقق المتأخر
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // التحقق المتأخر (debounced validation)
    if (validationTimers.current[name]) {
      clearTimeout(validationTimers.current[name]);
    }
    
    // التحقق فوراً إذا كان الحقل touched
    if (touched[name]) {
      validationTimers.current[name] = setTimeout(() => {
        validateField(name, value);
      }, 300);
    }
  }, [touched, validateField]);

  /**
   * معالج blur للحقول
   */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
    
    validateField(name, value);
  }, [validateField]);

  /**
   * تحديث بيانات النموذج من مصدر خارجي (مثل بيانات المستخدم)
   */
  const updateFormData = useCallback((data) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  /**
   * إعادة تعيين النموذج
   */
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      state: '',
      city: '',
      postcode: '',
      address: '',
      notes: '',
    });
    setErrors({});
    setTouched({});
  }, []);

  /**
   * التحقق من صحة النموذج بالكامل
   */
  const isValid = Object.keys(errors).length === 0;
  
  /**
   * التحقق من أن جميع الحقول المطلوبة مملوءة
   */
  const isComplete = ['name', 'email', 'phone', 'state', 'city', 'postcode', 'address']
    .every(field => formData[field]?.trim());

  return {
    formData,
    errors,
    touched,
    isValid,
    isComplete,
    handleChange,
    handleBlur,
    validateField,
    validateAllFields,
    updateFormData,
    resetForm,
  };
}
