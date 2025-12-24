import React, { useState, useEffect } from 'react';
import { LogIn, CheckCircle, CreditCard, Clock, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';
import InputField from '../common/InputField';
import SelectField from '../common/SelectField';
import TextAreaField from '../common/TextAreaField';

const BookingFormSection = ({ token, user, navigate }) => {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    dietaryPreference: '',
    tastePreference: '',
    mealPreference: '',
    preferredMealTime: '', // New: Lunch or Dinner time slot
    planDuration: '',
    preferredStartDate: '', // New: When to start service
    numPeople: '2',
    message: ''
  });

  const [liveAmount, setLiveAmount] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingMade, setBookingMade] = useState(false);
  const [currentBookingDetails, setCurrentBookingDetails] = useState(null);

  // Live Amount Calculator
  useEffect(() => {
    const calculate = () => {
      if (!formData.planDuration || !formData.numPeople || !formData.mealPreference) {
        setLiveAmount(null);
        return;
      }

      if (formData.planDuration === 'First Demo') {
        // First Demo is free
        setLiveAmount(0);
        return;
      }

      const people = parseInt(formData.numPeople);
      let baseMonthly = 0;

      if (people <= 2) baseMonthly = 5000;
      else if (people <= 4) baseMonthly = 6500;
      else baseMonthly = 8500;

      if (formData.mealPreference !== 'Both') baseMonthly /= 2;

      let final = baseMonthly;
      if (formData.planDuration === '3 Months (Quarterly)') final = baseMonthly * 3 * 0.95;
      else if (formData.planDuration === '12 Months (Yearly)') final = baseMonthly * 12 * 0.90;

      setLiveAmount(Math.round(final));
    };

    calculate();
  }, [formData.planDuration, formData.numPeople, formData.mealPreference]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setIsSuccess(false);

    if (!token) {
      setStatusMessage('Please login to submit a booking request.');
      return;
    }

    // Validation
    const required = ['phone', 'address', 'dietaryPreference', 'mealPreference', 'preferredMealTime', 'planDuration', 'preferredStartDate', 'numPeople'];
    for (let field of required) {
      if (!formData[field]) {
        setStatusMessage(`Please fill: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    const payload = {
      ...formData,
      numPeople: parseInt(formData.numPeople),
      totalAmount: liveAmount || 0
    };


    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setBookingMade(true);
        setStatusMessage('Booking request submitted successfully!');
        setCurrentBookingDetails({
          bookingId: data.booking?._id || 'TEMP-' + Date.now(),
          amount: liveAmount
        });
      } else {
        setStatusMessage(data.message || 'Failed to submit booking.');
      }
    } catch (err) {
      setStatusMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 rounded-2xl shadow-xl px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">
          Book Your Personal Cook
        </h2>
        <p className="text-xl text-gray-700">
          Homemade food • Daily fresh • Just like Mom makes ❤️
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 text-center">
          <Clock className="inline-block mr-2" size={28} />
          <strong className="text-xl">Important:</strong> Cook stays only <span className="underline">1.5 hours per visit</span> to prepare fresh meals
        </div>

        <div className="p-8">
          {statusMessage && (
            <div className={`text-center py-4 rounded-lg mb-6 text-lg font-medium ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {statusMessage}
            </div>
          )}

          {!user ? (
            <div className="text-center py-20">
              <LogIn size={80} className="text-purple-500 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-800">Login Required</h3>
              <p className="text-gray-600 mt-4">Please log in to book your cook</p>
            </div>
          ) : !bookingMade ? (
            <form onSubmit={handleSubmit} className="space-y-7">

              <div className="grid md:grid-cols-2 gap-6">
                <InputField label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                <InputField label="Full Delivery Address" type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="House no., Street, Area, City" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <SelectField
                  label="Dietary Preference"
                  name="dietaryPreference"
                  value={formData.dietaryPreference}
                  onChange={handleChange}
                  options={['', 'Regular Vegetarian', 'Jain (No Onion/Garlic)', 'Swaminarayan', 'Jain + No Potato']}
                  required
                />
                <SelectField
                  label="Taste Preference"
                  name="tastePreference"
                  value={formData.tastePreference}
                  onChange={handleChange}
                  options={['', 'Mild', 'Spicy', 'Sweet']}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <SelectField
                  label="Meal Preference"
                  name="mealPreference"
                  value={formData.mealPreference}
                  onChange={handleChange}
                  options={['', 'Lunch Only', 'Dinner Only', 'Both Lunch & Dinner']}
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline mr-2" size={18} />
                    Preferred Meal Time Slot
                  </label>
                  <select
                    name="preferredMealTime"
                    value={formData.preferredMealTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition"
                  >
                    <option value="">-- Select Time Slot --</option>
                    {formData.mealPreference.includes('Lunch') && (
                      <>
                        <option value="12:30-14:00">Lunch: 12:30 PM – 2:00 PM</option>
                        <option value="13:00-14:30">Lunch: 1:00 PM – 2:30 PM (Most Popular)</option>
                        <option value="13:30-15:00">Lunch: 1:30 PM – 3:00 PM</option>
                      </>
                    )}
                    {formData.mealPreference.includes('Dinner') && (
                      <>
                        <option value="18:30-20:00">Dinner: 6:30 PM – 8:00 PM</option>
                        <option value="19:00-20:30">Dinner: 7:00 PM – 8:30 PM (Most Popular)</option>
                        <option value="19:30-21:00">Dinner: 7:30 PM – 9:00 PM</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <SelectField
                  label="Number of People"
                  name="numPeople"
                  value={formData.numPeople}
                  onChange={handleChange}
                  options={['1', '2', '3', '4', '5', '6', '7+ (Call us)']}
                  required
                />

                <SelectField
                  label="Plan Duration"
                  name="planDuration"
                  value={formData.planDuration}
                  onChange={handleChange}
                  options={['', 'First Demo', '1 Month', '3 Months (Quarterly) - 5% OFF', '12 Months (Yearly) - 10% OFF']}
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline mr-2" size={18} />
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    name="preferredStartDate"
                    value={formData.preferredStartDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <TextAreaField
                label="Any Special Requests? (Allergies, Kids, Guests, etc.)"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                placeholder="E.g., My child doesn't eat spicy, we have guests on weekends, no garlic please..."
              />

              {liveAmount && formData.planDuration !== 'First Demo' && (
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl text-center">
                  <p className="text-lg text-gray-700">Your Total Amount</p>
                  <p className="text-4xl font-bold text-purple-700">₹{liveAmount.toLocaleString('en-IN')}</p>
                  {formData.planDuration.includes('OFF') && <p className="text-green-600 font-semibold mt-2">Discount Applied!</p>}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-5 rounded-full text-xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 flex items-center justify-center"
              >
                <CreditCard className="mr-3" size={28} />
                Submit Booking & Proceed to Payment
              </button>
            </form>
          ) : (
            /* Success Screen */
            <div className="text-center py-16">
              <CheckCircle size={100} className="text-green-500 mx-auto mb-6" />
              <h3 className="text-4xl font-bold text-gray-800 mb-4">Booking Confirmed!</h3>
              <p className="text-xl text-gray-600 mb-8">We’ll assign your perfect cook soon</p>
              <div className="bg-gray-100 p-6 rounded-xl inline-block mb-8">
                <p className="text-3xl font-bold text-purple-700">₹{currentBookingDetails.amount.toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('payment', currentBookingDetails)}
                  className="w-full max-w-md mx-auto bg-blue-600 text-white py-4 rounded-full text-xl font-bold hover:bg-blue-700 transition shadow-lg"
                >
                  <CreditCard className="inline mr-2" /> Pay Now
                </button>
                <button
                  onClick={() => navigate('home')}
                  className="block w-full max-w-md mx-auto text-gray-600 hover:text-gray-800 underline text-lg"
                >
                  Go Back Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingFormSection;