import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle } from 'lucide-react';
import { staggerContainer, fadeInUp, slideInLeft, slideInRight } from '../../utils/animations';

const TransparentPricingSection = ({ navigate, bookingRef }) => {
  const [numPeople, setNumPeople] = useState('1');
  const [mealType, setMealType] = useState('lunchOnly');
  const [dietPreference, setDietPreference] = useState('Regular Vegetarian');
  const [planDuration, setPlanDuration] = useState('Monthly');

  // Basic pricing logic (can be expanded)
  const baseCostPerPersonPerMonth = 3000; // Example base price for 1 meal/day

  const calculateCost = () => {
    let cost = baseCostPerPersonPerMonth * parseInt(numPeople);

    // Adjust for meal type
    if (mealType === 'both') {
      cost *= 1.8; // Example: 80% more for both meals
    }

    // Apply discounts based on plan duration
    let discountPercentage = 0;
    if (planDuration === 'Quarterly') {
      discountPercentage = 0.05; // 5% discount
    } else if (planDuration === 'Yearly') {
      discountPercentage = 0.10; // 10% discount
    }

    const discount = cost * discountPercentage;
    const totalCost = cost - discount;

    return {
      base: baseCostPerPersonPerMonth * parseInt(numPeople) * (mealType === 'both' ? 1.8 : 1),
      earlyBirdDiscount: 0, // Not implemented in this calc, but can be added
      yearlyPlanDiscount: discount,
      total: totalCost,
    };
  };

  const { base, earlyBirdDiscount, yearlyPlanDiscount, total } = calculateCost();

  return (
    <motion.div initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true, amount: 0.3 }}>
      <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">Transparent Pricing</motion.h2>
      <motion.p variants={fadeInUp} className="text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
        Calculate your personalized meal plan cost with our flexible pricing options.
      </motion.p>
      <motion.div variants={staggerContainer} className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-md grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Calculate Your Plan */}
        <motion.div variants={slideInLeft} className="p-6 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your Plan</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="numPeople" className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
              <select
                id="numPeople"
                name="numPeople"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
              >
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5+ People (Contact Us)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="mealType"
                    value="lunchOnly"
                    checked={mealType === 'lunchOnly'}
                    onChange={() => setMealType('lunchOnly')}
                    className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-700">Lunch Only</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="mealType"
                    value="dinnerOnly"
                    checked={mealType === 'dinnerOnly'}
                    onChange={() => setMealType('dinnerOnly')}
                    className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-700">Dinner Only</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="mealType"
                    value="both"
                    checked={mealType === 'both'}
                    onChange={() => setMealType('both')}
                    className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-700">Both Lunch & Dinner</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="dietPreference" className="block text-sm font-medium text-gray-700 mb-1">Diet Preference</label>
              <select
                id="dietPreference"
                name="dietPreference"
                value={dietPreference}
                onChange={(e) => setDietPreference(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
              >
                <option value="Regular Vegetarian">Regular Vegetarian</option>
                <option value="Jain">Jain</option>
                <option value="Swaminarayan">Swaminarayan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Duration</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setPlanDuration('Monthly')}
                  className={`px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out ${
                    planDuration === 'Monthly' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setPlanDuration('Quarterly')}
                  className={`px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out ${
                    planDuration === 'Quarterly' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Quarterly
                </button>
                <button
                  type="button"
                  onClick={() => setPlanDuration('Yearly')}
                  className={`px-6 py-2 rounded-full text-lg font-semibold transition duration-300 ease-in-out ${
                    planDuration === 'Yearly' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Your Plan Summary */}
        <motion.div variants={slideInRight} className="bg-green-700 text-white p-8 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-6">Your Plan Summary</h3>
            <div className="space-y-4 text-lg">
              <div className="flex justify-between">
                <span>Base Cost ({parseInt(numPeople)} {parseInt(numPeople) > 1 ? 'people' : 'person'}, {mealType === 'both' ? 'both meals' : mealType === 'lunchOnly' ? 'lunch only' : 'dinner only'})</span>
                <span className="font-semibold">₹{base.toLocaleString('en-IN')}/month</span>
              </div>
              {earlyBirdDiscount > 0 && (
                <div className="flex justify-between text-green-200">
                  <span>Early Bird Discount</span>
                  <span className="font-semibold">-₹{earlyBirdDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {yearlyPlanDiscount > 0 && (
                <div className="flex justify-between text-green-200">
                  <span>{planDuration} Plan Discount</span>
                  <span className="font-semibold">-₹{yearlyPlanDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-green-500 pt-4 flex justify-between text-2xl font-bold">
                <span>Total Monthly Cost</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <p className="flex items-center text-green-100">
              <CheckCircle size={20} className="mr-2" /> Free demo day included
            </p>
            <p className="flex items-center text-green-100">
              <CheckCircle size={20} className="mr-2" /> Monthly invoicing
            </p>
            <p className="flex items-center text-green-100">
              <CheckCircle size={20} className="mr-2" /> Flexible payment options
            </p>
            <button
              onClick={() => navigate('booking')}
              className="w-full bg-white text-green-700 px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-white mt-6"
            >
              <BookOpen size={20} className="inline-block mr-2" /> Book Demo Day
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TransparentPricingSection;