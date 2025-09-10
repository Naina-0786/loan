import { motion } from 'framer-motion';
import LoanApplicationStepper from '../components/application/LoanApplicationStepper';

export default function LoanApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loan Application
            </h1>
            <p className="text-lg text-gray-600">
              Complete your comprehensive loan application in 10 simple steps
            </p>
          </div>

          <LoanApplicationStepper />
        </motion.div>
      </div>
    </div>
  );
}