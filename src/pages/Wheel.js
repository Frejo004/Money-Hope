import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, RotateCcw, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Wheel = () => {
  const { user, updateUser } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastPrize, setLastPrize] = useState(null);

  const wheelPrizes = [
    { amount: 0, color: '#ff4757', label: '0 F' },
    { amount: 200, color: '#ffa502', label: '200 F' },
    { amount: 0, color: '#ff4757', label: '0 F' },
    { amount: 200, color: '#ffa502', label: '200 F' },
    { amount: 0, color: '#ff4757', label: '0 F' },
    { amount: 200, color: '#ffa502', label: '200 F' },
    { amount: 1000, color: '#2ed573', label: '1000 F' },
    { amount: 200, color: '#ffa502', label: '200 F' }
  ];

  const spinWheel = async () => {
    if (isSpinning || user.balance < 200) return;

    setIsSpinning(true);
    setLastPrize(null);
    
    try {
      // Le backend décide du gain et le retourne
      const response = await axios.post('/wheel/spin');
      const { prize, newBalance, prizeIndex } = response.data.result; // Supposons que l'API retourne l'index du gain
      
      // Déterminer la rotation pour pointer vers le bon segment
      const segmentAngle = 360 / wheelPrizes.length;
      const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8; // Pour ne pas tomber pile sur la ligne
      const prizeAngle = (prizeIndex * segmentAngle) + randomOffset;

      // Animation de rotation
      const spins = 5; // Nombre de tours complets
      const finalRotation = rotation + (spins * 360) - (rotation % 360) + prizeAngle + 360; // +360 pour assurer une rotation positive
      setRotation(finalRotation);
      
      // Attendre la fin de l'animation
      setTimeout(() => {
        setLastPrize(prize);
        updateUser({ ...user, balance: newBalance });
        
        if (prize > 0) {
          toast.success(`🎉 Félicitations ! Vous avez gagné ${prize} F !`);
        } else {
          toast.error('Dommage ! Tentez votre chance à nouveau !');
        }
        
        setIsSpinning(false);
      }, 3000);
      
    } catch (error) {
      setIsSpinning(false);
      toast.error(error.response?.data?.message || 'Erreur lors du tour');
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎡 Roue de la Fortune</h1>
        <p className="text-gray-600">Tentez votre chance pour gagner jusqu'à 1000 F !</p>
      </div>

      {/* Solde */}
      <div className="card text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Coins className="w-6 h-6 text-yellow-500" />
          <span className="text-2xl font-bold text-gray-800">{user?.balance || 0} F</span>
        </div>
        <p className="text-sm text-gray-600">Prix d'un tour : 200 F</p>
      </div>

      {/* Roue */}
      <div className="card">
        <div className="relative mx-auto w-80 h-80">
          {/* Indicateur */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
          </div>
          
          {/* Roue */}
          <motion.div
            className="w-full h-full rounded-full border-8 border-gray-300 relative overflow-hidden"
            style={{
              background: `conic-gradient(${wheelPrizes.map((prize, index) => 
                `${prize.color} ${index * 45}deg ${(index + 1) * 45}deg`
              ).join(', ')})`
            }}
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            {/* Segments de texte */}
            {wheelPrizes.map((prize, index) => (
              <div
                key={index}
                className="absolute w-full h-full flex items-center justify-center text-white font-bold"
                style={{
                  transform: `rotate(${index * 45 + 22.5}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <span 
                  className="text-lg"
                  style={{ transform: 'translateY(-120px)' }}
                >
                  {prize.label}
                </span>
              </div>
            ))}
          </motion.div>
          
          {/* Centre de la roue */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center">
            <RotateCcw className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Bouton de jeu */}
      <div className="text-center">
        <button
          onClick={spinWheel}
          disabled={isSpinning || user?.balance < 200}
          className={`btn-primary w-full max-w-xs ${
            isSpinning || user?.balance < 200 
              ? 'opacity-50 cursor-not-allowed' 
              : 'pulse-glow'
          }`}
        >
          {isSpinning ? (
            <span className="flex items-center justify-center space-x-2">
              <RotateCcw className="w-5 h-5 animate-spin" />
              <span>Rotation...</span>
            </span>
          ) : user?.balance < 200 ? (
            'Solde insuffisant'
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Jouer (200 F)</span>
            </span>
          )}
        </button>
      </div>

      {/* Dernier gain */}
      {lastPrize !== null && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`card text-center ${
            lastPrize > 0 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}
        >
          <h3 className={`text-lg font-bold ${
            lastPrize > 0 ? 'text-green-800' : 'text-red-800'
          }`}>
            {lastPrize > 0 ? '🎉 Félicitations !' : '😔 Pas de chance !'}
          </h3>
          <p className={`${
            lastPrize > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {lastPrize > 0 
              ? `Vous avez gagné ${lastPrize} F !` 
              : 'Tentez votre chance à nouveau !'
            }
          </p>
        </motion.div>
      )}

      {/* Règles */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">📋 Règles du jeu</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Prix d'un tour : 200 F</li>
          <li>• Gains possibles : 0 F, 200 F, 1000 F</li>
          <li>• Tours gratuits via parrainage</li>
          <li>• Jeu équitable et transparent</li>
        </ul>
      </div>
    </div>
  );
};

export default Wheel;