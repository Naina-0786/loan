import { LoanType } from '../types/loan';

export const loanTypes: LoanType[] = [
  {
    id: 'personal',
    name: 'Personal Loan',
    description: 'Instant funds for your personal needs with minimal documentation',
    icon: 'User',
    interestRate: '10.99% - 24%',
    maxAmount: '₹50 Lakhs'
  },
  {
    id: 'home',
    name: 'Home Loan',
    description: 'Finance your dream home with attractive interest rates',
    icon: 'Home',
    interestRate: '8.5% - 12%',
    maxAmount: '₹10 Crores'
  },
  {
    id: 'car',
    name: 'Car Loan',
    description: 'Drive your dream car with easy financing options',
    icon: 'Car',
    interestRate: '7.5% - 15%',
    maxAmount: '₹2 Crores'
  },
  {
    id: 'business',
    name: 'Business Loan',
    description: 'Fuel your business growth with flexible loan solutions',
    icon: 'Building2',
    interestRate: '12% - 20%',
    maxAmount: '₹5 Crores'
  },
  {
    id: 'education',
    name: 'Education Loan',
    description: 'Invest in your future with education financing',
    icon: 'GraduationCap',
    interestRate: '9% - 16%',
    maxAmount: '₹1.5 Crores'
  },
  {
    id: 'startup',
    name: 'Startup Loan',
    description: 'Turn your innovative ideas into successful ventures',
    icon: 'Rocket',
    interestRate: '14% - 22%',
    maxAmount: '₹2 Crores'
  }
];

export const benefits = [
  {
    title: 'Quick Approval',
    description: 'Get loan approval in as fast as 24 hours with our streamlined process',
    icon: 'Zap'
  },
  {
    title: 'Competitive Interest Rates',
    description: 'Enjoy some of the lowest interest rates in the market',
    icon: 'TrendingDown'
  },
  {
    title: 'Flexible Repayment',
    description: 'Choose repayment terms that suit your financial situation',
    icon: 'Calendar'
  },
  {
    title: 'Minimal Paperwork',
    description: 'Simple documentation process with digital verification',
    icon: 'FileText'
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your queries',
    icon: 'Headphones'
  }
];

export const howItWorksSteps = [
  {
    step: 1,
    title: 'Apply',
    description: 'Fill out our simple online application form',
    icon: 'FileText'
  },
  {
    step: 2,
    title: 'Verification',
    description: 'Our team verifies your documents and eligibility',
    icon: 'Shield'
  },
  {
    step: 3,
    title: 'Approval',
    description: 'Get instant approval notification via SMS/Email',
    icon: 'CheckCircle'
  },
  {
    step: 4,
    title: 'Disbursal',
    description: 'Loan amount credited directly to your bank account',
    icon: 'CreditCard'
  }
];