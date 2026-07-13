import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { products as productsApi } from '../services/api';
import MainBanner from '../components/MainBanner';
import SearchBar from '../components/SearchBar';
import AnimatedCarousel from '../components/AnimatedCarousel';
import CategoryChips from '../components/CategoryChips';
import ProductRow from '../components/ProductRow';
import PromoBanner from '../components/PromoBanner';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    productsApi.list()
      .then(setProductList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let list = productList;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filter) {
      const catMap: Record<string, string[]> = {
        Mercearia: ['Mercearia'],
        Hortifruit: ['Hortifruit'],
        Acougue: ['Acougue'],
        Padaria: ['Padaria'],
        Bebidas: ['Bebidas'],
        Biscoitos: ['Biscoitos'],
        Higiene: ['Higiene'],
        Limpeza: ['Limpeza'],
        Utilidades: ['Utilidades'],
        Outros: ['Outros'],
      };
      const mapped = catMap[filter];
      if (mapped) {
        list = list.filter((p) => mapped.includes(p.category));
      }
    }

    return list;
  }, [productList, filter, searchQuery]);

  const featuredProducts = useMemo(
    () => [...productList].sort(() => Math.random() - 0.5).slice(0, 10),
    [productList]
  );

  const bestSellers = useMemo(
    () => [...productList].sort(() => Math.random() - 0.5).slice(0, 10),
    [productList]
  );

  return (
    <div className="pb-8">
      <MainBanner />
      <SearchBar onSearch={setSearchQuery} />
      <AnimatedCarousel />
      <CategoryChips selected={filter} onSelect={(cat) => { setFilter(cat); setSearchQuery(''); }} />

      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-gray-500 text-sm">
            Resultados para: <span className="font-medium text-gray-700">&quot;{searchQuery}&quot;</span>
            <span className="ml-2 text-gray-400">({filteredProducts.length} produtos)</span>
          </p>
        </div>
      )}

      {!searchQuery && !filter && (
        <>
          <ProductRow title="Destaques" products={featuredProducts} loading={loading} />
          <ProductRow title="Mais Vendidos" products={bestSellers} loading={loading} />
          <PromoBanner products={productList} />
        </>
      )}

      {filter && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{filter}</h2>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded mb-4" />
                <div className="bg-gray-200 h-4 rounded mb-2" />
                <div className="bg-gray-200 h-4 w-2/3 rounded mb-4" />
                <div className="bg-gray-200 h-6 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4 text-gray-300">[ : ]</div>
            <p className="text-lg font-medium">Nenhum produto encontrado</p>
            <p className="text-sm mt-1">Tente buscar por outro termo ou categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
