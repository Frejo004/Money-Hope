import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ValidatedInput, { validations } from '../components/ValidatedInput';
import InteractiveButton from '../components/InteractiveButton';
import ProviderSelector from '../components/ProviderSelector';
import toast from 'react-hot-toast';

const Deposit = () => {
  const { requestDeposit } = useAuth(); // Supposons que requestDeposit existe dans le contexte
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('orange');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const providers = [
    { id: 'orange', name: 'Orange Money', available: true, fees: '0%' },
    { id: 'mtn', name: 'MTN Mobile Money', available: true, fees: '1%' },
    { id: 'wave', name: 'Wave', available: true, fees: '0.5%' },
    { id: 'moov', name: 'Moov Money', available: false, fees: '1%' }
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
          <ValidatedInput
            label="Montant (F CFA)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Minimum 1000 F"
            validation={(value) => validations.amount(value, 1000, 1000000)}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-4">Opérateur Mobile Money</label>
            <ProviderSelector
              providers={providers}
              selected={provider}
              onSelect={setProvider}
            />
          </div>

          <ValidatedInput
            label="Numéro de téléphone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+225 XX XX XX XX"
            validation={validations.phone}
            required
          />

          <InteractiveButton
            type="submit"
            loading={loading}
            disabled={!amount || parseInt(amount) < 1000 || !phone}
            className="w-full"
            size="lg"
          >
            Déposer {amount ? `${amount} F` : ''}
          </InteractiveButton>
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