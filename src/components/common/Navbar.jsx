import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Droplet, LogOut, User, LayoutDashboard, Hospital } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Hospitals', path: '/hospitals', icon: Hospital },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-100 group-hover:rotate-12 transition-transform">
                <Droplet size={24} fill="currentColor" />
              </div>
              <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">
                Blood<span className="text-red-600">Link</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                  location.pathname === link.path ? 'text-red-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Donor</p>
                  <p className="text-sm font-bold text-slate-700">{user.name}</p>
                </div>
                <button 
                  onClick={() => navigate('/profile')}
                  className="h-10 w-10 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <User size={20} />
                </button>
                <button 
                  onClick={logout}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-100">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;