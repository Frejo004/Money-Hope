import React from 'react';
import { motion } from 'framer-motion';
import InteractiveCard from './InteractiveCard';

const ProviderSelector = ({ 
  providers, 
  selected, 
  onSelect, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {providers.map((provider, index) => (
        <motion.div
          key={provider.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <InteractiveCard
            selectable
            selected={selected === provider.id}
            onClick={() => onSelect(provider.id)}
            className="p-4 h-full"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              {/* Provider Icon/Logo */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg
                ${provider.id === 'orange' ? 'bg-orange-500' : ''}
                ${provider.id === 'mtn' ? 'bg-yellow-500' : ''}
                ${provider.id === 'wave' ? 'bg-blue-500' : ''}
                ${provider.id === 'moov' ? 'bg-green-500' : ''}
              `}>
                {provider.name.charAt(0)}
              </div>
              
              {/* Provider Name */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {provider.name}
                </h3>
                {provider.fees && (
                  <p className="text-xs text-gray-500 mt-1">
                    Frais: {provider.fees}
                  </p>
                )}
              </div>

              {/* Status indicator */}
              <div className="flex items-center space-x-1">
                <div className={`
                  w-2 h-2 rounded-full
                  ${provider.available ? 'bg-green-500' : 'bg-red-500'}
                `} />
                <span className={`
                  text-xs font-medium
                  ${provider.available ? 'text-green-600' : 'text-red-600'}
                `}>
                  {provider.available ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
            </div>
          </InteractiveCard>
        </motion.div>
      ))}
    </div>
  );
};

export default ProviderSelector;