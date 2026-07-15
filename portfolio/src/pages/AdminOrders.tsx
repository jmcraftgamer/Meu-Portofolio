import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { Package, MessageCircle, Clock, CheckCircle, XCircle, Send, Paperclip, Image, Mic, FileText } from 'lucide-react';

const statuses = [
  { value: 'pending', label: 'Pendente', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  { value: 'in_progress', label: 'Em Andamento', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  { value: 'completed', label: 'Concluído', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  { value: 'delivered', label: 'Entregue', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  { value: 'cancelled', label: 'Cancelado', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [chatOrder, setChatOrder] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgText, setMsgText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const loadOrders = async () => {
    try {
      setOrders(await api.getAdminOrders());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateStatus = async (id: number, status: string) => {
    await api.updateOrderStatus(id, status);
    loadOrders();
  };

  const openChat = async (orderId: number) => {
    if (chatOrder === orderId) { setChatOrder(null); return; }
    setChatOrder(orderId);
    setMessages(await api.getMessages(orderId));
  };

  const sendMessage = async () => {
    if (!msgText.trim() || !chatOrder) return;
    const msgs = await api.sendMessage(chatOrder, msgText);
    setMessages(msgs);
    setMsgText('');
  };

  const sendFile = async (input: HTMLInputElement | null, type: string) => {
    if (!input || !input.files?.length || !chatOrder) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const msgs = await api.sendMessage(chatOrder, file.name, type, dataUrl, file.type);
      setMessages(msgs);
    };
    reader.readAsDataURL(file);
    input.value = '';
  };

  const handleDeliver = async (id: number) => {
    await api.deliverOrder(id);
    loadOrders();
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-gold/5 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <h1 className="text-3xl md:text-4xl font-black mb-6">
          <span className="text-white">Gerenciar </span>
          <span className="text-gradient">Pedidos</span>
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {[{ value: 'all', label: 'Todos' }, ...statuses].map(s => (
            <button key={s.value} onClick={() => setFilter(s.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                filter === s.value
                  ? 'bg-gold text-black border-gold'
                  : 'text-gray-400 border-gold/10 hover:border-gold/30'
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-glass rounded-2xl border border-gold/10">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-glass rounded-xl border border-gold/10 overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">#{order.id}</span>
                        {order.delivered_at && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-full border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Entregue {new Date(order.delivered_at).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                        {order.delivery_confirmed_at && (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded-full border border-green-500/20">
                            Confirmado pelo cliente
                          </span>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {order.userName} • {order.userEmail} • {order.userPhone}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border appearance-none cursor-pointer outline-none ${
                          statuses.find(s => s.value === order.status)?.bg || 'bg-white/5'
                        } ${statuses.find(s => s.value === order.status)?.color || ''}`}>
                        {statuses.map(s => (
                          <option key={s.value} value={s.value} className="bg-[#0a0a0a]">{s.label}</option>
                        ))}
                      </select>
                      {order.status !== 'cancelled' && order.status !== 'completed' && order.status !== 'delivered' && (
                        <button onClick={() => handleDeliver(order.id)}
                          className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                          Marcar Entregue
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                    <div className="text-gray-500">Cliente: <span className="text-white">{order.name}</span></div>
                    <div className="text-gray-500">Empresa: <span className="text-white">{order.company || 'N/A'}</span></div>
                    <div className="text-gray-500">Telefone: <span className="text-white">{order.phone}</span></div>
                    <div className="text-gray-500">Tipo: <span className="text-white">
                      {order.type === 'site' ? 'Site' : order.type === 'app_mobile' ? 'App Mobile' : 'App Desktop'}
                    </span></div>
                    <div className="text-gray-500">Entrega: <span className="text-white">{order.deliveryTime}</span></div>
                    <div className="text-gray-500">Data: <span className="text-white">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span></div>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 border-l-2 border-gold/30 pl-3">{order.description}</p>

                  {order.features && (() => {
                    try {
                      const feats = JSON.parse(order.features);
                      if (Array.isArray(feats) && feats.length > 0) return (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {feats.map((f: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-gold/5 text-gold/80 text-[10px] rounded-full border border-gold/10">{f}</span>
                          ))}
                        </div>
                      );
                    } catch {}
                    return null;
                  })()}

                  <button onClick={() => openChat(order.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm transition-all ${
                      chatOrder === order.id
                        ? 'bg-gold text-black border-gold'
                        : 'border-gold/30 text-gold hover:bg-gold/10'
                    }`}>
                    <MessageCircle className="w-4 h-4" />
                    {chatOrder === order.id ? 'Fechar Chat' : `Chat com ${order.name}`}
                  </button>
                </div>

                {chatOrder === order.id && (
                  <div className="border-t border-gold/10">
                    <div className="h-72 overflow-y-auto p-4 space-y-3">
                      {messages.map((msg: any, i: number) => (
                        <div key={i} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                            msg.isAdmin
                              ? 'bg-gold/10 text-gold border border-gold/20'
                              : 'bg-white/10 text-white'
                          }`}>
                            <div className="text-[10px] text-gray-500 mb-1">
                              {msg.isAdmin ? 'Admin' : order.name} - {new Date(msg.createdAt).toLocaleString('pt-BR')}
                            </div>
                            {msg.type === 'image' && msg.file_data ? (
                              <img src={msg.file_data} alt={msg.text} className="max-w-full rounded-lg max-h-48 cursor-pointer" onClick={() => window.open(msg.file_data, '_blank')} />
                            ) : msg.type === 'audio' && msg.file_data ? (
                              <audio controls className="w-full max-w-xs">
                                <source src={msg.file_data} type={msg.file_type || 'audio/mpeg'} />
                              </audio>
                            ) : msg.type === 'file' && msg.file_data ? (
                              <a href={msg.file_data} download={msg.text} className="flex items-center gap-2 text-gold underline">
                                <FileText className="w-4 h-4" /> {msg.text}
                              </a>
                            ) : (
                              msg.text
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="flex gap-2 p-4 border-t border-gold/10">
                      <input type="file" ref={fileInputRef} className="hidden" onChange={() => sendFile(fileInputRef.current, 'file')} />
                      <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={() => sendFile(imageInputRef.current, 'image')} />
                      <input type="file" accept="audio/*" ref={audioInputRef} className="hidden" onChange={() => sendFile(audioInputRef.current, 'audio')} />
                      <div className="flex gap-1">
                        <button onClick={() => imageInputRef.current?.click()} className="p-2.5 bg-white/5 border border-gold/10 rounded-xl text-gold hover:bg-gold/10 transition-all" title="Enviar imagem">
                          <Image className="w-4 h-4" />
                        </button>
                        <button onClick={() => audioInputRef.current?.click()} className="p-2.5 bg-white/5 border border-gold/10 rounded-xl text-gold hover:bg-gold/10 transition-all" title="Enviar áudio">
                          <Mic className="w-4 h-4" />
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-white/5 border border-gold/10 rounded-xl text-gold hover:bg-gold/10 transition-all" title="Enviar arquivo">
                          <Paperclip className="w-4 h-4" />
                        </button>
                      </div>
                      <input value={msgText} onChange={e => setMsgText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        className="flex-1 bg-white/5 border border-gold/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-gold/40"
                        placeholder="Responder como admin..." />
                      <button onClick={sendMessage}
                        className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-gold text-black font-semibold rounded-xl text-sm flex items-center gap-1">
                        <Send className="w-3.5 h-3.5" /> Enviar
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
