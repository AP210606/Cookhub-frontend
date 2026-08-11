import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Filter, Users, ClipboardList, MapPin,
  AlertCircle, CheckCircle, LogOut, Edit, Trash2, X, Save, Clock, Mail, Phone, ArrowLeft, Check,
} from 'lucide-react';

// NOTE: This is a placeholder for the API base URL. Replace with your actual backend URL.
const API_BASE_URL = 'https://mock-api.com/api';

/**
 * A utility function to get a status color for Tailwind CSS.
 * @param {string} status The status string (e.g., 'approved', 'rejected', 'pending').
 * @returns {string} The corresponding Tailwind CSS class.
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * ApplicationTable component displays a table of cook applications.
 * @param {object} props The component props.
 * @param {Array<object>} props.applications An array of application objects.
 * @param {Function} props.onAction The function to call when an action button is clicked.
 */
const ApplicationTable = ({ applications, onAction }) => {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No applications found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Applicant Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Experience</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Specialty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.applicantName}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{application.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{application.phone}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{application.experience} years</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{application.specialty}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  {application.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onAction(application._id, 'approved')}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                        title="Approve application"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => onAction(application._id, 'rejected')}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                        title="Reject application"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                  {application.status !== 'pending' && (
                    <span className="text-gray-400 text-xs">No actions available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ApplicationTable;