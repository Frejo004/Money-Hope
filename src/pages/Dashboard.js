import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Play, 
  Users, 
  TrendingUp, 
  Gift,
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Tâches',
      description: 'Gagnez jusqu\'à 1500 F/jour',
      icon: Play,
      color: 'bg-blue-500',
      link: '/tasks'
    },
    {
      title: 'Roue',
      description: 'Tentez votre chance',
      icon: Gift,
      color: 'bg-purple-500',
      link: '/wheel'
    },
    {
      title: 'Parrainage',
      description: 'Invitez vos amis',
      icon: Users,
      color: 'bg-green-500',
      link: '/referral'
    }
  ];

  const stats = [
    {
      label: 'Gains aujourd\'hui',
      value: '0 F',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'Tâches restantes',
      value: '15',
      icon: Play,
      color: 'text-blue-600'
    },
    {
      label: 'Filleuls',
      value: '0',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* En-tête avec solde */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Bonjour {user?.phone} 👋
        </h1>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <p className="text-sm opacity-90">Solde disponible</p>
          <p className="text-4xl font-bold">{user?.balance || 0} F</p>
          <div className="flex gap-3 mt-4">
            <Link 
              to="/deposit" 
              className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-4 rounded-lg transition-all"
            >
              + Recharger
            </Link>
            <Link 
              to="/withdrawal" 
              className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-4 rounded-lg transition-all"
            >
              → Retirer
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Statistiques rapides */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {stats.map((stat, index) => (
          <div key={index} className="card text-center p-4">
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-lg font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Actions rapides */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-xl font-bold text-gray-800">Actions rapides</h2>
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="card flex items-center justify-between p-4 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className={`${action.color} p-3 rounded-xl text-white`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </Link>
        ))}
      </motion.div>

      {/* Notifications/Conseils */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200"
      >
        <div className="flex items-start space-x-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-orange-800">Conseil du jour</h3>
            <p className="text-sm text-orange-700 mt-1">
              Complétez toutes vos tâches quotidiennes pour maximiser vos gains !
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;