import { useState, useEffect } from 'react';

const base = import.meta.env.BASE_URL;
const items = [
  { image: `${base}images/FitaMerceria.png`, label: 'Mercearia' },
  { image: `${base}images/FitaHortifruit.png`, label: 'Hortifruti' },
  { image: `${base}images/FitaAçougue.png`, label: 'Acougue' },
  { image: `${base}images/FitaBebidas.png`, label: 'Bebidas' },
  { image: `${base}images/FitaHegiene.png`, label: 'Higiene' },
  { image: `${base}images/FitaLimpeza.png`, label: 'Limpeza' },
];

export default function AnimatedCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="relative overflow-hidden rounded-xl shadow-md">
          <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
            {items.map((item, idx) => (
              <div key={idx} className="min-w-full relative">
                <div className="flex items-center justify-center bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === current ? 'bg-primary-600 w-5' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
