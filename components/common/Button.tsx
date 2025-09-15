import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  // Fix: Add `size` and `as` props to support different button sizes and polymorphism.
  size?: 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', size, as: Component = 'button', ...props }) => {
  // Fix: Removed hardcoded padding to support dynamic sizing.
  const baseStyles = 'rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-200 flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 focus:ring-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
  };

  // Fix: Added styles for different button sizes.
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const sizeClass = size ? sizeStyles[size] : sizeStyles.md;

  // Fix: Use the `as` prop to render a dynamic component, defaulting to a button.
  return (
    <Component className={`${baseStyles} ${variantStyles[variant]} ${sizeClass} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Button;
