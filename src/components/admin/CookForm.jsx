import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import PropTypes from 'prop-types';

const CookForm = ({ cook, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    experience: 0,
    specialties: '',
    serviceAreas: '',
    email: '',
    phone: '',
    isAvailable: 'true',
    rating: 5,
    location: 'India',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cook) {
      setFormData({
        name: cook.name || '',
        experience: cook.experience || 0,
        specialties: (cook.specialties || []).join(', ') || '',
        serviceAreas: (cook.serviceAreas || []).join(', ') || '',
        email: cook.email || '',
        phone: cook.phone || '',
        isAvailable: cook.isAvailable ? 'true' : 'false',
        rating: cook.rating || 5,
        location: cook.location || 'India',
      });
    } else {
      setFormData({
        name: '',
        experience: 0,
        specialties: '',
        serviceAreas: '',
        email: '',
        phone: '',
        isAvailable: 'true',
        rating: 5,
        location: 'India',
      });
    }
    setErrors({});
  }, [cook, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const cookData = {
        ...(cook ? { _id: cook._id } : {}),
        name: formData.name,
        experience: formData.experience,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
        serviceAreas: formData.serviceAreas.split(',').map(s => s.trim()).filter(s => s),
        email: formData.email,
        phone: formData.phone,
        isAvailable: formData.isAvailable === 'true',
        rating: formData.rating,
        location: formData.location,
      };
      onSave(cookData);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{cook ? 'Edit Cook' : 'Add New Cook'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
            <input
              type="text"
              value={formData.specialties}
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Areas (comma-separated)</label>
            <input
              type="text"
              value={formData.serviceAreas}
              onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select
              value={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {cook ? 'Update Cook' : 'Add Cook'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CookForm;