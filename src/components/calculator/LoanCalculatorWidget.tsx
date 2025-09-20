import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { calculateEMI, formatCurrency } from '../../utils/loanCalculator';
import Slider from '../ui/Slider';
import Card from '../ui/Card';

interface LoanCalculatorWidgetProps {
  showFullFeatures?: boolean;
}

export default function LoanCalculatorWidget({ showFullFeatures = false }: LoanCalculatorWidgetProps) {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(2);
  const [tenure, setTenure] = useState(60); // in months

  const calculation = calculateEMI({
    principal: loanAmount,
    interestRate,
    tenure
  });

  const pieData = [
    { name: 'Principal', value: loanAmount, color: '#3B82F6' },
    { name: 'Interest', value: calculation.totalInterest, color: '#10B981' }
  ];

  const barData = [
    { name: 'Monthly EMI', value: calculation.monthlyEMI },
    { name: 'Total Interest', value: calculation.totalInterest },
    { name: 'Total Amount', value: calculation.totalRepayment }
  ];

  return (
    <div className={`space-y-8 ${showFullFeatures ? '' : 'max-w-4xl mx-auto'}`}>
      {/* Input Controls */}
      <Card className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Loan Calculator</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Slider
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={50000}
            max={10000000}
            step={50000}
            formatValue={(value) => formatCurrency(value)}
          />

          <Slider
            label="Interest Rate (%)"
            value={interestRate}
            onChange={setInterestRate}
            min={2}
            max={2}
            step={0.1}
            formatValue={(value) => `${value}%`}
          />

          <Slider
            label="Tenure (Years)"
            value={tenure}
            onChange={(value) => setTenure(value)}
            min={12}
            max={360}
            step={12}
            formatValue={(value) => `${Math.round(value / 12)} years`}
          />
        </div>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* EMI Results */}
        <Card>
          <h4 className="text-xl font-semibold text-gray-900 mb-6">EMI Breakdown</h4>

          <div className="space-y-4">
            <motion.div
              key={calculation.monthlyEMI}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-lg"
            >
              <div className="text-sm text-gray-600">Monthly EMI</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculation.monthlyEMI)}
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Interest</div>
                <div className="text-lg font-semibold text-emerald-600">
                  {formatCurrency(calculation.totalInterest)}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Repayment</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(calculation.totalRepayment)}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Charts */}
        <Card>
          <h4 className="text-xl font-semibold text-gray-900 mb-6">Visual Breakdown</h4>

          {showFullFeatures ? (
            <div className="space-y-6">
              {/* Pie Chart */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Principal vs Interest</h5>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                    <span>Principal</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded mr-2" />
                    <span>Interest</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Payment Breakdown</h5>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 text-sm mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                  <span>Principal</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded mr-2" />
                  <span>Interest</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}