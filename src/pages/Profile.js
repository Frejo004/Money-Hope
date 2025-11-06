import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, ChevronRight } from 'lucide-react';

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth(); // Supposons que updateUserProfile existe dans le contexte
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // La fonction updateUserProfile devrait gérer l'appel API et la mise à jour du contexte
      await updateUserProfile(formData); 
      toast.success('Profil mis à jour avec succès !');
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  const getKycStatusBadge = () => {
    const status = user?.kycStatus;
    switch (status) {
      case 'verified':
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">Vérifié</span>;
      case 'pending':
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'rejected':
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">Rejeté</span>;
      default:
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">Non vérifié</span>;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Informations personnelles</h2>
          <button
            onClick={() => setEditing(prev => !prev)}
            className="text-blue-500 hover:text-blue-600"
          >
            {editing ? 'Annuler' : 'Modifier'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={!editing}
              className="w-full p-3 border rounded-lg disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={!editing}
              className="w-full p-3 border rounded-lg disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              disabled={!editing}
              className="w-full p-3 border rounded-lg disabled:bg-gray-50"
            />
          </div>
        </div>
        
        {editing && (
          <button
            onClick={handleSave}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{user?.balance || 0} F</div>
            <div className="text-sm text-gray-600">Solde</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{user?.totalEarnings || 0} F</div>
            <div className="text-sm text-gray-600">Gains totaux</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Compte & Sécurité</h2>
        <Link to="/kyc" className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-4">
            <Shield className="w-6 h-6 text-gray-500" />
            <div>
              <p className="font-semibold">Vérification d'identité (KYC)</p>
              <div className="mt-1">{getKycStatusBadge()}</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default Profile;