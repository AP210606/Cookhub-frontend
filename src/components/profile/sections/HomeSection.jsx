// D:\DNG\cookhub-app-anil\cookhub-frontend\src\components\sections\HomeSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star } from 'lucide-react';
import { staggerContainer, fadeInUp, scaleIn, slideInRight } from '../../utils/animations'; // Adjusted path
import { Link } from 'react-router-dom';

const HomeSection = ({ homeRef, bookingRef, pricingRef, servicesRef, cooksRef, rulesRef, contactRef }) => (
  <div className="space-y-16">
    {/* Hero Section with image as background */}
    <motion.section
      ref={homeRef}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative text-white py-20 md:py-32 rounded-xl shadow-2xl overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://wallpapers.com/images/hd/food-4k-spdnpz7bhmx4kv2r.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-green-500 opacity-80"></div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left md:w-2/3 lg:w-1/2">
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Homemade Cooking Meets <br /><span className="text-green-200">Heartfelt Hospitality</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto md:mx-0 mb-10 drop-shadow-md">
            Connect with professionally trained vegetarian home cooks for healthy, hygienic, and customizable meal services delivered to your doorstep.
          </motion.p>
          <motion.div variants={staggerContainer} className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.button
              variants={scaleIn}
              onClick={() => window.location.href = '/booking'} // Fallback navigation
              className="bg-white text-green-700 px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <BookOpen size={20} className="inline-block mr-2" /> Book Demo Day
            </motion.button>
            <motion.button
              variants={scaleIn}
              onClick={() => window.location.href = '/pricing'} // Fallback navigation
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:bg-white hover:text-green-700 transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              View Pricing
            </motion.button>
          </motion.div>
        </div>

        {/* Rating Badge - Positioned to match screenshot */}
        <motion.div variants={slideInRight} className="mt-10 md:mt-0 md:w-1/3 lg:w-1/2 flex justify-center md:justify-end">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-xl text-center flex flex-col items-center">
            <div className="flex items-center text-yellow-500 mb-2">
              <Star size={24} className="fill-current mr-1" />
              <span className="text-3xl font-bold">4.9</span>
              <span className="text-xl font-semibold">/5</span>
            </div>
            <p className="text-lg font-semibold mb-1">Rating</p>
            <p className="text-sm text-gray-600">500+ Happy Customers</p>
          </div>
        </motion.div>
      </div>
      {/* Add Profile Link
      <div className="absolute top-4 right-4 flex space-x-2">
        <Link
          to="/profile"
          className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition duration-300 ease-in-out"
        >
          Profile
        </Link>
      </div> */}
    </motion.section>
  </div>
);

export default HomeSection;