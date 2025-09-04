import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Users, Award } from 'lucide-react';

const trustBadges = [
  {
    icon: 'Shield',
    title: 'SSL Secured',
    description: 'Bank-grade security for all transactions'
  },
  {
    icon: 'Users',
    title: '50,000+ Customers',
    description: 'Trusted by thousands of satisfied customers'
  },
  {
    icon: 'Lock',
    title: 'Data Privacy',
    description: 'Your information is safe and encrypted'
  },
  {
    icon: 'Award',
    title: 'RBI Compliant',
    description: 'Fully compliant with banking regulations'
  }
];

export default function TrustSecuritySection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 to-emerald-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Trust, Our Priority
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            We maintain the highest standards of security and compliance to protect your financial information
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustBadges.map((badge, index) => {
            const IconComponent = {
              Shield,
              Lock,
              Users,
              Award
            }[badge.icon] as React.ComponentType<any>;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {badge.title}
                  </h3>
                  
                  <p className="text-blue-100 text-sm">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}