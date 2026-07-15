import { useState, useEffect } from 'react';
import { Product } from '../types';

interface Props {
  products: Product[];
}

export default function PromoBanner({ products }: Props) {
  const [currentPromo, setCurrentPromo] = useState(0);

  const promos = products.filter((p) => p.is_promotion && p.promo_price);

  useEffect(() => {
    if (promos.length === 0) return;
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % Math.min(promos.length, 3));
    }, 4000);
    return () => clearInterval(timer);
  }, [promos.length]);

  if (promos.length === 0) return null;

  const visiblePromos = promos.slice(0, 3);

  return (
    <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="relative">
            <div className="inline-block bg-white/15 backdrop-blur-sm rounded-full px-4 py-1 mb-3 border border-white/20">
              <span className="text-xs font-medium">[ OFERTAS ESPECIAIS ]</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
              Promocoes Imperdiveis
            </h2>
            <p className="text-primary-100 text-base max-w-md">
              Aproveite descontos especiais em produtos selecionados. Estoque limitado!
            </p>
            <div className="mt-4 flex gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center border border-white/20">
                <span className="text-2xl font-bold block">{promos.length}</span>
                <span className="text-xs text-primary-100">Produtos em oferta</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center border border-white/20">
                <span className="text-2xl font-bold block block">
                  {Math.max(...promos.map((p) => Math.round((1 - (p.promo_price || 0) / p.price) * 100)))}
                </span>
                <span className="text-xs text-primary-100">Max desconto</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="relative overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentPromo * 100}%)` }}
                >
                  {visiblePromos.map((promo, idx) => {
                    const discount = Math.round((1 - (promo.promo_price || 0) / promo.price) * 100);
                    return (
                      <div key={idx} className="min-w-full flex items-center gap-4 p-3">
                        <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={promo.image || '/images/arroz.png'}
                            alt={promo.name}
                            className="w-full h-full object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/arroz.png'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full mb-1">
                            -{discount}%
                          </div>
                          <h4 className="font-semibold text-sm truncate">{promo.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/60 text-xs line-through">R$ {promo.price.toFixed(2)}</span>
                            <span className="text-yellow-300 font-bold text-lg">R$ {promo.promo_price?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-1.5 mt-3">
                {visiblePromos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPromo(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentPromo ? 'bg-white w-5' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
