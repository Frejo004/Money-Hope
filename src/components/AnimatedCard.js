import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = "", 
  hover = true,
  tap = true,
  delay = 0,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={hover ? { 
        y: -4, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      } : {}}
      whileTap={tap ? { scale: 0.98 } : {}}
      className={`bg-white rounded-xl shadow-sm transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;