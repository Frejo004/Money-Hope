import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
      <div className="text-center">
        {/* Logo animé */}
        <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg animate-bounce">
          <span className="text-3xl font-bold text-green-600">MH</span>
        </div>
        
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
        
        {/* Texte */}
        <p className="text-white text-lg font-medium">Chargement...</p>
        <p className="text-green-100 text-sm mt-2">MoneyHope se prépare pour vous</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;