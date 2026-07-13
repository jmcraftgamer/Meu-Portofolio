import { useNavigate } from 'react-router-dom';
import { Monitor, Smartphone, Zap, ShoppingCart, Star, ArrowRight } from 'lucide-react';

const apps = [
  {
    id: 'acai',
    name: 'Açaí Express',
    icon: '🍇',
    desc: 'App mobile para loja de açaí. Peça combos ou monte seu açaí personalizado.',
    gradient: 'from-purple-600 to-pink-500',
    route: '/testar/acai',
    label: 'Testar App Mobile',
    iconBtn: Smartphone,
    stats: '+310% pedidos',
    tag: 'Mobile First'
  },
  {
    id: 'hamburguer',
    name: 'Hamburgueria Pro',
    icon: '🍔',
    desc: 'App completo para hamburguerias com cardápio digital e pedidos online.',
    gradient: 'from-yellow-600 to-orange-500',
    route: '/testar/hamburguer',
    label: 'Testar Site',
    iconBtn: Monitor,
    stats: '+230% vendas',
    tag: 'Site Completo'
  },
  {
    id: 'mercado',
    name: 'Mercado Digital',
    icon: '🛒',
    desc: 'Marketplace completo para supermercados. Venda online com catálogo, carrinho e pagamentos.',
    gradient: 'from-gold to-yellow-500',
    route: '/testar/mercado',
    label: 'Testar Marketplace',
    iconBtn: Monitor,
    stats: '+180% alcance',
    tag: 'Marketplace'
  },
];

export default function Testar() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-gold/5 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm mb-4">
            <Zap className="w-4 h-4" />
            Apps em Ação
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            <span className="text-white">Teste Nossos </span>
            <span className="text-gradient">Apps</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Clique em um app abaixo para testar todas as funcionalidades 
            diretamente aqui no site.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div key={app.id}
              className="group bg-glass rounded-2xl border border-gold/10 overflow-hidden hover:border-gold/30 transition-all duration-300 hover:glow-gold-sm"
            >
              <div className={`h-2 bg-gradient-to-r ${app.gradient}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-2xl`}>
                    {app.icon}
                  </div>
                  <span className="px-2.5 py-1 bg-white/5 rounded-full text-[10px] font-semibold text-gray-400 border border-gold/10">
                    {app.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{app.desc}</p>

                <div className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-5">
                  <Star className="w-3 h-3" /> {app.stats}
                </div>

                {app.id === 'acai' ? (
                  <button onClick={() => navigate(`${app.route}?mode=phone`)}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-yellow-500 to-gold text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all group"
                  >
                    <Smartphone className="w-4 h-4" />
                    {app.label}
                    <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`${app.route}?mode=phone`)}
                      className="flex-1 flex items-center justify-center gap-1.5 p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-gold text-black font-bold text-xs hover:shadow-lg hover:shadow-gold/20 transition-all"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      Celular
                    </button>
                    <button onClick={() => navigate(`${app.route}?mode=pc`)}
                      className="flex-1 flex items-center justify-center gap-1.5 p-3 rounded-xl border border-gold/30 text-gold font-bold text-xs hover:bg-gold/10 transition-all"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      PC
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-glass rounded-2xl p-8 border border-dashed border-gold/20 text-center">
          <ShoppingCart className="w-10 h-10 text-gold/50 mx-auto mb-3" />
          <h3 className="text-gold font-semibold mb-2">Quer um app igual para seu negócio?</h3>
          <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
            Criamos soluções personalizadas que transformam seu negócio.
          </p>
          <button onClick={() => navigate('/order')}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-gold text-black font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-gold/20 transition-all inline-flex items-center gap-2">
            Fazer Pedido Agora <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
