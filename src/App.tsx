import React from 'react';
import { Scale } from 'lucide-react';
import LoadCalculator from './components/Calculator';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          <section className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Load Calculator</h2>
            </div>
            <LoadCalculator />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;