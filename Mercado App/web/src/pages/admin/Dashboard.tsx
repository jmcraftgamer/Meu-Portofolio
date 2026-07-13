import { useState, useEffect } from 'react';
import { Order, STATUS_LABELS } from '../../types';
import { orders as ordersApi } from '../../services/api';

export default function AdminDashboard() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    ordersApi.list()
      .then(setOrderList)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await ordersApi.updateStatus(id, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const statusFlow = ['pending', 'preparing', 'out_for_delivery', 'delivered'] as const;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    preparing: 'bg-blue-100 text-blue-800 border-blue-300',
    out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  const getNextStatus = (current: string) => {
    const idx = statusFlow.indexOf(current as any);
    if (idx >= 0 && idx < statusFlow.length - 1) return statusFlow[idx + 1];
    return null;
  };

  const pendingCount = orderList.filter((o) => o.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
          <p className="text-gray-500">Gerenciamento de pedidos e produtos</p>
        </div>
        <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-medium">
          {pendingCount} pedido(s) pendente(s)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <a href="/admin/pedidos" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-primary-500">
          <h3 className="font-semibold text-gray-800">Pedidos</h3>
          <p className="text-sm text-gray-500">Gerenciar, notificar entrega e chat</p>
        </a>
        <a href="/admin/produtos" className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-800">Produtos</h3>
          <p className="text-sm text-gray-500">Gerenciar catalogo</p>
        </a>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <h3 className="font-semibold text-gray-800">{pendingCount}</h3>
          <p className="text-sm text-gray-500">Pedido(s) pendente(s)</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Pedidos Recentes</h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="bg-gray-200 h-4 rounded mb-2 w-1/3" />
              <div className="bg-gray-200 h-4 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : orderList.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum pedido recebido</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orderList.map((order) => {
            const next = getNextStatus(order.status);
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-4 border-l-4"
                style={{
                  borderLeftColor:
                    order.status === 'pending' ? '#f59e0b' :
                    order.status === 'preparing' ? '#3b82f6' :
                    order.status === 'out_for_delivery' ? '#8b5cf6' :
                    order.status === 'delivered' ? '#10b981' : '#ef4444'
                }}
              >
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">Pedido #{order.id}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.product_name} x{item.quantity}</span>
                      <span className="text-gray-800">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-2 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <p>Cliente ID: {order.user_id}</p>
                    <p>Tel: {order.phone}</p>
                    <p className="truncate max-w-xs">{order.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600 text-lg">R$ {order.total.toFixed(2)}</p>
                    {next && order.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(order.id, next)}
                        className="mt-2 bg-primary-600 text-white text-sm px-4 py-1.5 rounded hover:bg-primary-700 transition-colors"
                      >
                        Avancar para &quot;{STATUS_LABELS[next]}&quot;
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => updateStatus(order.id, 'cancelled')}
                        className="mt-1 ml-2 text-red-500 text-xs hover:underline"
                      >
                        Cancelar pedido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
