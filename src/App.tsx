import React from 'react';
import { Scale } from 'lucide-react';
import LoadCalculator from './components/Calculator';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          <section className="bg-gray-800/50 rounded-xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Load Calculator</h2>
            </div>
            <LoadCalculator />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;