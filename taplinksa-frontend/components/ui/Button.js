import Link from 'next/link';

export default function Button({ 
  children, 
  href, 
  onClick, 
  variant = 'primary',
  className = '',
  target,
  ...props 
}) {
  const baseClasses = 'inline-block px-6 py-3 rounded-lg font-bold transition-all duration-300 text-center';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} target={target} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}
