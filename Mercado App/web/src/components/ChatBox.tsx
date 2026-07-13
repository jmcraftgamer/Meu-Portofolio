import { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { chat as chatApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  orderId: number;
}

export default function ChatBox({ orderId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const fetchMessages = async () => {
    try {
      const data = await chatApi.list(orderId);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const timer = setInterval(fetchMessages, 5000);
    return () => clearInterval(timer);
  }, [orderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const msg = await chatApi.send(orderId, text.trim());
      setMessages((prev) => [...prev, msg]);
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border rounded-lg bg-gray-50 flex flex-col h-72">
      <div className="bg-primary-600 text-white text-sm font-medium px-3 py-2 rounded-t-lg flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat com suporte
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="text-center text-gray-400 text-sm py-8">Carregando...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            Nenhuma mensagem ainda. Envie sua duvida!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_role === user?.role;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    isMe
                      ? 'bg-primary-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-700 border rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                    {!isMe && (
                      <span className="ml-1 text-gray-300">
                        {msg.sender_role === 'admin' ? '(Admin)' : '(Cliente)'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-2 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
