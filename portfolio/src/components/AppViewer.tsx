import { useEffect, useState } from 'react';
import { ArrowLeft, AlertTriangle, Smartphone, Monitor } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AppViewerProps {
  name: string;
  icon: string;
  gradient: string;
  htmlPath: string;
}

export default function AppViewer({ name, icon, gradient, htmlPath }: AppViewerProps) {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [htmlContent, setHtmlContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneMode, setPhoneMode] = useState(searchParams.get('mode') === 'phone');
  const navigate = useNavigate();

  useEffect(() => {
    setState('loading');
    setErrorMsg('');

    fetch(htmlPath)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(html => {
        const baseUrl = htmlPath.substring(0, htmlPath.lastIndexOf('/') + 1);

        let processed = html;

        processed = processed.replace(/(src|href)=(['"])(?!https?:\/\/|\/\/|\/|data:|#|javascript:)/gi, (m, attr, quote) => {
          return `${attr}=${quote}${baseUrl}`;
        });

        processed = processed.replace(/url\(['"]?(?!https?:\/\/|data:)([^'")]+)['"]?\)/g, (m, p1) => {
          if (p1.startsWith('/') || p1.startsWith('#')) return m;
          return `url(${baseUrl}${p1})`;
        });

        const styleTag = `
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; overflow-x: hidden; }
        </style>
        `;

        processed = processed.replace('</head>', styleTag + '\n</head>');

        setHtmlContent(processed);
        setState('ready');
      })
      .catch(err => {
        setErrorMsg(err.message || 'Erro ao carregar');
        setState('error');
      });
  }, [htmlPath]);

  function renderIframe() {
    return (
      <iframe
        srcDoc={htmlContent}
        className="w-full h-full border-0"
        title={name}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        style={{ background: '#fff' }}
      />
    );
  }

  if (state === 'error') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0a0a0a' }}>
        <div className="flex items-center px-4 py-3" style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,215,0,0.15)' }}>
          <button onClick={() => navigate('/testar')} className="p-2 text-gray-400 hover:text-gold mr-3">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-semibold text-sm">{name}</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm px-6">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-gray-300 font-medium text-lg mb-2">Erro ao carregar app</p>
            <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0a0a0a' }}>
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,215,0,0.15)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/testar')} className="p-2 text-gray-400 hover:text-gold rounded-lg hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-sm`}>{icon}</div>
          <div>
            <div className="text-white font-semibold text-sm">{name}</div>
            {state === 'loading' && <div className="text-gray-500 text-xs">Carregando...</div>}
          </div>
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

      <div className="flex-1 relative flex items-center justify-center" style={{ background: '#1a1a1a' }}>
        {state === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center z-20" style={{ background: '#0a0a0a' }}>
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin w-10 h-10 border-2 border-gold border-t-transparent rounded-full" />
              <span className="text-gold text-sm">Carregando {name}...</span>
            </div>
          </div>
        )}
        {state === 'ready' && phoneMode ? (
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
            {renderIframe()}
          </div>
        ) : (
          <div className="w-full h-full">{renderIframe()}</div>
        )}
      </div>
    </div>
  );
}
