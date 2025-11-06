import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingButton = ({ 
  loading = false, 
  children, 
  className = "", 
  disabled = false,
  loadingText = "Chargement...",
  ...props 
}) => {
  return (
    <button
      className={`relative transition-all duration-200 ${
        loading || disabled 
          ? 'opacity-70 cursor-not-allowed' 
          : 'hover:scale-105 active:scale-95'
      } ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
};

export default LoadingButton;