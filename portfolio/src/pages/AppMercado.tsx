import { useState } from 'react';
import { ArrowLeft, Smartphone, Monitor } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AppMercado() {
  const [searchParams] = useSearchParams();
  const [phoneMode, setPhoneMode] = useState(searchParams.get('mode') === 'phone');
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0a0a0a' }}>
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,215,0,0.15)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/testar')} className="p-2 text-gray-400 hover:text-gold rounded-lg hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-yellow-500 flex items-center justify-center text-sm">🛒</div>
          <div className="text-white font-semibold text-sm">Mercado Digital</div>
        </div>
        <button
          onClick={() => setPhoneMode(!phoneMode)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: phoneMode ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.08)',
            color: phoneMode ? '#FFD700' : '#999',
            border: `1px solid ${phoneMode ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          {phoneMode ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          <span>{phoneMode ? 'Celular' : 'PC'}</span>
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center" style={{ background: '#1a1a1a' }}>
        {phoneMode ? (
          <div
            className="overflow-hidden"
            style={{
              width: 'min(393px, 100vw - 20px)',
              height: 'min(852px, 100vh - 20px)',
              borderRadius: 44,
              boxShadow: '0 0 0 2px rgba(255,255,255,0.06), 0 0 0 6px rgba(0,0,0,0.4), 0 30px 80px rgba(0,0,0,0.6)',
              background: '#fff',
            }}
          >
            <iframe
              src="/apps/mercado/web/"
              className="w-full h-full border-0"
              title="Mercado Digital"
            />
          </div>
        ) : (
          <iframe
            src="/apps/mercado/web/"
            className="w-full h-full border-0"
            title="Mercado Digital"
            style={{ background: '#fff' }}
          />
        )}
      </div>
    </div>
  );
}
