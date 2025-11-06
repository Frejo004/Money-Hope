import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UploadCloud, FileImage, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const KYC = () => {
  const { user, updateUser } = useAuth();
  const [idDocument, setIdDocument] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setIdDocument(file);
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error('Veuillez sélectionner un fichier image valide (JPEG, PNG).');
      setIdDocument(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idDocument) {
      toast.error('Veuillez sélectionner un document à téléverser.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('kycDocument', idDocument);

    try {
      // Remplacer par votre vrai appel API
      const response = await axios.post('/users/kyc-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Mettre à jour l'utilisateur dans le contexte
      updateUser({ ...user, kycStatus: 'pending' });
      toast.success('Document envoyé ! Il sera examiné sous 24-48h.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi du document.');
    } finally {
      setLoading(false);
    }
  };

  const renderStatusView = () => {
    switch (user?.kycStatus) {
      case 'pending':
        return (
          <div className="text-center card bg-yellow-50 border-yellow-200">
            <Clock className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-xl font-bold text-yellow-800">En cours de vérification</h2>
            <p className="text-yellow-700 mt-2">
              Votre document est en cours d'examen. Ce processus peut prendre jusqu'à 48 heures.
            </p>
          </div>
        );
      case 'verified':
        return (
          <div className="text-center card bg-green-50 border-green-200">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-green-800">Identité vérifiée</h2>
            <p className="text-green-700 mt-2">
              Félicitations ! Vous pouvez maintenant effectuer des retraits sans restriction.
            </p>
          </div>
        );
      case 'rejected':
        return (
          <div className="text-center card bg-red-50 border-red-200">
            <XCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-800">Vérification échouée</h2>
            <p className="text-red-700 mt-2">
              Votre document n'a pas pu être validé. Veuillez réessayer avec une image claire et lisible.
            </p>
            {/* Permettre de soumettre à nouveau en réinitialisant le statut */}
            <button onClick={() => updateUser({ ...user, kycStatus: 'not_verified' })} className="btn-primary mt-4">
              Réessayer
            </button>
          </div>
        );
      default: // 'not_verified' ou undefined
        return (
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2">Téléverser votre document</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <img src={preview} alt="Aperçu" className="mx-auto h-32 w-auto rounded-md" />
                  ) : (
                    <>
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-600">Glissez-déposez ou cliquez pour choisir un fichier</p>
                    </>
                  )}
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                    <span>{idDocument ? 'Changer de fichier' : 'Choisir un fichier'}</span>
                  </label>
                </div>
              </div>
              {idDocument && <p className="text-sm text-gray-500 mt-2 flex items-center"><FileImage className="w-4 h-4 mr-2" />{idDocument.name}</p>}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
              <h3 className="font-bold mb-2">Pourquoi est-ce nécessaire ?</h3>
              <p>La vérification d'identité (KYC) est une obligation légale pour prévenir la fraude et nous permet de sécuriser vos gains.</p>
              <ul className="list-disc list-inside mt-2">
                <li>Assurez-vous que le document est bien lisible.</li>
                <li>Formats acceptés : PNG, JPG.</li>
              </ul>
            </div>

            <button type="submit" disabled={loading || !idDocument} className="btn-primary w-full">
              {loading ? 'Envoi en cours...' : 'Soumettre pour vérification'}
            </button>
          </form>
        );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Vérification d'Identité (KYC)</h1>
      {renderStatusView()}
    </div>
  );
};

export default KYC;