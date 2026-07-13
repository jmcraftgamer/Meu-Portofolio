import { useState, useEffect } from 'react';
import { Order, STATUS_LABELS } from '../types';
import { orders as ordersApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ChatBox from '../components/ChatBox';

export default function MyOrders() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOrderId, setChatOrderId] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      ordersApi.list()
        .then(setOrderList)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
        <p>Faca login para ver seus pedidos</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    out_for_delivery: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Pedidos</h1>

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
          <p className="text-lg">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orderList.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-500">Pedido #{order.id}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
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
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary-600">R$ {order.total.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-400 space-y-1">
                <p>Entrega: {order.address}</p>
                <p>Telefone: {order.phone}</p>
                {order.troco && <p>Troco para: R$ {order.troco}</p>}
                {order.notes && <p className="italic">Obs: {order.notes}</p>}
              </div>
              <div className="mt-3">
                <button
                  onClick={() => setChatOrderId(chatOrderId === order.id ? null : order.id)}
                  className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                    chatOrderId === order.id
                      ? 'bg-primary-50 text-primary-700 border-primary-300'
                      : 'text-gray-500 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {chatOrderId === order.id ? 'Fechar chat' : 'Falar com atendente'}
                </button>
              </div>
              {chatOrderId === order.id && (
                <div className="mt-3">
                  <ChatBox orderId={order.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
