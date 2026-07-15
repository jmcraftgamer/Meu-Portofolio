import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const effectivePrice = product.is_promotion && product.promo_price
    ? product.promo_price
    : product.price;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const base = import.meta.env.BASE_URL;
  const imgSrc = product.image
    ? `${base}${product.image.replace(/^\//, '')}`
    : `${base}images/arroz.png`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group">
      <div className="relative bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `${base}images/arroz.png`;
          }}
        />
        {product.is_promotion && (
          <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {product.promo_price ? `-${Math.round((1 - product.promo_price / product.price) * 100)}%` : 'PROMO'}
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            So {product.stock}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs mb-3 line-clamp-1">{product.category}</p>

        <div className="mt-auto">
          {product.is_promotion && product.promo_price ? (
            <div className="mb-2">
              <span className="text-gray-400 text-xs line-through">R$ {product.price.toFixed(2)}</span>
              <span className="text-primary-600 font-bold text-xl block">R$ {product.promo_price.toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-gray-800 font-bold text-xl mb-2 block">R$ {product.price.toFixed(2)}</span>
          )}

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                -
              </button>
              <span className="px-3 py-1.5 text-sm font-semibold text-gray-700 border-x border-gray-200">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                added
                  ? 'bg-green-500 text-white'
                  : product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95 shadow-sm'
              }`}
            >
              {added ? (
                <span className="flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  OK
                </span>
              ) : product.stock === 0 ? (
                'Indisponivel'
              ) : (
                'Adicionar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
