import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, slideInLeft, slideInRight } from '../../utils/animations';
import ContactInfoCard from './ContactInfoCard';
import ContactForm from '../../forms/ContactForm';

const GetInTouchSection = () => {
  return (
    <motion.div initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true, amount: 0.3 }}>
      <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">Get in Touch</motion.h2>
      <motion.p variants={fadeInUp} className="text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
        Have questions, complaints, or suggestions? We're here to help and make your experience better.
      </motion.p>
      <motion.div variants={staggerContainer} className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={slideInLeft}>
          <ContactInfoCard />
        </motion.div>
        <motion.div variants={slideInRight}>
          <ContactForm />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GetInTouchSection;