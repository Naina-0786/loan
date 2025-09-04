import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">LoanFlow</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Your trusted partner for all loan needs. We provide quick, transparent, and affordable lending solutions to help you achieve your financial goals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/apply" className="block text-gray-400 hover:text-white transition-colors">
                Apply for Loan
              </Link>
              <Link to="/calculator" className="block text-gray-400 hover:text-white transition-colors">
                EMI Calculator
              </Link>
              <a href="#faq" className="block text-gray-400 hover:text-white transition-colors">
                FAQ
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <a href="#privacy" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="block text-gray-400 hover:text-white transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 LoanFlow. All rights reserved. | Licensed by RBI
          </p>
        </div>
      </div>
    </footer>
  );
}