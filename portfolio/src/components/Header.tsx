import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, LogOut, User, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-gold rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gradient">Dev</span>
              <span className="text-white">Pro</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-gray-400 hover:text-gold transition-colors text-sm font-medium rounded-lg hover:bg-white/5">Início</Link>
            <Link to="/testar" className="px-3 py-2 text-gray-400 hover:text-gold transition-colors text-sm font-medium rounded-lg hover:bg-white/5">Testar Apps</Link>
            <a href="https://www.instagram.com/devpro737/" target="_blank" rel="noopener noreferrer"
              className="px-3 py-2 text-gold hover:text-yellow-300 transition-colors text-sm font-medium rounded-lg hover:bg-white/5 flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Fale Conosco
            </a>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-gold/20">
                <User className="w-3.5 h-3.5 text-gold" />
                <span className="text-sm text-gray-300">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-gold text-black font-semibold rounded-full text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
              Entrar
            </Link>
          )}
        </div>

        <button className="md:hidden text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-gold/10">
          <div className="px-4 py-4 space-y-2">
            <Link to="/" className="block px-3 py-2 text-gray-400 hover:text-gold rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Início</Link>
            <Link to="/testar" className="block px-3 py-2 text-gray-400 hover:text-gold rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Testar Apps</Link>
            <a href="https://www.instagram.com/devpro737/" target="_blank" rel="noopener noreferrer"
              className="block px-3 py-2 text-gold rounded-lg hover:bg-white/5 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Fale Conosco
            </a>
            <div className="border-t border-gold/10 pt-2 mt-2">
              {user ? (
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-red-400 rounded-lg hover:bg-white/5">Sair</button>
              ) : (
                <Link to="/login" className="block px-3 py-2 text-gold rounded-lg hover:bg-white/5" onClick={() => setMobileOpen(false)}>Entrar</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
