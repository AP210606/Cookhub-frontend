import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { fadeInUp } from '../utils/animations';

const CookCard = ({ image, name, rating, description, tags, location }) => (
  <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden">
    <img src={image} alt={name} className="w-full h-48 object-cover rounded-t-xl" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/cccccc/333333?text=Cook"; }} />
    <div className="p-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <div className="flex items-center text-yellow-500">
          <Star size={16} className="fill-current mr-1" />
          <span className="text-sm font-semibold">{rating}/5</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center text-gray-500 text-sm">
        <MapPin size={16} className="mr-2" />
        <span>Available in {location}</span>
      </div>
    </div>
  </motion.div>
);

export default CookCard;