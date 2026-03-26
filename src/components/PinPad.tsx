import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function PinPad() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const setViewMode = useStore((s) => s.setViewMode);

  const handleDigit = (d: string) => {
    setError(false);
    const next = pin + d;
    if (next.length === 4) {
      if (next === '1234') {
        setViewMode('parent');
      } else {
        setError(true);
        setTimeout(() => { setPin(''); setError(false); }, 600);
      }
    }
    setPin(next.slice(0, 4));
  };

  const handleDelete = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-cookie-light to-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl mb-4"
      >
        🍪
      </motion.div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Praise</h1>
      <p className="text-gray-500 mb-8 text-sm">Enter parent PIN to continue</p>

      <div className="flex gap-3 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={error ? { x: [0, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`w-4 h-4 rounded-full transition-colors ${
              pin.length > i
                ? error
                  ? 'bg-red-400'
                  : 'bg-cookie'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 w-64">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(String(d))}
            className="h-14 rounded-2xl bg-white shadow-sm text-xl font-bold text-gray-700 active:bg-cookie-light active:scale-95 transition-all"
          >
            {d}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleDigit('0')}
          className="h-14 rounded-2xl bg-white shadow-sm text-xl font-bold text-gray-700 active:bg-cookie-light active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="h-14 rounded-2xl text-gray-400 text-lg active:scale-95 transition-all"
        >
          ⌫
        </button>
      </div>

      <button
        onClick={() => setViewMode('kid')}
        className="mt-8 text-sm text-cookie-dark font-semibold"
      >
        I'm a kid — skip PIN →
      </button>
    </div>
  );
}
