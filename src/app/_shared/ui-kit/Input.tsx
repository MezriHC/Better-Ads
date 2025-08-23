interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error'
}

export function Input({ 
  variant = 'default', 
  className = '', 
  ...props 
}: InputProps) {
  const baseStyles = 'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors'
  
  const variantStyles = {
    default: 'border-input hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring',
    error: 'border-destructive focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive'
  }
  
  return (
    <input
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  )
}