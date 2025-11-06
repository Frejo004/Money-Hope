import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Deposit = () => {
  const { requestDeposit } = useAuth(); // Supposons que requestDeposit existe dans le contexte
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('orange');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const providers = [
    { id: 'orange', name: 'Orange Money', color: 'orange' },
    { id: 'mtn', name: 'MTN Mobile Money', color: 'yellow' },
    { id: 'wave', name: 'Wave', color: 'blue' },
    { id: 'moov', name: 'Moov Money', color: 'green' }
  ];

  const handleDeposit = async (e) => {
    e.preventDefault();
    const depositAmount = parseInt(amount);

    if (depositAmount < 1000) {
      toast.error('Le montant minimum de dépôt est de 1000 F.');
      return;
    }

    setLoading(true);
    try {
      // La fonction requestDeposit devrait gérer l'appel API
      await requestDeposit({ amount: depositAmount, provider, phone });
      toast.success('Dépôt initié. Suivez les instructions sur votre téléphone.');
      setAmount('');
      setPhone('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la demande de dépôt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dépôt</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleDeposit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Montant (F CFA)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum 1000 F"
              min="1000"
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Opérateur</label>
            <div className="grid grid-cols-2 gap-3">
              {providers.map((p) => (
                <label key={p.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="provider"
                    value={p.id}
                    checked={provider === p.id}
                    onChange={(e) => setProvider(e.target.value)}
                    className="mr-3"
                  />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+225 XX XX XX XX"
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !amount || parseInt(amount) < 1000}
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Traitement...' : `Déposer ${amount ? amount + ' F' : ''}`}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions :</h3>
          <ul className="text-sm space-y-1">
            <li>• Montant minimum : 1000 F</li>
            <li>• Frais : Selon votre opérateur</li>
            <li>• Crédit instantané après confirmation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Deposit;