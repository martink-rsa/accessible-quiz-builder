import React, { useState } from 'react';

export default function App() {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Accessible Quiz Builder (React)</h1>
        <div className="space-x-2">
          <button
            aria-pressed={mode === 'edit'}
            className="px-3 py-1 border rounded"
            onClick={() => setMode('edit')}
          >
            Edit
          </button>
          <button
            aria-pressed={mode === 'preview'}
            className="px-3 py-1 border rounded"
            onClick={() => setMode('preview')}
          >
            Preview
          </button>
        </div>
      </header>
      <section aria-live="polite">
        {mode === 'edit' ? (
          <p className="text-sm text-gray-600">
            Edit mode placeholder — build your quiz editor here.
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Preview mode placeholder — render your quiz here.
          </p>
        )}
      </section>
    </main>
  );
}
