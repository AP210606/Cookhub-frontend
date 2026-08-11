import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import RulesCard from '../../common/RulesCard';

const RulesAndRegulationsSection = () => {
  return (
    <motion.div initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true, amount: 0.3 }}>
      <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">Rules & Regulations</motion.h2>
      <motion.p variants={fadeInUp} className="text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
        Clear guidelines to ensure mutual respect, reliability, and smooth service for everyone.
      </motion.p>
      <motion.div variants={staggerContainer} className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <RulesCard
          title="Customer Engagement Rules"
          rules={[
            "Customers must sign a formal contract with Cookhub after a demo day.",
            "Complaints regarding cook misbehavior, hygiene, or cooking quality must be directed exclusively to Cookhub.",
            "Suggestions on personalized cooking methods or recipe preferences are welcomed through Cookhub channels.",
            "Customers must inform Cookhub at least one day in advance if they will be unavailable for meal service.",
            "Direct interaction with cooks should be respectful and limited to meal-related instructions.",
            "Breaching the contract mid-period without proper notice or valid reason will lead to the forfeiture of any security deposit.",
            "For early termination of service, customers are required to provide at least one week's notice to Cookhub.",
            "If a Cookhub cook misses three consecutive days without prior notice or valid communication, customers may be eligible to withhold partial payment for the missed service days.",
            "A detailed monthly invoice will be provided to customers for complete transparency."
          ]}
          type="customer"
        />
        <RulesCard
          title="Company Rules & Regulations"
          rules={[
            "Contracts are mandatory and must be signed by customers before cook deployment.",
            "A dedicated Cookhub coordinator will visit the customer's home for initial onboarding.",
            "Early bird customers (as defined by ongoing promotions) will receive a special 10% discount.",
            "Customers inactive for 10 consecutive days may be eligible for special discounts on next package renewal.",
            "The company is solely responsible for all aspects of cook management, including training, scheduling, background verification, and performance monitoring.",
            "Cookhub coordinators serve as the primary point of contact for customers, managing all communication and issue resolution.",
            "Monthly invoices provided for complete financial transparency and flexible payment options."
          ]}
          type="company"
        />
      </motion.div>
    </motion.div>
  );
};

export default RulesAndRegulationsSection;