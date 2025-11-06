import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ValidatedInput, { validations } from '../components/ValidatedInput';
import InteractiveButton from '../components/InteractiveButton';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await login(formData.phone, formData.password);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-green-600">MH</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MoneyHope</h1>
          <p className="text-green-100">Votre espoir de gains quotidiens</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Connexion</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <ValidatedInput
              label="Numéro de téléphone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+229 XX XX XX XX"
              validation={validations.phone}
              required
            />

            <ValidatedInput
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Votre mot de passe"
              required
            />

            <InteractiveButton
              type="submit"
              loading={loading}
              disabled={!formData.phone || !formData.password}
              className="w-full"
              size="lg"
            >
              Se connecter
            </InteractiveButton>
          </form>

          {/* Lien d'inscription */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link 
                to="/register" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Avantages */}
        <div className="mt-6 text-center">
          <div className="grid grid-cols-3 gap-4 text-white">
            <div>
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-sm">Tâches faciles</p>
            </div>
            <div>
              <div className="text-2xl mb-1">💰</div>
              <p className="text-sm">Gains réels</p>
            </div>
            <div>
              <div className="text-2xl mb-1">🚀</div>
              <p className="text-sm">Retraits rapides</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;