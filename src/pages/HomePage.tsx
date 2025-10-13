import EligibilitySection from '../components/home/EligibilitySection';
import FAQSection from '../components/home/FAQSection';
import HeroSection from '../components/home/HeroSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import InterestRatesSection from '../components/home/InterestRatesSection';
import LoanCalculatorPreviewSection from '../components/home/LoanCalculatorPreviewSection';
import LoanCategoriesSection from '../components/home/LoanCategoriesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import TrustSecuritySection from '../components/home/TrustSecuritySection';
import WhyChooseUsSection from '../components/home/WhyChooseUsSection';

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