import React, { useEffect, useState } from 'react';

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
  const [activeTab, setActiveTab] = useState('derivative');
  const [input, setInput] = useState('');
  const [variable, setVariable] = useState('x');
  const [normalized, setNormalized] = useState('');
  const [differentiated, setDifferentiated] = useState('');
  const [error, setError] = useState('');

  const [binaryFirst, setBinaryFirst] = useState('');
  const [binarySecond, setBinarySecond] = useState('');
  const [binaryOperation, setBinaryOperation] = useState('add');
  const [binaryOutput, setBinaryOutput] = useState('');
  const [binaryError, setBinaryError] = useState('');

  const debouncedInput = useDebouncedValue(input, 300);
  const debouncedBinaryFirst = useDebouncedValue(binaryFirst, 300);
  const debouncedBinarySecond = useDebouncedValue(binarySecond, 300);

  useEffect(() => {
    const trimmed = debouncedInput.trim();
    if (!trimmed) {
      setNormalized('');
      setDifferentiated('');
      setError('');
      return;
    }

    const controller = new AbortController();
    const requestJson = async (path, payload) => {
      const response = await fetch(`http://localhost:9292${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        throw new Error(data?.error || `Request failed with status ${response.status}`);
      }

      if (!data || typeof data.success !== 'boolean') {
        throw new Error('Unexpected response format');
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown server error');
      }

      return data.result ?? '';
    };

    const run = async () => {
      try {
        setError('');
        const [normalizedResult, differentiatedResult] = await Promise.all([
          requestJson('/normalize', { polynomial: trimmed }),
          requestJson('/differentiate', { polynomial: trimmed, variable }),
        ]);

        setNormalized(normalizedResult);
        setDifferentiated(differentiatedResult);
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return;
        }
        setError(requestError.message || 'Network error');
        setNormalized('');
        setDifferentiated('');
      }
    };

    run();

    return () => controller.abort();
  }, [debouncedInput, variable]);

  useEffect(() => {
    const first = debouncedBinaryFirst.trim();
    const second = debouncedBinarySecond.trim();
    if (!first || !second) {
      setBinaryOutput('');
      setBinaryError('');
      return;
    }

    const controller = new AbortController();

    const requestJson = async (path, payload) => {
      const response = await fetch(`http://localhost:9292${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        throw new Error(data?.error || `Request failed with status ${response.status}`);
      }

      if (!data || typeof data.success !== 'boolean') {
        throw new Error('Unexpected response format');
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown server error');
      }

      return data.result ?? '';
    };

    const run = async () => {
      try {
        setBinaryError('');
        let result = '';
        if (binaryOperation === 'add') {
          result = await requestJson('/add', { terms: [first, second] });
        } else if (binaryOperation === 'subtract') {
          result = await requestJson('/subtract', { minuend: first, subtrahend: second });
        } else {
          result = await requestJson('/multiply', { factors: [first, second] });
        }
        setBinaryOutput(result);
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return;
        }
        setBinaryError(requestError.message || 'Network error');
        setBinaryOutput('');
      }
    };

    run();

    return () => controller.abort();
  }, [debouncedBinaryFirst, debouncedBinarySecond, binaryOperation]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-mist-50 via-cloud-50 to-blush-50 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <section className="w-full max-w-2xl rounded-3xl border border-white/60 bg-white/70 p-8 shadow-soft backdrop-blur">
          <header className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-mist-400">Ruby algebra</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-700">Polynomial Manipulation</h1>
          </header>

          <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl border border-white/70 bg-white/60 p-2 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('derivative')}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === 'derivative'
                  ? 'bg-mist-200 text-slate-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Derivative
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('binary')}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === 'binary'
                  ? 'bg-mist-200 text-slate-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Binary operations
            </button>
          </div>

          {activeTab === 'derivative' ? (
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

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              ) : null}

              <hr/>

              <div className="grid grid-cols-[180px_1fr] items-center gap-4">
                <label htmlFor="poly-normalized">Normalized:</label>
                <input
                  id="poly-normalized"
                  type="text"
                  value={normalized}
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
                <input type="text" value={differentiated} readOnly />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-[180px_1fr] items-center gap-4">
                <label htmlFor="binary-first">First input:</label>
                <input
                  id="binary-first"
                  type="text"
                  placeholder="e.g. x^2 + 3x"
                  value={binaryFirst}
                  onChange={(event) => setBinaryFirst(event.target.value)} />
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/60 bg-white/60 px-4 py-3">
                <span className="text-sm font-medium text-slate-600">Operation</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'add', label: 'Addition' },
                    { id: 'subtract', label: 'Subtraction' },
                    { id: 'multiply', label: 'Multiplication' },
                  ].map((operation) => (
                    <button
                      key={operation.id}
                      type="button"
                      onClick={() => setBinaryOperation(operation.id)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                        binaryOperation === operation.id
                          ? 'bg-mist-200 text-slate-700 shadow-sm'
                          : 'bg-white/70 text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {operation.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[180px_1fr] items-center gap-4">
                <label htmlFor="binary-second">Second input:</label>
                <input
                  id="binary-second"
                  type="text"
                  placeholder="e.g. 2x - 5"
                  value={binarySecond}
                  onChange={(event) => setBinarySecond(event.target.value)} />
              </div>

              <hr/>

              <div className="grid grid-cols-[180px_1fr] items-center gap-4">
                <label htmlFor="binary-output">Output:</label>
                <input id="binary-output" type="text" value={binaryOutput} readOnly />
              </div>

              {binaryError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {binaryError}
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
