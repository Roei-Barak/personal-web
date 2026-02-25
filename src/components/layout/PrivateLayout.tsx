import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Home, Snowflake, Music, Settings } from 'lucide-react';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setOpensidebar] = useState(true);

  const handleLogout = async () => {
    logout();
    navigate('/', { replace: true });
  };

  const getNavLinks = () => {
    if (role === 'admin') {
      return [
        { label: 'Ski Dashboard', icon: Snowflake, path: '/ski' },
        { label: 'Musical CMS', icon: Music, path: '/musical' },
        { label: 'Admin Panel', icon: Settings, path: '/admin' },
      ];
    }
    if (role === 'approved_friend') {
      return [{ label: 'Ski Dashboard', icon: Snowflake, path: '/ski' }];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo / Brand */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-white">Dashboard</h1>}
          <button
            onClick={() => setOpensidebar(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition group"
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          {/* Back to Portfolio */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <Home size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Portfolio</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>

          {/* User Info */}
          {sidebarOpen && (
            <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
              <p className="text-xs text-slate-400">Logged in as</p>
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-slate-400 capitalize mt-1">{role}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-900">
        {children}
      </main>
    </div>
  );
}
