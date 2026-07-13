import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Zap, Globe, Smartphone, Monitor, CheckCircle, ChevronRight } from 'lucide-react';

const plans = [
  { type: 'site', icon: Globe, title: 'Site Profissional', color: 'from-yellow-500 to-gold' },
  { type: 'app_mobile', icon: Smartphone, title: 'App Mobile', color: 'from-gold to-yellow-300' },
  { type: 'app_desktop', icon: Monitor, title: 'App Desktop', color: 'from-yellow-600 to-gold-dark' },
];

const availableFeatures = [
  'Sistema de Vendas Completo', 'Sistema de Entrega com Rastreamento', 'Gestão de Estoque Inteligente',
  'IA para Recomendações', 'Chat Integrado com Clientes', 'Autenticação Google/Email',
  'Sistema de Pagamentos', 'CRM de Clientes', 'Dashboard com Analíticas', 'Notificações Push',
  'Modo Offline', 'Agendamento Inteligente', 'Multiplataforma (Web + Mobile)', 'Relatórios Automáticos',
  'Suporte 24/7 Prioritário',
];

export default function Order() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [form, setForm] = useState({ name: '', phone: '', company: '', description: '', deliveryTime: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const toggleFeature = (f: string) => {
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createOrder({ ...form, type: selected, features });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Pedido Realizado!</h2>
          <p className="text-gray-400 mb-6">Seu pedido foi enviado com sucesso. Em breve entraremos em contato.</p>
          <button onClick={() => navigate('/meus-pedidos')}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-gold text-black font-bold rounded-xl">
            Ver Meus Pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-gold/5 pointer-events-none" />
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            <span className="text-white">Solicite seu </span>
            <span className="text-gradient">Projeto</span>
          </h1>
          <p className="text-gray-500">Preencha as informações e daremos vida à sua ideia</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-gold text-black' : 'bg-white/10 text-gray-500'}`}>
                {s}
              </div>
              {s < 3 && <div className={`w-16 h-0.5 ${step > s ? 'bg-gold' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-glass rounded-2xl p-8 border border-gold/10">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Escolha o tipo de projeto</h2>
              <div className="grid gap-4">
                {plans.map(p => (
                  <button key={p.type} onClick={() => { setSelected(p.type); setStep(2); }}
                    className={`flex items-center gap-4 p-5 rounded-xl border transition-all text-left ${
                      selected === p.type
                        ? 'border-gold bg-gold/10'
                        : 'border-gold/10 hover:border-gold/30 bg-white/5'
                    }`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                      <p.icon className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{p.title}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Selecione os recursos desejados</h2>
              <p className="text-gray-500 text-sm mb-6">Escolha os recursos que você quer no seu projeto</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {availableFeatures.map(f => (
                  <button key={f} onClick={() => toggleFeature(f)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm text-left transition-all ${
                      features.includes(f)
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-gold/10 text-gray-400 hover:border-gold/30'
                    }`}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      features.includes(f) ? 'bg-gold border-gold' : 'border-gray-600'
                    }`}>
                      {features.includes(f) && <CheckCircle className="w-3 h-3 text-black" />}
                    </div>
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-gold/30 text-gold rounded-xl font-medium text-sm">Voltar</button>
                <button onClick={() => setStep(3)} className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-gold text-black font-bold rounded-xl text-sm flex-1">Continuar</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold text-white mb-6">Informações do Pedido</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Seu Nome *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-gold/40 placeholder:text-gray-600"
                    placeholder="Seu nome completo" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Telefone / WhatsApp *</label>
                  <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-gold/40 placeholder:text-gray-600"
                    placeholder="(11) 99999-8888" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Nome da Empresa</label>
                  <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                    className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-gold/40 placeholder:text-gray-600"
                    placeholder="Sua empresa" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Descrição do Projeto *</label>
                  <textarea required value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={4}
                    className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-gold/40 placeholder:text-gray-600 resize-none"
                    placeholder="Descreva o que você precisa..." />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Tempo Mínimo para Entrega *</label>
                  <input required value={form.deliveryTime} onChange={e => setForm(p => ({ ...p, deliveryTime: e.target.value }))}
                    className="w-full bg-white/5 border border-gold/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-gold/40 placeholder:text-gray-600"
                    placeholder="Ex: 30 dias" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-3 border border-gold/30 text-gold rounded-xl font-medium text-sm">Voltar</button>
                <button type="submit" disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-gold text-black font-bold rounded-xl text-sm flex-1 hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50">
                  {loading ? 'Enviando...' : 'Solicitar Pedido'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
