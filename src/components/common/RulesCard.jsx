import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, CheckCircle } from 'lucide-react';
import { fadeInUp } from '../utils/animations';

const RulesCard = ({ title, rules, type }) => {
  const iconColor = type === 'customer' ? 'text-green-500' : 'text-orange-500';
  const bgColor = type === 'customer' ? 'bg-green-50' : 'bg-orange-50';
  const titleIcon = type === 'customer' ? <Users size={28} className="mr-3 text-green-700" /> : <Building2 size={28} className="mr-3 text-orange-700" />;

  return (
    <motion.div variants={fadeInUp} className={`${bgColor} p-8 rounded-xl shadow-md flex flex-col h-full`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        {titleIcon}
        {title}
      </h3>
      <ul className="list-none space-y-3 flex-grow">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start text-gray-700">
            <CheckCircle size={20} className={`flex-shrink-0 mt-1 mr-3 ${iconColor}`} />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default RulesCard;