import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoanCalculatorWidget from '../components/calculator/LoanCalculatorWidget';
import Button from '../components/ui/Button';

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loan EMI Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Calculate your Equated Monthly Installment (EMI) with our advanced calculator. 
              Adjust loan amount, interest rate, and tenure to find the perfect payment plan.
            </p>
          </div>

          <LoanCalculatorWidget showFullFeatures />

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Ready to apply for a loan with these terms?
            </p>
            <Link to="/apply">
              <Button size="lg">
                Apply for Loan
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}