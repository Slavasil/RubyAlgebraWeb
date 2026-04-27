import React, { useEffect, useMemo, useState } from 'react';

const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export default function PolynomialPanel() {
  const [input, setInput] = useState('');
  const [variable, setVariable] = useState('x');

  const debouncedInput = useDebouncedValue(input, 300);

  const mirroredOutput = useMemo(() => {
    return debouncedInput.trim();
  }, [debouncedInput]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-mist-50 via-cloud-50 to-blush-50 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <section className="w-full max-w-2xl rounded-3xl border border-white/60 bg-white/70 p-8 shadow-soft backdrop-blur">
          <header className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-mist-400">Ruby algebra</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-700">Polynomial Manipulation</h1>
          </header>

          <div className="space-y-5">
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="poly-input">Enter a polynomial:</label>
              <input
                id="poly-input"
                type="text"
                placeholder="e.g. 3x^2 - 2x + 1"
                value={input}
                onChange={(event) => setInput(event.target.value)} />
            </div>

            <hr/>

            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="poly-normalized">Normalized:</label>
              <input
                id="poly-normalized"
                type="text"
                value={mirroredOutput}
                readOnly />
            </div>

            <div className="grid grid-cols-[180px_auto_auto_1fr] items-center gap-4">
              <label htmlFor="poly-variable">Differentiated by</label>
              <select
                id="poly-variable"
                value={variable}
                onChange={(event) => setVariable(event.target.value)}
                className="w-20">
                {letters.map((letter) => (
                  <option key={letter} value={letter}>
                    {letter}
                  </option>
                ))}
              </select>
              <span className="text-slate-500">:</span>
              <input type="text" value={mirroredOutput} readOnly />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
