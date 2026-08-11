import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, DollarSign, CalendarPlus, Users, Clock, ShieldCheck } from 'lucide-react';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import FeatureCard from '../../common/FeatureCard';

const ServicesSectionContent = () => (
  <motion.div initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true, amount: 0.3 }}>
    <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-12">Why Choose Cookhub?</motion.h2>
    <motion.p variants={fadeInUp} className="text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
      We bring traditional, healthy, and hygienic meals to your doorstep with complete transparency and flexibility.
    </motion.p>
    <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      <FeatureCard
        icon={<Utensils size={48} />}
        title="100% Vegetarian"
        description="Options for Jain, Swaminarayan, and regular vegetarian diets with traditional recipes."
        bgColor="bg-green-50"
        iconColor="text-green-600"
      />
      <FeatureCard
        icon={<Users size={48} />}
        title="Certified Cooks"
        description="Background verified, hygienically trained home cooks with professional certifications."
        bgColor="bg-orange-50"
        iconColor="text-orange-600"
      />
      <FeatureCard
        icon={<CalendarPlus size={48} />}
        title="Flexible Booking"
        description="Monthly, quarterly, or yearly plans with lunch, dinner, or both meal options."
        bgColor="bg-blue-50"
        iconColor="text-blue-600"
      />
      <FeatureCard
        icon={<DollarSign size={48} />}
        title="Transparent Pricing"
        description="Clear per-person costs with detailed breakdowns and early bird discounts."
        bgColor="bg-yellow-50"
        iconColor="text-yellow-600"
      />
      <FeatureCard
        icon={<Clock size={48} />}
        title="Track & Schedule"
        description="Real-time cook scheduling with login/logout tracking and availability management."
        bgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
      <FeatureCard
        icon={<ShieldCheck size={48} />}
        title="Contract & Demo"
        description="Free demo day followed by minimum 1-month contract with full transparency."
        bgColor="bg-red-50"
        iconColor="text-red-600"
      />
    </motion.div>
  </motion.div>
);

export default ServicesSectionContent;