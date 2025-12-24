import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../utils/animations';

const MeetOurCertifiedCooks = () => {
  const cooks = [
    {
      image: "https://placehold.co/300x300/E0F2F1/042F2E?text=Priya",
      name: "Priya Sharma",
      rating: 4.9,
      description: "North Indian, Jain Cuisine, Traditional Recipes. 8+ years experience.",
      tags: ['Jain Certified', 'Hygiene Trained'],
      location: "South Delhi",
    },
    {
      image: "https://placehold.co/300x300/E3F2FD/0D47A1?text=Rajesh",
      name: "Rajesh Patel",
      rating: 4.8,
      description: "Gujarati, South Indian, Swaminarayan dishes. 10+ years experience.",
      tags: ['Swaminarayan Certified', 'Professional Cook'],
      location: "West Mumbai",
    },
    {
      image: "https://placehold.co/300x300/F3E5F5/4A148C?text=Sunita",
      name: "Sunita Verma",
      rating: 5.0,
      description: "Home Style, Nutritious Meals, Regional Cuisine. 12+ years experience.",
      tags: ['Nutritionist', 'Home Style Expert'],
      location: "East Bangalore",
    },
    {
      image: "https://placehold.co/300x300/FFF3E0/FF6F00?text=Anita",
      name: "Anita Desai",
      rating: 4.7,
      description: "Maharashtrian, kids' meals, healthy cooking. 9+ years experience.",
      tags: ['Kid-Friendly', 'Meal Planner'],
      location: "Pune",
    },
    {
      image: "https://placehold.co/300x300/E8F5E9/1B5E20?text=Farhan",
      name: "Farhan Qureshi",
      rating: 4.9,
      description: "Mughlai, Tandoori, Biryani expert. 15+ years experience.",
      tags: ['Mughlai Master', 'Food Safety Certified'],
      location: "Old Delhi",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={staggerContainer}
      viewport={{ once: true, amount: 0.3 }}
      className="py-10"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-6"
      >
        Meet Our Certified Cooks
      </motion.h2>
      <motion.p
        variants={fadeInUp}
        className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto"
      >
        Experienced home chefs trained in hygiene and regional specialties.
      </motion.p>

      <motion.div
        variants={staggerContainer}
        className="flex overflow-x-auto space-x-6 px-4 pb-4 snap-x snap-mandatory"
      >
        {cooks.map((cook, index) => (
          <div
            key={index}
            className="min-w-[280px] max-w-xs bg-white shadow-md rounded-xl p-4 snap-start flex-shrink-0"
          >
            <img src={cook.image} alt={cook.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">{cook.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{cook.location}</p>
            <p className="text-sm text-gray-700 mb-3">{cook.description}</p>
            <div className="flex flex-wrap gap-2">
              {cook.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-3 text-yellow-600 font-medium">⭐ {cook.rating}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MeetOurCertifiedCooks;