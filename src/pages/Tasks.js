import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Clock, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    if (completingTask) return;
    
    setCompletingTask(taskId);
    
    try {
      const response = await axios.post(`/tasks/${taskId}/complete`);
      const { reward, newBalance } = response.data;
      
      // Mettre à jour l'utilisateur
      updateUser({ ...user, balance: newBalance });
      
      // Mettre à jour les tâches
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: task.completed + 1, remaining: task.remaining - 1 }
          : task
      ));
      
      toast.success(`🎉 +${reward} F ajoutés à votre solde !`);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la tâche');
    } finally {
      setCompletingTask(null);
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'video': return Play;
      case 'quiz': return CheckCircle;
      case 'survey': return Gift;
      case 'checkin': return Clock;
      default: return Play;
    }
  };

  const getTaskColor = (type) => {
    switch (type) {
      case 'video': return 'bg-red-500';
      case 'quiz': return 'bg-blue-500';
      case 'survey': return 'bg-purple-500';
      case 'checkin': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Tâches Quotidiennes</h1>
        <p className="text-gray-600">Gagnez jusqu'à 1500 F par jour !</p>
      </div>

      {/* Progression quotidienne */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Progression du jour</h3>
          <span className="text-2xl font-bold text-green-600">{user?.balance || 0} F</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((user?.balance || 0) / 1500 * 100, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>0 F</span>
          <span>Limite: 1500 F</span>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-4">
        {tasks.map((task, index) => {
          const TaskIcon = getTaskIcon(task.type);
          const isCompleted = task.remaining <= 0;
          const isInProgress = completingTask === task.id;
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card ${isCompleted ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`${getTaskColor(task.type)} p-3 rounded-xl text-white`}>
                    <TaskIcon className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>+{task.reward} F</span>
                      <span>•</span>
                      <span>{task.remaining}/{task.maxDaily} restantes</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => completeTask(task.id)}
                  disabled={isCompleted || isInProgress}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    isCompleted 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : isInProgress
                      ? 'bg-orange-500 text-white cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white transform hover:scale-105'
                  }`}
                >
                  {isInProgress ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>En cours...</span>
                    </div>
                  ) : isCompleted ? (
                    'Terminé'
                  ) : (
                    'Commencer'
                  )}
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(task.completed / task.maxDaily) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Conseils */}
      <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-800">💡 Conseils</h3>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Complétez toutes vos tâches pour maximiser vos gains</li>
              <li>• Les tâches se renouvellent chaque jour à minuit</li>
              <li>• Invitez vos amis pour gagner des bonus supplémentaires</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;