import React from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Referral = () => {
  const { user } = useAuth();

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    toast.success('Code de parrainage copié !');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Parrainage</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Votre code de parrainage</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={user?.referralCode || ''}
            readOnly
            className="flex-1 p-3 border rounded-lg bg-gray-50"
          />
          <button
            onClick={copyReferralCode}
            className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600"
          >
            Copier
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Vos gains</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{user?.referralEarnings || 0} F</div>
            <div className="text-sm text-gray-600">Gains totaux</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{user?.referralCount || 0}</div>
            <div className="text-sm text-gray-600">Filleuls</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Comment ça marche ?</h2>
        <ul className="space-y-2 text-sm">
          <li>• Partagez votre code avec vos amis</li>
          <li>• Ils s'inscrivent avec votre code</li>
          <li>• Vous gagnez 50 F + 1 tour gratuit</li>
          <li>• Votre filleul gagne aussi 50 F</li>
        </ul>
      </div>
    </div>
  );
};

export default Referral;