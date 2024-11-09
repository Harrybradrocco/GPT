import React from 'react';
import { Scale } from 'lucide-react';
import LoadCalculator from './components/Calculator';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow overflow-x-hidden">
        <div className="max-w-[1200px] mx-auto">
          <section className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Load Calculator</h2>
            </div>
            <LoadCalculator />
          </section>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © {new Date().getFullYear()} Hbradroc@uwo.ca
        </div>
      </footer>
    </div>
  );
}

export default App;