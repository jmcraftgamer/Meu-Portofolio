import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <div className="text-green-500 text-6xl mb-4">[ V ]</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h1>
        <p className="text-gray-500 mb-6">
          Seu pedido foi registrado com sucesso. Acompanhe o status pelo seu painel.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Voltar as Compras
          </Link>
        </div>
      </div>
    </div>
  );
}
