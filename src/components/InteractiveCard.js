import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';

const InteractiveCard = ({
  children,
  onClick,
  href,
  className = '',
  variant = 'default',
  hoverable = true,
  selectable = false,
  selected = false,
  badge,
  rating,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border-0',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200',
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200',
    warning: 'bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200',
    info: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'
  };

  const Component = href ? motion.a : motion.div;
  const componentProps = href ? { href } : {};

  return (
    <Component
      className={`
        relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer
        ${variants[variant]} ${className}
        ${selected ? 'ring-2 ring-green-500 ring-opacity-50' : ''}
        ${hoverable ? 'hover:shadow-xl' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      whileHover={hoverable ? { 
        y: -4,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={{ scale: 0.98 }}
      {...componentProps}
      {...props}
    >
      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0"
        animate={{ opacity: isHovered ? 0.05 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Press effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        />
      )}

      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {badge}
          </span>
        </div>
      )}

      {/* Rating */}
      {rating && (
        <div className="absolute top-3 left-3 z-10 flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-700">{rating}</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Arrow indicator */}
      {(onClick || href) && (
        <motion.div
          className="absolute bottom-4 right-4 text-gray-400"
          animate={{ 
            x: isHovered ? 4 : 0,
            opacity: isHovered ? 1 : 0.5
          }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      )}

      {/* Selection indicator */}
      {selectable && (
        <div className="absolute top-4 left-4">
          <div className={`
            w-5 h-5 rounded-full border-2 transition-all duration-200
            ${selected 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 hover:border-green-400'
            }
          `}>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-full h-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          x: isHovered ? ['0%', '100%'] : '0%',
          opacity: isHovered ? [0, 0.1, 0] : 0
        }}
        transition={{ duration: 0.6 }}
        style={{ transform: 'skewX(-20deg)' }}
      />
    </Component>
  );
};

export default InteractiveCard;