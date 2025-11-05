import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Play, 
  Gift, 
  Users, 
  User, 
  CreditCard,
  ArrowUpRight 
} from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Accueil' },
    { path: '/tasks', icon: Play, label: 'Tâches' },
    { path: '/wheel', icon: Gift, label: 'Roue' },
    { path: '/referral', icon: Users, label: 'Parrainage' },
    { path: '/profile', icon: User, label: 'Profil' }
  ];

  const quickActions = [
    { path: '/deposit', icon: CreditCard, label: 'Dépôt', color: 'text-green-600' },
    { path: '/withdrawal', icon: ArrowUpRight, label: 'Retrait', color: 'text-blue-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MH</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">MoneyHope</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {quickActions.map((action) => (
                <Link
                  key={action.path}
                  to={action.path}
                  className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${action.color}`}
                >
                  <action.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                    isActive 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;