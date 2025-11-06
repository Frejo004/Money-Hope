import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ValidatedInput = ({
  label,
  type = 'text',
  value,
  onChange,
  validation,
  placeholder,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationState, setValidationState] = useState({ isValid: null, message: '' });

  useEffect(() => {
    if (value && validation) {
      const result = validation(value);
      setValidationState(result);
    } else {
      setValidationState({ isValid: null, message: '' });
    }
  }, [value, validation]);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const getBorderColor = () => {
    if (validationState.isValid === true) return 'border-green-500 ring-green-200';
    if (validationState.isValid === false) return 'border-red-500 ring-red-200';
    if (focused) return 'border-blue-500 ring-blue-200';
    return 'border-gray-300';
  };

  const getIcon = () => {
    if (validationState.isValid === true) return <Check className="w-5 h-5 text-green-500" />;
    if (validationState.isValid === false) return <X className="w-5 h-5 text-red-500" />;
    return null;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <motion.input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${getBorderColor()}
            ${type === 'password' ? 'pr-20' : validationState.isValid !== null ? 'pr-12' : ''}
          `}
          animate={{
            scale: focused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {/* Validation Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          {getIcon()}
        </div>

        {/* Focus indicator */}
        <AnimatePresence>
          {focused && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-blue-400 pointer-events-none"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Validation Message */}
      <AnimatePresence>
        {validationState.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center space-x-2 text-sm ${
              validationState.isValid ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {validationState.isValid ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{validationState.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Validation helpers
export const validations = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return { isValid: null, message: '' };
    if (emailRegex.test(value)) {
      return { isValid: true, message: 'Email valide' };
    }
    return { isValid: false, message: 'Format email invalide' };
  },

  password: (value) => {
    if (!value) return { isValid: null, message: '' };
    if (value.length < 6) {
      return { isValid: false, message: 'Minimum 6 caractères' };
    }
    if (value.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return { isValid: true, message: 'Mot de passe fort' };
    }
    if (value.length >= 6) {
      return { isValid: true, message: 'Mot de passe acceptable' };
    }
  },

  phone: (value) => {
    if (!value) return { isValid: null, message: '' };
    const phoneRegex = /^(\+?[0-9]{8,15})$/;
    if (phoneRegex.test(value)) {
      return { isValid: true, message: 'Numéro valide' };
    }
    return { isValid: false, message: 'Format invalide (8-15 chiffres)' };
  },

  amount: (value, min = 0, max = Infinity) => {
    if (!value) return { isValid: null, message: '' };
    const num = parseFloat(value);
    if (isNaN(num)) {
      return { isValid: false, message: 'Montant invalide' };
    }
    if (num < min) {
      return { isValid: false, message: `Minimum ${min} F` };
    }
    if (num > max) {
      return { isValid: false, message: `Maximum ${max} F` };
    }
    return { isValid: true, message: 'Montant valide' };
  }
};

export default ValidatedInput;