import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DollarSign } from 'lucide-react';
import Button from '../ui/Button';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LoanFlow</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/calculator"
              className={`text-sm font-medium transition-colors ${
                isActive('/calculator') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calculator
            </Link>
          </nav>

          {/* CTA */}
          <Link to="/apply">
            <Button size="sm">Apply Now</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}