import React from 'react';
import { Scale } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Structural Beam Load Calculator</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;