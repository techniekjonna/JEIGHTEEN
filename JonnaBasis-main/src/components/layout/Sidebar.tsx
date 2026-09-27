import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FolderOpen, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout, darkMode, toggleDarkMode } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/dashboard/projecten', icon: FolderOpen, label: 'Projecten' },
    { to: '/dashboard/instellingen', icon: Settings, label: 'Instellingen' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 dark:bg-slate-950 text-white">
      <div className="p-6">
        <h1 className="text-xl font-bold">Developer Hub</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 dark:border-slate-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
          {darkMode ? 'Licht thema' : 'Donker thema'}
        </button>
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Uitloggen
        </button>
      </div>
    </div>
  );
};