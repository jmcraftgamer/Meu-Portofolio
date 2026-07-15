import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  BarChart3, TrendingUp, ShoppingBag, Package,
  Clock, CheckCircle, Users, DollarSign, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const statusColor: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  in_progress: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  completed: 'text-green-400 bg-green-400/10 border-green-400/20',
  delivered: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};
const statusLabel: Record<string, string> = {
  pending: 'Pendente', in_progress: 'Em Andamento', completed: 'Concluído', delivered: 'Entregue', cancelled: 'Cancelado',
};

const typeLabel: Record<string, string> = { site: 'Site', app_mobile: 'App Mobile', app_desktop: 'App Desktop' };

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  const formatMonth = (m: string) => {
    const [ano, mes] = m.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${meses[parseInt(mes) - 1]}/${ano}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
    </div>
  );

  if (!stats) return null;

  const monthlyData = (stats.ordersByMonth || []).map((d: any) => ({
    name: formatMonth(d.month),
    Pedidos: d.count,
  }));

  const revenueMonthlyData = (stats.revenueByMonth || []).map((d: any) => ({
    name: formatMonth(d.month),
    Receita: d.revenue,
  }));

  const hourData = (stats.ordersByHour || []).map((d: any) => ({
    name: d.hour,
    Pedidos: d.count,
  }));

  const bestMonth = stats.bestMonth;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-gold/5 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black">
              <span className="text-white">Painel </span>
              <span className="text-gradient">Admin</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Visão geral do seu negócio</p>
          </div>
          <Link to="/admin/pedidos"
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-gold text-black font-bold rounded-xl text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-gold/20 transition-all">
            <Package className="w-4 h-4" /> Gerenciar Pedidos
          </Link>
        </div>

        {/* Top Cards: Total / Entregues / Pendentes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-glass rounded-xl p-6 border border-gold/10 relative overflow-hidden group hover:border-gold/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-gold" />
                </div>
              </div>
              <div className="text-3xl font-black text-white">{stats.totalOrders || 0}</div>
              <div className="text-gray-500 text-sm mt-1">Total de Pedidos</div>
            </div>
          </div>
          <div className="bg-glass rounded-xl p-6 border border-emerald-500/10 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-400">{stats.deliveredOrders || 0}</div>
              <div className="text-gray-500 text-sm mt-1">Pedidos Entregues</div>
            </div>
          </div>
          <div className="bg-glass rounded-xl p-6 border border-yellow-500/10 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-yellow-400">{stats.pendingOrders || 0}</div>
              <div className="text-gray-500 text-sm mt-1">Pedidos Pendentes</div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-glass rounded-xl p-6 border border-gold/10 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-gold flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-black" />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Receita Total de Pedidos Entregues</div>
                <div className="text-3xl md:text-4xl font-black text-gradient">
                  R$ {(stats.deliveredRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              {[{ type: 'site', label: 'Site', value: stats.revenueByType?.site || 0, color: 'text-gold' },
                { type: 'app_mobile', label: 'App Mobile', value: stats.revenueByType?.app_mobile || 0, color: 'text-blue-400' },
                { type: 'app_desktop', label: 'App Desktop', value: stats.revenueByType?.app_desktop || 0, color: 'text-purple-400' },
              ].map((item, i) => (
                <div key={i} className="text-center px-3 py-2 bg-white/5 rounded-lg border border-gold/5">
                  <div className={`text-xs ${item.color}`}>{item.label}</div>
                  <div className="text-white font-bold text-sm">R$ {item.value.toLocaleString('pt-BR')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order List */}
        <div className="bg-glass rounded-xl border border-gold/10 mb-6 overflow-hidden">
          <div className="p-5 border-b border-gold/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gold" />
              <h3 className="text-white font-semibold">Pedidos Recentes</h3>
            </div>
            <Link to="/admin/pedidos" className="text-gold text-sm hover:underline">Ver todos</Link>
          </div>
          <div className="divide-y divide-gold/5 max-h-96 overflow-y-auto">
            {(stats.orders || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">Nenhum pedido ainda.</div>
            ) : (stats.orders || []).slice(0, 20).map((order: any) => (
              <div key={order.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold text-xs font-bold">#{order.id}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">{order.name || 'Sem nome'}</div>
                      <div className="text-gray-500 text-xs truncate">{order.userName} • {typeLabel[order.type] || order.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-white text-xs font-bold">R$ {(order.value || 0).toFixed(2)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor[order.status] || 'text-gray-400 bg-white/5'}`}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </div>
                </div>
                {order.description && (
                  <p className="text-gray-600 text-xs mt-1.5 truncate ml-11">{order.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Orders Bar Chart */}
          <div className="bg-glass rounded-xl p-6 border border-gold/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gold" />
                Pedidos por Mês
              </h3>
              {stats.ordersThisMonth !== undefined && (
                <span className="text-xs text-gold bg-gold/10 px-2 py-1 rounded-full">
                  {stats.ordersThisMonth} este mês
                </span>
              )}
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,215,0,0.08)" />
                <XAxis dataKey="name" stroke="#555" fontSize={11} tickMargin={8} />
                <YAxis stroke="#555" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="Pedidos" fill="#FFD700" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Month */}
          <div className="bg-glass rounded-xl p-6 border border-gold/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold" />
              Receita por Mês
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueMonthlyData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,215,0,0.08)" />
                <XAxis dataKey="name" stroke="#555" fontSize={11} tickMargin={8} />
                <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(v: any) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Receita']}
                />
                <Area type="monotone" dataKey="Receita" stroke="#FFD700" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Best Month Highlight */}
          <div className="bg-glass rounded-xl p-6 border border-gold/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gold" />
              Melhor Mês para Vendas
            </h3>
            {bestMonth ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-5xl font-black text-gradient mb-2">{formatMonth(bestMonth.month)}</div>
                <div className="text-gray-400 text-sm mb-4">{bestMonth.count} pedidos neste mês</div>
                <div className="w-full bg-white/5 rounded-full h-2 max-w-xs">
                  <div className="bg-gradient-to-r from-yellow-400 to-gold h-2 rounded-full" style={{ width: '100%' }} />
                </div>
                <p className="text-gray-500 text-xs mt-3">Mês com maior volume de pedidos</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">Nenhum dado disponível</div>
            )}
          </div>

          {/* Time of Day Chart */}
          <div className="bg-glass rounded-xl p-6 border border-gold/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              Horários de Pico (quando mais pedem)
            </h3>
            {hourData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={hourData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,215,0,0.08)" />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} tickMargin={8} interval={2} />
                  <YAxis stroke="#555" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    labelFormatter={(label) => `${label} hrs`}
                  />
                  <Bar dataKey="Pedidos" fill="#FFD700" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-10 text-gray-500 text-sm">Nenhum dado disponível</div>
            )}
          </div>
        </div>

        {/* Totals Footer */}
        <div className="bg-glass rounded-xl p-5 border border-gold/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-gray-500 text-xs">Total de Pedidos</div>
              <div className="text-xl font-bold text-white">{stats.totalOrders || 0}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Entregues</div>
              <div className="text-xl font-bold text-emerald-400">{stats.deliveredOrders || 0}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Receita Total</div>
              <div className="text-xl font-bold text-gold">R$ {(stats.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Receita de Entregues</div>
              <div className="text-xl font-bold text-gold">R$ {(stats.deliveredRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
