import React from 'react';
import { motion } from 'framer-motion';
import { PersonalInfo } from '../../types/loan';
import Card from '../ui/Card';

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  errors: Partial<PersonalInfo>;
}

export default function PersonalInfoStep({ data, onChange, errors }: PersonalInfoStepProps) {
  const handleChange = (field: keyof PersonalInfo, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age *
            </label>
            <input
              type="number"
              value={data.age || ''}
              onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your age"
              min="18"
              max="65"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">Age must be between 18-65 years</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your complete address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Status *
            </label>
            <select
              value={data.employmentStatus}
              onChange={(e) => handleChange('employmentStatus', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select employment status</option>
              <option value="salaried">Salaried</option>
              <option value="self-employed">Self Employed</option>
              <option value="business">Business Owner</option>
              <option value="professional">Professional</option>
            </select>
            {errors.employmentStatus && (
              <p className="mt-1 text-sm text-red-600">Please select your employment status</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Income (₹) *
            </label>
            <input
              type="number"
              value={data.annualIncome || ''}
              onChange={(e) => handleChange('annualIncome', parseInt(e.target.value) || 0)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.annualIncome ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your annual income"
              min="0"
            />
            {errors.annualIncome && (
              <p className="mt-1 text-sm text-red-600">Please enter a valid annual income</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}