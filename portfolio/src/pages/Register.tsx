import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Zap, User, Mail, Lock, Phone, Building2 } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.register(form);
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-gold/5" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white">Criar Conta</h1>
          <p className="text-gray-500 text-sm mt-1">Cadastre-se e comece a transformar seu negócio</p>
        </div>

        <div className="bg-glass rounded-2xl p-8 border border-gold/10">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Seu nome"
                className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold/40 placeholder:text-gray-600" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Seu email"
                className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold/40 placeholder:text-gray-600" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Sua senha"
                className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold/40 placeholder:text-gray-600" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Seu telefone"
                className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold/40 placeholder:text-gray-600" />
            </div>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input name="company" value={form.company} onChange={handleChange} placeholder="Nome da empresa"
                className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-gold/40 placeholder:text-gray-600" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-gold text-black font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50">
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-gold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
