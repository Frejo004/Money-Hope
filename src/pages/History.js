import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, Gift, Play, Users, FileText } from 'lucide-react';

const mockTransactions = [
  { id: 1, type: 'gain_wheel', description: 'Gain - Roue de la fortune', amount: 200, date: '2025-11-06' },
  { id: 2, type: 'cost_wheel', description: 'Dépense - Tour de roue', amount: -200, date: '2025-11-06' },
  { id: 3, type: 'gain_task', description: 'Gain - Tâche vidéo', amount: 50, date: '2025-11-05' },
  { id: 4, type: 'gain_referral', description: 'Gain - Parrainage', amount: 100, date: '2025-11-05' },
  { id: 5, type: 'withdrawal', description: 'Demande de retrait', amount: -3000, date: '2025-11-04' },
  { id: 6, type: 'gain_task', description: 'Gain - Sondage', amount: 75, date: '2025-11-03' },
];

const getTransactionIcon = (type) => {
  if (type.startsWith('gain')) return <ArrowUpCircle className="w-6 h-6 text-green-500" />;
  if (type.startsWith('cost') || type === 'withdrawal') return <ArrowDownCircle className="w-6 h-6 text-red-500" />;
  
  switch (type) {
    case 'gain_wheel': return <Gift className="w-6 h-6 text-green-500" />;
    case 'gain_task': return <Play className="w-6 h-6 text-green-500" />;
    case 'gain_referral': return <Users className="w-6 h-6 text-green-500" />;
    default: return <FileText className="w-6 h-6 text-gray-500" />;
  }
};

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un appel API
    const fetchHistory = async () => {
      setLoading(true);
      // Remplacer ceci par votre vrai appel API :
      // const response = await axios.get('/transactions/history');
      // setTransactions(response.data.transactions);
      setTimeout(() => {
        setTransactions(mockTransactions);
        setLoading(false);
      }, 1000);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Historique</h1>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-600">Aucune transaction</h2>
          <p className="mt-1 text-gray-500">Votre historique de transactions apparaîtra ici.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {getTransactionIcon(tx.type)}
                <div>
                  <p className="font-semibold text-gray-800">{tx.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <p
                className={`font-bold text-lg ${
                  tx.amount > 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {tx.amount > 0 ? '+' : ''}
                {tx.amount.toLocaleString('fr-FR')} F
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;