import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LoanCalculatorWidget from '../calculator/LoanCalculatorWidget';
import Button from '../ui/Button';

export default function LoanCalculatorPreviewSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Calculate Your EMI
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Get instant EMI calculations for your loan. Adjust the amount and tenure to see how it affects your monthly payments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <LoanCalculatorWidget />
          
          <div className="text-center mt-8">
            <Link to="/calculator">
              <Button variant="secondary" size="lg">
                Use Full Calculator
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}