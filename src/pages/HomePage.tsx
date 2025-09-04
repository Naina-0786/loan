import React from 'react';
import HeroSection from '../components/home/HeroSection';
import LoanCategoriesSection from '../components/home/LoanCategoriesSection';
import WhyChooseUsSection from '../components/home/WhyChooseUsSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import LoanCalculatorPreviewSection from '../components/home/LoanCalculatorPreviewSection';
import EligibilitySection from '../components/home/EligibilitySection';
import InterestRatesSection from '../components/home/InterestRatesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FAQSection from '../components/home/FAQSection';
import TrustSecuritySection from '../components/home/TrustSecuritySection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LoanCategoriesSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <LoanCalculatorPreviewSection />
      <EligibilitySection />
      <InterestRatesSection />
      <TestimonialsSection />
      <FAQSection />
      <TrustSecuritySection />
    </div>
  );
}