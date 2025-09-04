import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Card from '../ui/Card';

const interestPlans = [
  {
    name: 'Basic Plan',
    interestRate: '12.99%',
    features: ['Standard processing', 'Basic customer support', 'Online account access'],
    recommended: false
  },
  {
    name: 'Premium Plan',
    interestRate: '10.99%',
    features: ['Priority processing', '24/7 premium support', 'Dedicated relationship manager', 'Flexible prepayment'],
    recommended: true
  },
  {
    name: 'Elite Plan',
    interestRate: '8.99%',
    features: ['Express processing', 'VIP customer support', 'Personal financial advisor', 'Zero prepayment charges', 'Exclusive benefits'],
    recommended: false
  }
];

export default function InterestRatesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Interest Rate Plans
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your needs. All plans come with our commitment to transparency and excellent service
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {interestPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Recommended</span>
                  </div>
                </div>
              )}
              
              <Card hover className={`h-full text-center ${plan.recommended ? 'ring-2 ring-blue-500 shadow-xl' : ''}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-blue-600">{plan.interestRate}</span>
                  <span className="text-gray-600 ml-1">onwards</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                  plan.recommended 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg' 
                    : 'border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                }`}>
                  Choose Plan
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Import Check icon
import { Check } from 'lucide-react';