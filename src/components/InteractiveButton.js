import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';

const InteractiveButton = ({ 
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  success = false,
  error = false,
  className = '',
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
    outline: 'border-2 border-green-500 text-green-500 hover:bg-green-50'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const getButtonState = () => {
    if (loading) return 'loading';
    if (success) return 'success';
    if (error) return 'error';
    return 'default';
  };

  const buttonState = getButtonState();

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-xl font-semibold transition-all duration-200
        ${variants[variant]} ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg active:shadow-sm'}
        ${buttonState === 'success' ? 'bg-green-500' : ''}
        ${buttonState === 'error' ? 'bg-red-500' : ''}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      {...props}
    >
      {/* Ripple effect */}
      {isPressed && !disabled && (
        <motion.div
          className="absolute inset-0 bg-white bg-opacity-20 rounded-xl"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Content */}
      <div className="flex items-center justify-center space-x-2">
        {buttonState === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
        {buttonState === 'success' && <Check className="w-4 h-4" />}
        {buttonState === 'error' && <X className="w-4 h-4" />}
        
        <span className={buttonState === 'loading' ? 'opacity-70' : ''}>
          {buttonState === 'success' ? 'Succès !' : 
           buttonState === 'error' ? 'Erreur' :
           children}
        </span>
      </div>
    </motion.button>
  );
};

export default InteractiveButton;