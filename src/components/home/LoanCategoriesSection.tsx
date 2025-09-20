import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { loanTypes } from '../../data/loanTypes';
import Card from '../ui/Card';
import * as Icons from 'lucide-react';

export default function LoanCategoriesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Loan Type
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect loan solution tailored to your specific needs with competitive rates and flexible terms
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loanTypes.map((loan, index) => {
            const IconComponent = Icons[loan.icon as keyof typeof Icons] as React.ComponentType<any>;

            return (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to="/apply" state={{ loanType: loan.id }}>
                  <Card hover className="h-full text-center group cursor-pointer">
                    <div className="bg-gradient-to-r from-blue-100 to-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {loan.name}
                    </h3>

                    <p className="text-gray-600 mb-4">
                      {loan.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Interest Rate:2%</span>
                        <span className="font-semibold text-emerald-600">{loan.interestRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Max Amount:</span>
                        <span className="font-semibold text-blue-600">{loan.maxAmount}</span>
                      </div>
                    </div>

                    <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      Apply Now →
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}