import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/animations';

const FeatureCard = ({ icon, title, description, bgColor, iconColor }) => (
  <motion.div variants={fadeInUp} className={`${bgColor} p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 text-left flex flex-col items-center`}>
    <div className={`mb-4 rounded-full p-4 ${bgColor.replace('-50', '-100')} ${iconColor} flex items-center justify-center`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </motion.div>
);

export default FeatureCard;