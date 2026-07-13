import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
const cartBase = import.meta.env.BASE_URL;

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">[  ]</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Carrinho vazio</h2>
        <p className="text-gray-500 mb-4">Adicione produtos para comecar</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Ver Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Carrinho de Compras</h1>

      <div className="space-y-4">
        {items.map((item) => {
          const price = item.product.is_promotion && item.product.promo_price
            ? item.product.promo_price
            : item.product.price;

          return (
            <div key={item.product.id} className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src={item.product.image ? `${cartBase}${item.product.image.replace(/^\//, '')}` : `${cartBase}images/arroz.jpg`}
                  alt={item.product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = `${cartBase}images/arroz.jpg`; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">{item.product.name}</h3>
                <p className="text-primary-600 font-bold">R$ {price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="text-right w-24">
                <p className="font-bold text-gray-800">R$ {(price * item.quantity).toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeItem(item.product.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-primary-600">R$ {totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={() => {
            if (!user) {
              navigate('/login');
              return;
            }
            navigate('/checkout');
          }}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-primary-700 transition-colors"
        >
          {user ? 'Finalizar Pedido' : 'Faca login para finalizar'}
        </button>
      </div>
    </div>
  );
}
