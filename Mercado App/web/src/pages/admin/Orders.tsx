import { useState, useEffect } from 'react';
import { Order, STATUS_LABELS } from '../../types';
import { orders as ordersApi } from '../../services/api';
import ChatBox from '../../components/ChatBox';

export default function AdminOrders() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOrderId, setChatOrderId] = useState<number | null>(null);

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

  const statusIcons: Record<string, string> = {
    pending: '',
    preparing: '',
    out_for_delivery: '',
    delivered: '',
  };

  const getNextStatus = (current: string) => {
    const idx = statusFlow.indexOf(current as any);
    if (idx >= 0 && idx < statusFlow.length - 1) return statusFlow[idx + 1];
    return null;
  };

  const pendingCount = orderList.filter((o) => o.status === 'pending').length;

  const orderStatusOptions = [
    { value: 'pending', label: 'Pendente', color: 'bg-yellow-500' },
    { value: 'preparing', label: 'Em separacao', color: 'bg-blue-500' },
    { value: 'out_for_delivery', label: 'Saiu para entrega', color: 'bg-purple-500' },
    { value: 'delivered', label: 'Entregue', color: 'bg-green-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Pedidos</h1>
          <p className="text-gray-500">Acompanhe, notifique entrega e converse com clientes</p>
        </div>
        <a href="/admin/produtos" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          Gerenciar Produtos
        </a>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {orderStatusOptions.map((opt) => (
          <div key={opt.value} className={`${opt.color} bg-opacity-10 rounded-lg p-4 border border-opacity-20 ${opt.color.replace('bg-', 'border-')}`}>
            <div className={`w-3 h-3 rounded-full ${opt.color} mb-2`} />
            <p className="text-2xl font-bold text-gray-800">
              {orderList.filter((o) => o.status === opt.value).length}
            </p>
            <p className="text-sm text-gray-500">{opt.label}</p>
          </div>
        ))}
      </div>

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
              <div key={order.id} className="bg-white rounded-lg shadow-md border-l-4 overflow-hidden"
                style={{
                  borderLeftColor:
                    order.status === 'pending' ? '#f59e0b' :
                    order.status === 'preparing' ? '#3b82f6' :
                    order.status === 'out_for_delivery' ? '#8b5cf6' :
                    order.status === 'delivered' ? '#10b981' : '#ef4444'
                }}
              >
                <div className="p-4">
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

                  <div className="border-t pt-2 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                      <p><span className="font-medium">Nome:</span> {order.delivery_name || `Cliente #${order.user_id}`}</p>
                      <p><span className="font-medium">Tel:</span> {order.phone}</p>
                      <p><span className="font-medium">Endereco:</span> {order.address}</p>
                      {order.troco && <p><span className="font-medium">Troco para:</span> R$ {order.troco}</p>}
                      {order.notes && <p className="text-gray-400 italic mt-1">Obs: {order.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600 text-lg">R$ {order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="border-t mt-3 pt-3 flex flex-wrap items-center gap-2">
                    {next && order.status !== 'cancelled' && (
                      <button
                        onClick={() => updateStatus(order.id, next)}
                        className="bg-primary-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        {next === 'out_for_delivery' ? 'Notificar entrega' : `Avancar: ${STATUS_LABELS[next]}`}
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => updateStatus(order.id, 'cancelled')}
                        className="text-red-500 text-sm px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        Cancelar pedido
                      </button>
                    )}
                    <button
                      onClick={() => setChatOrderId(chatOrderId === order.id ? null : order.id)}
                      className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                        chatOrderId === order.id
                          ? 'bg-primary-50 text-primary-700 border-primary-300'
                          : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {chatOrderId === order.id ? 'Fechar chat' : 'Chat'}
                    </button>
                  </div>
                </div>

                {chatOrderId === order.id && (
                  <div className="border-t px-4 pb-4 pt-2">
                    <ChatBox orderId={order.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
