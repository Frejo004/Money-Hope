import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Trophy, Star, Zap, Gift, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InteractiveButton from '../components/InteractiveButton';
import AnimatedCard from '../components/AnimatedCard';
import axios from 'axios';
import toast from 'react-hot-toast';

const Wheel = () => {
  const { user, updateUser } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastPrize, setLastPrize] = useState(null);
  const [stats, setStats] = useState({ totalSpins: 0, totalWon: 0, biggestWin: 0 });
  const [showCelebration, setShowCelebration] = useState(false);

  const wheelPrizes = [
    { amount: 0, color: '#EF4444', label: '0 F', probability: 32 },
    { amount: 200, color: '#F59E0B', label: '200 F', probability: 67.5 },
    { amount: 0, color: '#EF4444', label: '0 F', probability: 32 },
    { amount: 200, color: '#F59E0B', label: '200 F', probability: 67.5 },
    { amount: 0, color: '#EF4444', label: '0 F', probability: 32 },
    { amount: 200, color: '#F59E0B', label: '200 F', probability: 67.5 },
    { amount: 1000, color: '#10B981', label: '1000 F', probability: 0.5 },
    { amount: 200, color: '#F59E0B', label: '200 F', probability: 67.5 }
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/wheel/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const spinWheel = async () => {
    if (isSpinning || user.balance < 200) return;

    setIsSpinning(true);
    setLastPrize(null);
    setShowCelebration(false);
    
    try {
      const response = await axios.post('/wheel/spin');
      const { prize, newBalance } = response.data.result;
      
      // Animation de rotation
      const spins = 5 + Math.random() * 3;
      const finalRotation = rotation + (spins * 360) + (Math.random() * 360);
      setRotation(finalRotation);
      
      // Attendre la fin de l'animation
      setTimeout(() => {
        setLastPrize(prize);
        updateUser({ ...user, balance: newBalance });
        
        if (prize > 0) {
          setShowCelebration(true);
          toast.success(`🎉 Félicitations ! +${prize} F !`, {
            duration: 5000,
            style: { background: '#10B981', color: 'white' }
          });
          
          // Masquer la célébration après 3s
          setTimeout(() => setShowCelebration(false), 3000);
        } else {
          toast.error('Pas de chance ! Retentez votre chance !');
        }
        
        setIsSpinning(false);
        fetchStats();
      }, 4000);
      
    } catch (error) {
      setIsSpinning(false);
      toast.error(error.response?.data?.message || 'Erreur lors du tour');
    }
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      {/* En-tête */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Roue de la Fortune
          </h1>
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-gray-600">Tentez votre chance pour gagner jusqu'à 1000 F !</p>
      </motion.div>

      {/* Solde et stats */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatedCard className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="text-center">
            <Coins className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-90">Solde</p>
            <p className="text-2xl font-bold">{user?.balance || 0} F</p>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-90">Gains totaux</p>
            <p className="text-2xl font-bold">{stats.totalWon} F</p>
          </div>
        </AnimatedCard>
      </div>

      {/* Roue */}
      <AnimatedCard className="p-6 relative overflow-hidden">
        {/* Particules de fond */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30"
              animate={{
                x: [0, Math.random() * 400],
                y: [0, Math.random() * 400],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto w-80 h-80">
          {/* Indicateur */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
            <motion.div 
              className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"
              animate={{ scale: isSpinning ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
            />
          </div>
          
          {/* Roue */}
          <motion.div
            className="w-full h-full rounded-full border-8 border-white relative overflow-hidden shadow-2xl"
            style={{
              background: `conic-gradient(${wheelPrizes.map((prize, index) => 
                `${prize.color} ${index * 45}deg ${(index + 1) * 45}deg`
              ).join(', ')})`
            }}
            animate={{ rotate: rotation }}
            transition={{ 
              duration: isSpinning ? 4 : 0, 
              ease: isSpinning ? [0.25, 0.46, 0.45, 0.94] : "linear"
            }}
          >
            {/* Segments de texte */}
            {wheelPrizes.map((prize, index) => (
              <div
                key={index}
                className="absolute w-full h-full flex items-center justify-center text-white font-bold text-lg drop-shadow-lg"
                style={{
                  transform: `rotate(${index * 45 + 22.5}deg)`,
                  transformOrigin: 'center'
                }}
              >
                <span 
                  className="text-lg font-black"
                  style={{ 
                    transform: 'translateY(-120px) rotate(-22.5deg)',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {prize.label}
                </span>
              </div>
            ))}

            {/* Effet de brillance */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{
                x: isSpinning ? ['-100%', '100%'] : '-100%',
              }}
              transition={{
                duration: 2,
                repeat: isSpinning ? Infinity : 0,
                ease: "linear"
              }}
              style={{ transform: 'skewX(-20deg)' }}
            />
          </motion.div>
          
          {/* Centre de la roue */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-4 border-white flex items-center justify-center shadow-xl z-10">
            <motion.div
              animate={{ rotate: isSpinning ? 360 : 0 }}
              transition={{ duration: 1, repeat: isSpinning ? Infinity : 0, ease: "linear" }}
            >
              <Star className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </div>
      </AnimatedCard>

      {/* Bouton de jeu */}
      <div className="text-center">
        <InteractiveButton
          onClick={spinWheel}
          loading={isSpinning}
          disabled={user?.balance < 200}
          className={`w-full max-w-xs py-4 px-8 text-xl font-bold ${
            user?.balance < 200 
              ? 'bg-gray-400' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
          } text-white shadow-xl`}
          size="lg"
        >
          {user?.balance < 200 ? (
            'Solde insuffisant'
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <Zap className="w-6 h-6" />
              <span>Jouer (200 F)</span>
            </span>
          )}
        </InteractiveButton>
      </div>

      {/* Résultat du dernier tour */}
      <AnimatePresence>
        {lastPrize !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className={`text-center p-6 rounded-2xl ${
              lastPrize > 0 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
            } shadow-xl`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              {lastPrize > 0 ? (
                <div>
                  <Trophy className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">🎉 Félicitations !</h3>
                  <p className="text-lg">Vous avez gagné {lastPrize} F !</p>
                </div>
              ) : (
                <div>
                  <Gift className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-2xl font-bold">😔 Pas de chance !</h3>
                  <p className="text-lg">Retentez votre chance !</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Célébration */}
      <AnimatePresence>
        {showCelebration && lastPrize > 0 && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 800,
                  y: (Math.random() - 0.5) * 800,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistiques */}
      <AnimatedCard className="p-4">
        <h3 className="font-bold text-gray-800 mb-4 text-center">📊 Vos statistiques</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{stats.totalSpins}</p>
            <p className="text-xs text-gray-600">Tours joués</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.totalWon} F</p>
            <p className="text-xs text-gray-600">Total gagné</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{stats.biggestWin} F</p>
            <p className="text-xs text-gray-600">Plus gros gain</p>
          </div>
        </div>
      </AnimatedCard>

      {/* Règles */}
      <AnimatedCard className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-3 flex items-center">
          <Gift className="w-5 h-5 mr-2" />
          Règles du jeu
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p>• Prix : 200 F par tour</p>
            <p>• Gains : 0 F, 200 F, 1000 F</p>
          </div>
          <div>
            <p>• Jeu équitable et transparent</p>
            <p>• Tours gratuits via parrainage</p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default Wheel;