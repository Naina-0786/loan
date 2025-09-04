import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DollarSign, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Home
            </Link>
            <Link
              to="/calculator"
              className={`text-sm font-medium transition-colors ${isActive('/calculator') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Calculator
            </Link>
          </nav>

          {/* CTA + Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link to="/apply" className="hidden sm:block">
              <Button size="sm">Apply Now</Button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/calculator"
              className={`text-sm font-medium transition-colors ${isActive('/calculator') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              onClick={() => setMenuOpen(false)}
            >
              Calculator
            </Link>
            <Link to="/apply" onClick={() => setMenuOpen(false)}>
              <Button size="sm" className="w-full">Apply Now</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
