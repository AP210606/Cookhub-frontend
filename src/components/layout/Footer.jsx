import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = ({ navigate, servicesRef, cooksRef, contactRef }) => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-b border-gray-700">
          {/* Column 1: Cookhub Info */}
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">Cookhub</h3>
            <p className="text-gray-400 text-sm mb-4">Connecting communities with traditional, homemade cooking through professionally trained home cooks.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300"><Facebook size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300"><Twitter size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300"><Instagram size={20} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => navigate('home', servicesRef)} className="hover:text-white transition duration-300">Lunch Plans</button></li>
              <li><button onClick={() => navigate('home', servicesRef)} className="hover:text-white transition duration-300">Dinner Plans</button></li>
              <li><button onClick={() => navigate('home', servicesRef)} className="hover:text-white transition duration-300">Jain Food</button></li>
              <li><button onClick={() => navigate('home', servicesRef)} className="hover:text-white transition duration-300">Swaminarayan</button></li>
              <li><button onClick={() => navigate('booking')} className="hover:text-white transition duration-300">Demo Day</button></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => navigate('home')} className="hover:text-white transition duration-300">About Us</button></li>
              <li><button onClick={() => navigate('home', cooksRef)} className="hover:text-white transition duration-300">Our Cooks</button></li>
              <li><button onClick={() => navigate('home')} className="hover:text-white transition duration-300">Careers</button></li>
              <li><button onClick={() => navigate('home')} className="hover:text-white transition duration-300">Privacy Policy</button></li>
              <li><button onClick={() => navigate('home')} className="hover:text-white transition duration-300">Terms of Service</button></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => navigate('home', contactRef)} className="hover:text-white transition duration-300">Contact Us</button></li>
              <li><button onClick={() => navigate('home')} className="hover:text-white transition duration-300">FAQ</button></li>
              <li><button onClick={() => navigate('home', contactRef)} className="hover:text-white transition duration-300">Complaints</button></li>
              <li><button onClick={() => navigate('home', contactRef)} className="hover:text-white transition duration-300">Suggestions</button></li>
              <li><button onClick={() => navigate('home')} className="hover:text-white transition duration-300">Help Center</button></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-6">
          <p>&copy; {new Date().getFullYear()} Cookhub. All rights reserved. </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;