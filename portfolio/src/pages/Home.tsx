import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Zap, Smartphone, Monitor, ShoppingCart, TrendingUp,
  BarChart3, Users, MessageCircle, CheckCircle, Star, Rocket,
  Shield, Clock, CreditCard, Globe, Cpu, Bot, Cloud, Lock
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, staggerChildren: 0.1 }
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-[#0a0a0a]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm mb-6">
                <Zap className="w-4 h-4" />
                Transforme seu negócio digital
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                <span className="text-white">Soluções Digitais que</span>
                <br />
                <span className="text-gradient">Impulsionam Vendas</span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
                Criamos sites, aplicativos mobile e sistemas desktop que transformam 
                seu negócio. Tecnologia de ponta para você <span className="text-gold font-semibold">vender mais</span>, 
                <span className="text-gold font-semibold"> crescer mais</span> e 
                <span className="text-gold font-semibold"> ser a melhor da sua região</span>.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.instagram.com/devpro737/" target="_blank" rel="noopener noreferrer"
                  className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-gold text-black font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center gap-2">
                  Fale Conosco
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link to="/testar" className="group px-8 py-4 border border-gold/30 text-gold font-bold rounded-xl text-lg hover:bg-gold/10 transition-all flex items-center gap-2">
                  Testar Apps
                  <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> 50+ projetos</div>
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> 98% satisfação</div>
                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Suporte 24/7</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full h-[600px]">
                <img src="/images/gallery/DrinkPc.png" alt="App versao PC"
                  className="absolute bottom-52 right-0 max-w-[550px] max-h-[550px] animate-float rounded-xl" />
                <img src="/images/gallery/DrinkCelular.png" alt="App versao Celular"
                  className="absolute bottom-12 -left-12 max-w-[400px] max-h-[450px] animate-float rounded-xl"
                  style={{ animationDelay: '1.5s' }} />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Globe, value: '50+', label: 'Projetos Entregues' },
              { icon: Users, value: '98%', label: 'Clientes Satisfeitos' },
              { icon: Star, value: '4.9', label: 'Avaliação Média' },
              { icon: TrendingUp, value: '300%', label: 'Crescimento Médio' },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center">
                <item.icon className="w-6 h-6 text-gold mx-auto mb-3" />
                <div className="text-3xl font-black text-gradient">{item.value}</div>
                <div className="text-gray-500 text-sm mt-1">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio / Projects Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="text-white">Apps que </span>
              <span className="text-gradient">Transformam Negócios</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Veja alguns dos aplicativos que criamos. Cada um foi desenvolvido sob medida 
              para resolver problemas reais e gerar resultados extraordinários.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Hamburgueria Pro',
                desc: 'App completo para hamburguerias. Pedidos online, cardápio digital, delivery integrado e gestão de vendas. Seus clientes pedem em segundos!',
                gradient: 'from-yellow-600 to-orange-500',
                icon: '🍔',
                stats: '+230% vendas'
              },
              {
                title: 'Mercado Digital',
                desc: 'Marketplace completo para supermercados. Venda online com catálogo, carrinho, pagamentos e entrega. O único mercado que vende pela internet na região!',
                gradient: 'from-gold to-yellow-500',
                icon: '🛒',
                stats: '+180% alcance'
              },
              {
                title: 'Açaí Express',
                desc: 'App elegante para lojas de açaí. Compre combos ou monte seu açaí personalizado em segundos. Entrega rápida diretamente na casa do cliente.',
                gradient: 'from-purple-600 to-pink-500',
                icon: '🍇',
                stats: '+310% pedidos'
              }
            ].map((project, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }}
                className="group relative bg-glass rounded-2xl overflow-hidden hover:bg-glass-hover transition-all"
              >
                <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                <div className="p-6">
                  <div className="text-4xl mb-4">{project.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.desc}</p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full">
                    <TrendingUp className="w-3 h-3" /> {project.stats}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* Placeholder images area */}
          <motion.div {...fadeUp} className="mt-12">
            <div className="bg-glass rounded-2xl p-8 text-center border border-dashed border-gold/20">
              <h3 className="text-gold font-semibold mb-2">📸 Galeria de Projetos</h3>
              <p className="text-gray-500 text-sm">
                Em breve, imagens dos seus aplicativos aqui! Mostre ao mundo o poder do seu trabalho.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="space-y-4">
                  <img src="/images/gallery/PizzaPc.png" alt="Hamburgueria Pro - Versao PC" className="w-full rounded-xl border border-gold/10 bg-white/5" />
                  <img src="/images/gallery/SorveteriaPc.png" alt="Acai Express - Versao PC" className="w-full rounded-xl border border-gold/10 bg-white/5" />
                </div>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <img src="/images/gallery/PizzaCelular.png" alt="Hamburgueria Pro - Versao Celular" className="w-full rounded-xl border border-gold/10 bg-white/5" />
                  <img src="/images/gallery/SorveteriaCelular.png" alt="Acai Express - Versao Celular" className="w-full rounded-xl border border-gold/10 bg-white/5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-[#050505] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-gold/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm mb-4">
              <CreditCard className="w-4 h-4" />
              Invista no seu sucesso
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="text-white">Planos </span>
              <span className="text-gradient">Sob Medida</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Escolha a solução ideal para o seu negócio. Preços acessíveis e resultados que valem cada centavo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: 'Site Profissional',
                features: ['Design moderno e responsivo', 'Otimizado para SEO', 'Integração com WhatsApp', 'Formulário de contato', 'Hospedagem 1 ano grátis'],
                popular: false,
                gradient: 'from-yellow-500 to-gold'
              },
              {
                icon: Smartphone,
                title: 'App Mobile',
                features: ['Android e iOS', 'Interface nativa e fluida', 'Notificações push', 'Pagamento integrado', 'Modo offline', 'Publicação nas lojas'],
                popular: true,
                gradient: 'from-gold to-yellow-300'
              },
              {
                icon: Monitor,
                title: 'App Desktop',
                features: ['Windows e Mac', 'Sistema completo', 'Banco de dados local', 'Relatórios avançados', 'Suporte prioritário', 'Treinamento incluso'],
                popular: false,
                gradient: 'from-yellow-600 to-gold-dark'
              }
            ].map((plan, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${plan.popular ? 'bg-gradient-to-b from-gold/10 to-gold/5 border-2 border-gold/40 scale-105 glow-gold' : 'bg-glass border border-gold/10 hover:border-gold/30'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-500 to-gold text-black text-center py-1.5 text-xs font-bold uppercase tracking-wider">
                    Mais Popular
                  </div>
                )}
                <div className={`p-6 ${plan.popular ? 'pt-10' : ''}`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                    <plan.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{plan.title}</h3>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="https://www.instagram.com/devpro737/" target="_blank" rel="noopener noreferrer"
                    className={`block w-full py-3 rounded-xl text-center font-bold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-500 to-gold text-black hover:shadow-lg hover:shadow-gold/20'
                        : 'border border-gold/30 text-gold hover:bg-gold/10'
                    }`}
                  >
                    Fale Conosco
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="text-white">Tudo que seu negócio </span>
              <span className="text-gradient">precisa</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              De sistemas inteligentes a soluções com IA, temos tudo para você dominar o mercado.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShoppingCart, title: 'Sistema de Vendas', desc: 'Venda mais com um sistema completo e intuitivo' },
              { icon: Truck, title: 'Sistema de Entrega', desc: 'Entregas rápidas e rastreamento em tempo real' },
              { icon: BarChart3, title: 'Gestão de Estoque', desc: 'Controle total do seu inventário' },
              { icon: Bot, title: 'IA Inteligente', desc: 'Recomendações e análises com inteligência artificial' },
              { icon: MessageCircle, title: 'Chat Integrado', desc: 'Comunicação direta com seus clientes' },
              { icon: Shield, title: 'Segurança Total', desc: 'Dados protegidos com criptografia avançada' },
              { icon: Cloud, title: 'Cloud 24/7', desc: 'Seu sistema sempre online e disponível' },
              { icon: Lock, title: 'Autenticação', desc: 'Login seguro com Google ou email' },
              { icon: Clock, title: 'Agendamento', desc: 'Sistema de agendamento inteligente' },
              { icon: CreditCard, title: 'Pagamentos', desc: 'Múltiplas formas de pagamento integradas' },
              { icon: Users, title: 'CRM Completo', desc: 'Gestão de relacionamento com clientes' },
              { icon: TrendingUp, title: 'Analíticas', desc: 'Relatórios detalhados e gráficos de vendas' },
              { icon: Globe, title: 'Multi-plataforma', desc: 'Funciona em qualquer dispositivo' },
              { icon: Cpu, title: 'Automação', desc: 'Automatize tarefas repetitivas' },
              { icon: Rocket, title: 'Performance', desc: 'Carregamento rápido e otimizado' },
              { icon: Star, title: 'Suporte VIP', desc: 'Suporte dedicado 24 horas por dia' },
            ].map((feature, i) => (
              <motion.div key={i} {...stagger} transition={{ delay: i * 0.05 }}
                className="bg-glass hover:bg-glass-hover rounded-xl p-4 border border-gold/5 hover:border-gold/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-3 group-hover:bg-gold/20 transition-all">
                  <feature.icon className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-white text-sm font-semibold mb-1">{feature.title}</h4>
                <p className="text-gray-500 text-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-yellow-500/5 to-gold/10" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeUp}>
            <Rocket className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="text-white">Pronto para </span>
              <span className="text-gradient">transformar seu negócio?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Não deixe para depois. Seus concorrentes já estão se digitalizando. 
              Seja o primeiro da sua região a oferecer uma experiência digital incrível 
              para seus clientes. <span className="text-gold font-semibold">Venda mais, cresça mais, seja mais.</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://www.instagram.com/devpro737/" target="_blank" rel="noopener noreferrer"
                className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-gold text-black font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center gap-2">
                Fale Conosco
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link to="/testar" className="group px-8 py-4 border border-gold/30 text-gold font-bold rounded-xl text-lg hover:bg-gold/10 transition-all flex items-center gap-2">
                Testar Gratuitamente
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Need Truck icon
function Truck(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 17H3V5h11v4h2.5l3 3v5h-1.5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg> }
