import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(email, password);
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError('');
    const mockGoogleUser = {
      email: prompt('Digite seu email do Google:') || '',
      name: prompt('Digite seu nome:') || '',
      googleId: 'google_' + Date.now(),
    };
    api.googleLogin(mockGoogleUser)
      .then(data => { login(data.token, data.user); navigate('/'); })
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-gold/5" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white">Entrar</h1>
          <p className="text-gray-500 text-sm mt-1">Acesse sua conta para fazer pedidos</p>
        </div>

        <div className="bg-glass rounded-2xl p-8 border border-gold/10">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 border border-gold/30 rounded-xl text-gold font-medium text-sm hover:bg-gold/5 transition-all flex items-center justify-center gap-2 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Entrar com Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gold/10" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-[#0a0a0a] px-4 text-gray-500">ou entre com email</span></div>
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold/40 transition-colors placeholder:text-gray-600"
                  placeholder="seu@email.com" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-gold/40 transition-colors placeholder:text-gray-600"
                  placeholder="Sua senha" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-gold text-black font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Não tem conta?{' '}
            <Link to="/register" className="text-gold hover:underline">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
