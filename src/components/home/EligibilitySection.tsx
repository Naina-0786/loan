import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Card from '../ui/Card';

const eligibilityItems = [
  'Age between 21-65 years',
  'Minimum monthly income of ₹25,000',
  'Stable employment for at least 1 year',
  'Good credit score (650+)',
  'Valid identity and address proof',
  'Bank statements for last 3 months'
];

export default function EligibilitySection() {
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
            Eligibility Criteria
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check if you meet our simple eligibility requirements to get started with your loan application
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eligibilityItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <div className="bg-emerald-100 rounded-full p-1">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}