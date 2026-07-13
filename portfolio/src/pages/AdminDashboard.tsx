import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  BarChart3, TrendingUp, ShoppingBag, Package,
  Clock, CheckCircle, Users, ArrowUp, ArrowDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#FFD700', '#FFC107', '#FFB300', '#FFA000', '#FF8F00'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
    </div>
  );

  if (!stats) return null;

  const monthlyData = (stats.ordersByMonth || []).map((d: any) => ({
    name: `Mês ${d.month}`,
    vendas: d.count,
  }));

  const typeData = (stats.ordersByType || []).map((d: any) => ({
    name: d.type === 'site' ? 'Site' : d.type === 'app_mobile' ? 'App Mobile' : 'App Desktop',
    value: d.count,
  }));

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-gold/5 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-black">
            <span className="text-white">Painel </span>
            <span className="text-gradient">Admin</span>
          </h1>
          <Link to="/admin/pedidos"
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-gold text-black font-bold rounded-xl text-sm flex items-center gap-2">
            <Package className="w-4 h-4" /> Gerenciar Pedidos
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: ShoppingBag, label: 'Pedidos Totais', value: stats.totalOrders || 0, color: 'text-gold' },
            { icon: Clock, label: 'Pendentes', value: stats.pendingOrders || 0, color: 'text-yellow-400' },
            { icon: TrendingUp, label: 'Em Andamento', value: stats.inProgressOrders || 0, color: 'text-blue-400' },
            { icon: CheckCircle, label: 'Concluídos', value: stats.completedOrders || 0, color: 'text-green-400' },
          ].map((card, i) => (
            <div key={i} className="bg-glass rounded-xl p-5 border border-gold/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <div className={`text-2xl font-black ${card.color}`}>{card.value}</div>
              <div className="text-gray-500 text-xs mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Chart */}
          <div className="bg-glass rounded-xl p-6 border border-gold/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gold" />
              Vendas por Mês
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,215,0,0.1)" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="vendas" fill="#FFD700" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-glass rounded-xl p-6 border border-gold/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gold" />
              Distribuição por Tipo
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {typeData.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
