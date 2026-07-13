import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orders as ordersApi } from '../services/api';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryName, setDeliveryName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [needsTroco, setNeedsTroco] = useState(false);
  const [trocoValue, setTrocoValue] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryName || !address || !phone) {
      setError('Nome, endereco e telefone sao obrigatorios');
      return;
    }
    setSubmitting(true);
    try {
      await ordersApi.create({
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        delivery_name: deliveryName,
        address,
        phone,
        troco: needsTroco ? trocoValue : '',
        notes,
      });
      clearCart();
      navigate('/pedido-sucesso');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/carrinho');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Dados de Entrega</h2>
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
                <input
                  type="text"
                  value={deliveryName}
                  onChange={(e) => setDeliveryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereco de entrega *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Rua, numero, bairro, cidade..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="(xx) xxxxx-xxxx"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precisa de troco?</label>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <input
                    type="checkbox"
                    checked={needsTroco}
                    onChange={(e) => { setNeedsTroco(e.target.checked); if (!e.target.checked) setTrocoValue(''); }}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  Sim, preciso de troco
                </label>
                {needsTroco && (
                  <input
                    type="text"
                    value={trocoValue}
                    onChange={(e) => setTrocoValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Quanto vai pagar? Ex: R$ 50,00"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observacoes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                  placeholder="Opcional: ponto de referencia, etc."
                />
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Resumo do Pedido</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => {
                const price = item.product.is_promotion && item.product.promo_price
                  ? item.product.promo_price
                  : item.product.price;
                return (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">R$ {(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="text-xl font-bold text-primary-600">R$ {totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-4 bg-primary-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400"
            >
              {submitting ? 'Enviando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
