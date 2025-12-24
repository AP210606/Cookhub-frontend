import React from 'react';
import { Phone, Mail, Clock4 } from 'lucide-react';

const ContactInfoCard = () => (
  <div className="bg-white p-8 rounded-xl shadow-md flex flex-col justify-between">
    <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
    <div className="space-y-4 text-gray-700">
      <div className="flex items-center">
        <Phone size={20} className="text-green-600 mr-3" />
        <span>+91 9876543210</span>
      </div>
      <div className="flex items-center">
        <Mail size={20} className="text-green-600 mr-3" />
        <span>anilptl2006@gmail.com</span>
      </div>
      <div className="flex items-center">
        <Clock4 size={20} className="text-green-600 mr-3" />
        <span>Mon-Sat: 9AM-8PM</span>
      </div>
    </div>
    <div className="mt-8">
      <h4 className="text-xl font-bold text-gray-900 mb-4">Service Areas</h4>
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <div>
          <p className="font-semibold mb-1">Ahmedabad</p>
          <p className="text-sm">All major areas covered</p>
        </div>
        {/* <div>
          <p className="font-semibold mb-1">Mumbai</p>
          <p className="text-sm">Western & Central suburbs</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Bangalore</p>
          <p className="text-sm">Major IT corridors</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Pune</p>
          <p className="text-sm">Expanding soon</p>
        </div> */}
      </div>
    </div>
  </div>
);

export default ContactInfoCard;