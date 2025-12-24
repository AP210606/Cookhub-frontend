import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';
import InputField from '../common/InputField';
import TextAreaField from '../common/TextAreaField';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    pinCode: '',
    city: '',
    state: '',
    address: '',
    messageType: '',
    message: ''
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setIsSuccess(false);

    // Basic client-side validation
    if (!formData.fullName || !formData.email || !formData.message) {
      setStatusMessage('Please fill in all required fields (Full Name, Email, Message).');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage(data.message || 'Your message has been sent successfully! We will get back to you soon.');
        setIsSuccess(true);
        // Clear form fields only on successful submission
        setFormData({ fullName: '', email: '', mobile: '', pinCode: '', city: '', state: '', address: '', messageType: '', message: '' });
      } else {
        // Display error message from backend or a generic one
        setStatusMessage(data.message || 'Failed to send message. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      setStatusMessage('Network error: Could not connect to the server. Please try again later.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="bg-green-700 p-8 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
      {statusMessage && (
        <div className={`text-center py-3 rounded-md mb-6 ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {statusMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField label="Full Name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required isDark={true} />
        
        {/* Email and Mobile in one row */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required isDark={true} />
          </div>
          <div className="w-1/2">
            <InputField label="Mobile Number" type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required isDark={true} />
          </div>
        </div>

        {/* Pin Code, City, State in one row */}
        <div className="flex gap-4">
          <div className="w-1/3">
            <InputField label="Pin Code" type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} required isDark={true} />
          </div>
          <div className="w-1/3">
            <InputField label="City" type="text" name="city" value={formData.city} onChange={handleChange} required isDark={true} />
          </div>
          <div className="w-1/3">
            <InputField label="State" type="text" name="state" value={formData.state} onChange={handleChange} required isDark={true} />
          </div>
        </div>

        {/* Address full width */}
        <InputField label="Address" type="text" name="address" value={formData.address} onChange={handleChange} required isDark={true} />
        <TextAreaField label="Message" name="message" value={formData.message} onChange={handleChange} rows={5} required isDark={true} />
        <button
          type="submit"
          className="w-full bg-white text-green-700 px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-white flex items-center justify-center"
        >
          <Send size={20} className="mr-2" /> Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;