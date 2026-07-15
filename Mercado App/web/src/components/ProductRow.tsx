import { useRef, useState } from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface Props {
  title: string;
  products: Product[];
  loading?: boolean;
}

export default function ProductRow({ title, products, loading }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const handleAdd = (product: Product) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const getPrice = (p: Product) => (p.is_promotion && p.promo_price ? p.promo_price : p.price);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 bg-white rounded-xl shadow-md p-3 animate-pulse">
              <div className="bg-gray-200 h-36 rounded-lg mb-3" />
              <div className="bg-gray-200 h-3 rounded mb-2" />
              <div className="bg-gray-200 h-3 w-2/3 rounded mb-3" />
              <div className="bg-gray-200 h-5 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-2"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-48 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
            >
              <div className="h-36 bg-gray-50 relative overflow-hidden">
                <img
                  src={product.image || '/images/arroz.png'}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/arroz.png'; }}
                />
                {product.is_promotion && (
                  <span className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    -{product.promo_price ? Math.round((1 - product.promo_price / product.price) * 100) : 0}%
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 leading-tight line-clamp-2 mb-1">
                  {product.name}
                </h3>
                {product.is_promotion && product.promo_price ? (
                  <div>
                    <span className="text-gray-400 text-xs line-through">R$ {product.price.toFixed(2)}</span>
                    <span className="text-primary-600 font-bold text-base block">R$ {product.promo_price.toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="text-gray-800 font-bold text-base">R$ {product.price.toFixed(2)}</span>
                )}
                <button
                  onClick={() => handleAdd(product)}
                  disabled={product.stock === 0}
                  className={`w-full mt-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    addedId === product.id
                      ? 'bg-green-500 text-white'
                      : product.stock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95'
                  }`}
                >
                  {addedId === product.id ? 'Adicionado!' : product.stock === 0 ? 'Indisponivel' : 'Adicionar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
