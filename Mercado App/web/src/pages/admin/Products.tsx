import { useState, useEffect } from 'react';
import { Product, CATEGORIES } from '../../types';
import { products as productsApi } from '../../services/api';


export default function AdminProducts() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', promo_price: '', category: 'Mercearia',
    image: '', is_promotion: false, stock: '',
  });

  const fetchProducts = () => {
    productsApi.list()
      .then(setProductList)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', promo_price: '', category: 'Mercearia', image: '', is_promotion: false, stock: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      promo_price: product.promo_price ? product.promo_price.toString() : '',
      category: product.category,
      image: product.image,
      is_promotion: product.is_promotion === 1,
      stock: product.stock.toString(),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        promo_price: form.promo_price ? parseFloat(form.promo_price) : null,
        stock: parseInt(form.stock) || 0,
      };
      if (editingId) {
        await productsApi.update(editingId, data);
      } else {
        await productsApi.create(data);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja remover este produto?')) {
      try {
        await productsApi.delete(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h1>
          <p className="text-gray-500">{productList.length} produto(s) cadastrado(s)</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Novo Produto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descricao</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preco (R$)</label>
              <input
                type="number" step="0.01" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preco Promocional (R$)</label>
              <input
                type="number" step="0.01" value={form.promo_price}
                onChange={(e) => setForm({ ...form, promo_price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
              <input
                type="number" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_promotion}
                  onChange={(e) => setForm({ ...form, is_promotion: e.target.checked })}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Produto em promocao</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                {editingId ? 'Atualizar Produto' : 'Cadastrar Produto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="bg-gray-200 h-4 rounded mb-2 w-1/3" />
              <div className="bg-gray-200 h-4 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productList.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image || '/images/arroz.png'}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/arroz.png'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-primary-600">
                    R$ {(product.is_promotion && product.promo_price ? product.promo_price : product.price).toFixed(2)}
                  </span>
                  {product.is_promotion && <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded">PROMO</span>}
                  <span className="text-xs text-gray-400">Estoque: {product.stock}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => openEdit(product)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
