import { CATEGORIES } from '../types';

interface Props {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryChips({ selected, onSelect }: Props) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = cat === 'Todos' ? selected === null : selected === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelect(cat === 'Todos' ? null : cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat === 'Todos' ? 'Todos' : cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
