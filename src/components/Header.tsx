import React from 'react';
import { Scale } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold">Enhanced Load Calculator</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;