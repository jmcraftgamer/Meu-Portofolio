import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-white text-primary-600 font-black text-2xl px-4 py-1.5 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
              Central
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {[
              { to: '/', label: 'Inicio' },
              { to: '/promocoes', label: 'Promocoes' },
              { to: '/meus-pedidos', label: 'Meus Pedidos' },
              ...(user?.role === 'admin' ? [
                { to: '/admin/pedidos', label: 'Admin-Pedidos' },
                { to: '/admin/produtos', label: 'Admin-Produtos' },
              ] : []),
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  link.label.startsWith('Admin-')
                    ? link.label === 'Admin-Pedidos'
                      ? 'bg-yellow-400 text-primary-700 hover:bg-yellow-300'
                      : 'hover:bg-white/10'
                    : 'hover:bg-white/10'
                }`}
              >
                {link.label.replace('Admin-', '')}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                  <div className="w-6 h-6 bg-white text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white/15 hover:bg-white/25 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-primary-600 hover:bg-gray-100 transition-colors hidden sm:block"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            <Link to="/carrinho" className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-yellow-400 text-primary-700 text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-md">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-1 mt-2 overflow-x-auto hide-scrollbar">
          {[
            { to: '/', label: 'Inicio' },
            { to: '/promocoes', label: 'Promocoes' },
            { to: '/meus-pedidos', label: 'Pedidos' },
            ...(user?.role === 'admin' ? [
              { to: '/admin/pedidos', label: 'Admin-Pedidos', highlight: true },
              { to: '/admin/produtos', label: 'Admin-Produtos' },
            ] : []),
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                (link as any).highlight
                  ? 'bg-yellow-400 text-primary-700'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {link.label.replace('Admin-', '')}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
