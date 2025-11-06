import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Play, 
  Users, 
  TrendingUp, 
  Gift,
  ArrowRight,
  Target,
  Clock,
  Star,
  Zap,
  Trophy,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    dailyEarnings: 0,
    tasksRemaining: 0,
    referrals: 0,
    totalEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/users/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erreur stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Tâches quotidiennes',
      description: 'Gagnez jusqu\'à 1500 F/jour',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      link: '/tasks',
      badge: stats.tasksRemaining > 0 ? `${stats.tasksRemaining} restantes` : null
    },
    {
      title: 'Roue de la Fortune',
      description: 'Tentez votre chance',
      icon: Gift,
      color: 'from-purple-500 to-purple-600',
      link: '/wheel',
      badge: user?.balance >= 200 ? 'Disponible' : 'Solde insuffisant'
    },
    {
      title: 'Parrainage',
      description: 'Invitez vos amis',
      icon: Users,
      color: 'from-green-500 to-green-600',
      link: '/referral',
      badge: `${stats.referrals} filleuls`
    }
  ];

  const dailyProgress = Math.min((stats.dailyEarnings / 1500) * 100, 100);

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* En-tête avec solde */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white p-6 rounded-2xl shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">Bonjour 👋</p>
                <h1 className="text-xl font-bold">{user?.name || 'Utilisateur'}</h1>
              </div>
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Coins className="w-6 h-6" />
              </div>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-sm opacity-90 mb-1">Solde disponible</p>
              <p className="text-4xl font-bold mb-2">{user?.balance || 0} F</p>
              
              {/* Barre de progression quotidienne */}
              <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${dailyProgress}%` }}
                ></div>
              </div>
              <p className="text-xs opacity-75">
                {stats.dailyEarnings} F / 1500 F aujourd'hui
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/deposit" 
                className="bg-white bg-opacity-20 hover:bg-opacity-30 py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span className="font-medium">Recharger</span>
              </Link>
              <Link 
                to="/withdrawal" 
                className="bg-white bg-opacity-20 hover:bg-opacity-30 py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-4 h-4" />
                <span className="font-medium">Retirer</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistiques en grille */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.dailyEarnings} F</p>
              <p className="text-xs text-gray-600">Gains aujourd'hui</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalEarned} F</p>
              <p className="text-xs text-gray-600">Total gagné</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions rapides */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Gagnez de l'argent</h2>
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`bg-gradient-to-r ${action.color} p-3 rounded-xl text-white shadow-lg`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                      {action.badge && (
                        <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                          {action.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Conseil du jour */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4"
      >
        <div className="flex items-start space-x-3">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg shadow-sm">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-orange-800 mb-1">💡 Conseil du jour</h3>
            <p className="text-sm text-orange-700">
              Complétez toutes vos tâches quotidiennes avant minuit pour maximiser vos gains !
            </p>
          </div>
        </div>
      </motion.div>

      {/* Activité récente */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Activité récente</h3>
          <Clock className="w-4 h-4 text-gray-500" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Connexion réussie</span>
            </div>
            <span className="text-xs text-gray-500">Maintenant</span>
          </div>
          {stats.dailyEarnings > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Gains aujourd'hui: {stats.dailyEarnings} F</span>
              </div>
              <span className="text-xs text-gray-500">Aujourd'hui</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;