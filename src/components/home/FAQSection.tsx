import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What documents do I need for a loan application?',
    answer: 'You will need identity proof (Aadhaar, PAN), address proof, income proof (salary slips or ITR), and bank statements for the last 3 months.'
  },
  {
    question: 'How long does the approval process take?',
    answer: 'Our typical approval process takes 24-48 hours. For premium customers, we offer express processing within 4-6 hours.'
  },
  {
    question: 'Can I prepay my loan without charges?',
    answer: 'Yes, we offer flexible prepayment options. Charges may vary based on your loan type and plan. Premium and Elite plans have reduced or zero prepayment charges.'
  },
  {
    question: 'What is the minimum credit score required?',
    answer: 'We generally require a credit score of 650 or above. However, we evaluate applications holistically and may consider other factors for approval.'
  },
  {
    question: 'Are there any hidden charges?',
    answer: 'No, we believe in complete transparency. All charges including processing fees, administrative charges, and any other costs are clearly mentioned upfront.'
  },
  {
    question: 'Can I apply for multiple loans?',
    answer: 'Yes, you can apply for multiple loan types based on your eligibility and repayment capacity. Our team will guide you through the process.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our loan products and application process
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}