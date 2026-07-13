import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Package, MessageCircle, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'text-yellow-400' },
  in_progress: { label: 'Em Andamento', color: 'text-blue-400' },
  completed: { label: 'Concluído', color: 'text-green-400' },
  cancelled: { label: 'Cancelado', color: 'text-red-400' },
};

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOrder, setChatOrder] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgText, setMsgText] = useState('');

  useEffect(() => {
    api.getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, []);

  const openChat = async (orderId: number) => {
    setChatOrder(orderId);
    const msgs = await api.getMessages(orderId);
    setMessages(msgs);
  };

  const sendMessage = async () => {
    if (!msgText.trim() || !chatOrder) return;
    const msgs = await api.sendMessage(chatOrder, msgText);
    setMessages(msgs);
    setMsgText('');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-gold/5 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h1 className="text-3xl md:text-5xl font-black mb-8 text-center">
          <span className="text-white">Meus </span>
          <span className="text-gradient">Pedidos</span>
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-glass rounded-2xl border border-gold/10">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pedido ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-glass rounded-xl border border-gold/10 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-white font-semibold">{order.name}</div>
                      <div className="text-gray-500 text-sm">Empresa: {order.company || 'N/A'}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMap[order.status]?.color} bg-white/5`}>
                      {statusMap[order.status]?.label}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="text-gray-500">Tipo: <span className="text-white">{order.type === 'site' ? 'Site' : order.type === 'app_mobile' ? 'App Mobile' : 'App Desktop'}</span></div>
                    <div className="text-gray-500">Telefone: <span className="text-white">{order.phone}</span></div>
                    <div className="text-gray-500">Entrega: <span className="text-white">{order.deliveryTime}</span></div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{order.description}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openChat(order.id)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-gold/30 rounded-lg text-gold text-sm hover:bg-gold/10 transition-all">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                    <span className="text-[10px] text-gray-600">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {chatOrder === order.id && (
                  <div className="border-t border-gold/10">
                    <div className="h-60 overflow-y-auto p-4 space-y-3">
                      {messages.map((msg: any, i: number) => (
                        <div key={i} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                            msg.isAdmin
                              ? 'bg-gold/10 text-gold border border-gold/20'
                              : 'bg-white/10 text-white'
                          }`}>
                            <div className="text-[10px] text-gray-500 mb-1">
                              {msg.isAdmin ? 'Admin' : 'Você'} - {new Date(msg.createdAt).toLocaleTimeString('pt-BR')}
                            </div>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 p-4 border-t border-gold/10">
                      <input value={msgText} onChange={e => setMsgText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        className="flex-1 bg-white/5 border border-gold/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-gold/40"
                        placeholder="Digite sua mensagem..." />
                      <button onClick={sendMessage}
                        className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-gold text-black font-semibold rounded-xl text-sm">
                        Enviar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
