import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const CookTable = ({ cooks, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Name</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Email</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Phone</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Specialties</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Service Areas</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Availability</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cooks.map((cook) => (
            <tr key={cook._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-sm text-gray-900">{cook.name}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-900">{cook.email || 'N/A'}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-900">{cook.phone}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-900">{(cook.specialties || []).join(', ')}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-900">{(cook.serviceAreas || []).join(', ')}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-900">{cook.isAvailable ? 'Available' : 'Unavailable'}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-900">
                <button
                  onClick={() => onEdit(cook)}
                  className="text-blue-600 hover:text-blue-800 mr-2"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(cook._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CookTable;