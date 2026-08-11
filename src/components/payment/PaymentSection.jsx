import React, { useState } from 'react';
import { CreditCard, CheckCircle, MessageSquareWarning } from 'lucide-react';

const PaymentSection = ({ navigate, bookingDetails }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'success', 'failed'
  const [message, setMessage] = useState('');

  const handlePayment = () => {
    setPaymentStatus('processing');
    setMessage('Processing your payment...');

    // Simulate API call to a payment gateway
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% chance of success
      if (success) {
        setPaymentStatus('success');
        setMessage('Payment successful! Your booking is confirmed.');
        // In a real app, you'd update backend booking status here
        setTimeout(() => navigate('home'), 3000); // Redirect after 3 seconds
      } else {
        setPaymentStatus('failed');
        setMessage('Payment failed. Please try again or contact support.');
      }
    }, 2000); // Simulate 2-second payment processing
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl shadow-lg px-8 border border-blue-800">
      <h2 className="text-4xl font-bold text-blue-300 text-center mb-10">Complete Your Payment</h2>
      <p className="text-lg text-gray-200 text-center mb-12 max-w-2xl mx-auto">
        Please complete the payment for your booking.
      </p>

      <div className="max-w-md mx-auto bg-zinc-800 p-8 rounded-xl shadow-md border border-zinc-700">
        <h3 className="text-2xl font-bold text-gray-100 mb-6 flex items-center justify-center">
          <CreditCard size={28} className="mr-3 text-blue-400" /> Payment Details
        </h3>

        {bookingDetails && (
          <div className="mb-6 p-4 bg-zinc-700 rounded-md text-gray-100 border border-zinc-600">
            <p className="text-lg font-semibold mb-2">Booking Summary:</p>
            <p><strong>Booking ID:</strong> {bookingDetails.bookingId || 'N/A'}</p>
            <p><strong>Amount Due:</strong> ₹{bookingDetails.amount ? bookingDetails.amount.toLocaleString('en-IN') : 'N/A'}</p>
          </div>
        )}

        {message && (
          <div className={`text-center py-3 rounded-md mb-6 ${
            paymentStatus === 'success' ? 'bg-green-700 text-green-100' :
            paymentStatus === 'failed' ? 'bg-red-700 text-red-100' :
            'bg-blue-700 text-blue-100'
          }`}>
            {message}
          </div>
        )}

        {paymentStatus === 'pending' || paymentStatus === 'failed' ? (
          <>
            <p className="text-gray-300 text-center mb-6">
              This is a simulated payment gateway. Click "Pay Now" to proceed.
            </p>
            <button
              onClick={handlePayment}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center"
            >
              <CreditCard size={20} className="mr-2" /> Pay Now
            </button>
            <button
              onClick={() => navigate('home')}
              className="w-full mt-4 bg-gray-700 text-gray-100 px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-gray-600 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-500 flex items-center justify-center"
            >
              Cancel Payment
            </button>
          </>
        ) : (
          <div className="text-center py-10">
            {paymentStatus === 'processing' && (
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            )}
            {paymentStatus === 'success' && (
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            )}
            {paymentStatus === 'failed' && (
              <MessageSquareWarning size={64} className="text-red-500 mx-auto mb-4" />
            )}
            <p className="text-gray-100 text-xl font-semibold">{message}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentSection;