import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Données fictives - à remplacer par un appel API
const mockLeaderboard = [
  { id: 101, name: 'Joueur Expert', earnings: 15000 },
  { id: 102, name: 'Gamer Pro', earnings: 12500 },
  { id: 103, name: 'Tâches Master', earnings: 11000 },
  { id: 104, name: 'Cash King', earnings: 9800 },
  { id: 105, name: 'Lucky Luke', earnings: 9500 },
  { id: 106, name: 'Super Gagneur', earnings: 8200 },
  { id: 107, name: 'Money Maker', earnings: 7600 },
  { id: 108, name: 'Débutant Actif', earnings: 4800 },
  { id: 109, name: 'Petit Poucet', earnings: 3200 },
].sort((a, b) => b.earnings - a.earnings);

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ajouter l'utilisateur actuel à la liste pour l'affichage
  const currentUserData = {
    id: user?.id || 'current_user',
    name: 'Vous',
    earnings: user?.totalEarnings || 5300, // Utiliser les gains totaux de l'utilisateur
  };

  const fullLeaderboard = [...mockLeaderboard, currentUserData]
    .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) // Dédoublonner
    .sort((a, b) => b.earnings - a.earnings);

  useEffect(() => {
    // Simuler un appel API
    const fetchLeaderboard = async () => {
      setLoading(true);
      setTimeout(() => {
        setLeaderboard(fullLeaderboard);
        setLoading(false);
      }, 1000);
    };

    fetchLeaderboard();
  }, []);

  const getMedalColor = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-yellow-600';
    return 'text-gray-300';
  };

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);
  const currentUserRank = leaderboard.findIndex(p => p.id === currentUserData.id) + 1;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Classement</h1>
      <p className="text-gray-500 mb-6">Qui est le meilleur gagneur ?</p>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        {topThree.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg shadow p-4 ${index === 0 ? 'transform scale-110 border-2 border-yellow-400' : ''}`}
          >
            <Medal className={`w-8 h-8 mx-auto ${getMedalColor(index + 1)}`} />
            <p className="font-bold mt-2 truncate">{player.name}</p>
            <p className={`font-semibold ${getMedalColor(index + 1)}`}>{player.earnings.toLocaleString()} F</p>
          </motion.div>
        ))}
      </div>

      {/* Reste du classement */}
      <div className="space-y-3">
        {restOfLeaderboard.map((player, index) => {
          const rank = index + 4;
          const isCurrentUser = player.id === currentUserData.id;
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 3) * 0.05 }}
              className={`bg-white rounded-lg shadow p-4 flex items-center space-x-4 ${isCurrentUser ? 'border-2 border-green-500' : ''}`}
            >
              <span className="text-lg font-bold text-gray-400 w-6 text-center">{rank}</span>
              <div className="flex-1">
                <p className={`font-semibold ${isCurrentUser ? 'text-green-600' : 'text-gray-800'}`}>{player.name}</p>
              </div>
              <p className="font-bold text-gray-700">{player.earnings.toLocaleString()} F</p>
            </motion.div>
          );
        })}
      </div>

      {/* Position de l'utilisateur */}
      {currentUserRank > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-16 left-0 right-0 p-4"
        >
          <div className="bg-green-600 text-white rounded-lg shadow-lg p-4 flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold">#{currentUserRank}</span>
              <div>
                <p className="font-semibold">Votre classement</p>
                <p className="text-sm opacity-90">{currentUserData.earnings.toLocaleString()} F</p>
              </div>
            </div>
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;