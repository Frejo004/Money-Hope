import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Withdrawal = () => {
  const { user, requestWithdrawal } = useAuth(); // Supposons que requestWithdrawal existe dans le contexte
  const navigate = useNavigate();
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

  useEffect(() => {
    // Vérifie le statut KYC au chargement de la page
    if (user && user.kycStatus !== 'verified') {
      toast.info('Veuillez vérifier votre identité pour pouvoir effectuer un retrait.', {
        icon: 'ℹ️',
      });
      navigate('/kyc');
    }
  }, [user, navigate]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    if (user?.kycStatus !== 'verified') {
      toast.error('Votre identité doit être vérifiée pour effectuer un retrait.');
      return;
    }
    const withdrawAmount = parseInt(amount);

    if (withdrawAmount < 3000) {
      toast.error('Le montant minimum de retrait est de 3000 F.');
      return;
    }

    if (withdrawAmount > (user?.balance || 0)) {
      toast.error('Votre solde est insuffisant pour ce retrait.');
      return;
    }

    setLoading(true);
    try {
      // La fonction requestWithdrawal devrait gérer l'appel API et la mise à jour du contexte
      await requestWithdrawal({ amount: withdrawAmount, provider, phone });
      toast.success('Demande de retrait envoyée. Elle sera traitée sous 24h.');
      setAmount('');
      setPhone('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la demande de retrait.');
    } finally {
      setLoading(false);
    }
  };

  // Ne rend le contenu que si l'utilisateur est vérifié pour éviter un flash de l'interface
  if (user?.kycStatus !== 'verified') {
    return null; // Ou un spinner de chargement
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Retrait</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{user?.balance || 0} F</div>
          <div className="text-sm text-gray-600">Solde disponible</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleWithdrawal} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Montant (F CFA)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum 3000 F"
              min="3000"
              max={user?.balance || 0}
              className="w-full p-3 border rounded-lg"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Frais de retrait : 100 F • Vous recevrez : {amount ? (parseInt(amount) - 100) : 0} F
            </p>
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
            disabled={loading || !amount || parseInt(amount) < 3000}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Traitement...' : `Retirer ${amount} F`}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">Conditions :</h3>
          <ul className="text-sm space-y-1">
            <li>• Montant minimum : 3000 F</li>
            <li>• Frais de retrait : 100 F</li>
            <li>• Traitement sous 24h ouvrées</li>
            <li>• KYC requis pour les gros montants</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;