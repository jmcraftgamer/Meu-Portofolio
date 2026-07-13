import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos, categorias, marcas..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-white/30 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-white focus:ring-4 focus:ring-white/20 text-base shadow-sm transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-800 transition-colors text-sm"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
