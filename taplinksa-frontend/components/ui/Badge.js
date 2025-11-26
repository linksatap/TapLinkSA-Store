export default function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-gold text-dark',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    sale: 'bg-red-600 text-white',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
