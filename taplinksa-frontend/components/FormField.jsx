import React from 'react';

/**
 * مكون حقل إدخال محسّن مع دعم كامل لإمكانية الوصول والتحقق
 */
export default function FormField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  autoComplete,
  inputMode,
  pattern,
  maxLength,
  rows,
  className = '',
  ...props
}) {
  const hasError = touched && error;
  const inputId = id || name;
  const errorId = `${inputId}-error`;
  const descriptionId = `${inputId}-description`;

  const baseInputClasses = `
    w-full px-4 py-3 rounded-lg border-2 transition-all outline-none
    text-base
    ${hasError 
      ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
      : 'border-gray-300 bg-white focus:border-gold focus:ring-2 focus:ring-gold/20'
    }
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${className}
  `;

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="w-full">
      <label 
        htmlFor={inputId} 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 mr-1" aria-label="مطلوب">*</span>}
      </label>
      
      <InputComponent
        id={inputId}
        name={name}
        type={type !== 'textarea' ? type : undefined}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        maxLength={maxLength}
        rows={type === 'textarea' ? rows : undefined}
        required={required}
        aria-required={required}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? errorId : undefined}
        className={baseInputClasses}
        {...props}
      />
      
      {hasError && (
        <p 
          id={errorId}
          className="mt-2 text-sm text-red-600 flex items-start gap-1.5"
          role="alert"
          aria-live="polite"
        >
          <svg 
            className="w-4 h-4 flex-shrink-0 mt-0.5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
