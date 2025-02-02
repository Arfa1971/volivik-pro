interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
  }
  
  export function Input({ className = '', error, ...props }: InputProps) {
    const baseStyles = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const classes = `${baseStyles} ${error ? 'border-red-500' : ''} ${className}`;
  
    return (
      <div className="space-y-1">
        <input className={classes} {...props} />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }