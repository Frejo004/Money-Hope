import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, ClipboardList, History, Trophy } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { to: '/', icon: LayoutGrid, label: 'Accueil' },
    { to: '/tasks', icon: ClipboardList, label: 'Tâches' },
    { to: '/history', icon: History, label: 'Historique' },
    { to: '/leaderboard', icon: Trophy, label: 'Classement' },
  ];

  const activeClassName = 'text-green-500';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg" style={{ boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)' }}>
      <div className="flex justify-around max-w-md mx-auto h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full text-sm font-medium transition-colors ${
                isActive ? activeClassName : 'text-gray-500 hover:text-green-500'
              }`
            }
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;