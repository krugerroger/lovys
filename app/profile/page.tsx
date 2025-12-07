import { ProfileData } from '@/types/profile';
import React, { useState } from 'react';

export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState<ProfileData>({
    email: '',
    username: '',
    newPassword: '',
    currentPassword: ''
  });

const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
};

  const handleSave = () => {
    console.log('Form data saved:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header with breadcrumb */}
      <div className="bg-gray-900 text-white px-6 py-3 text-sm">
        <span className="font-semibold">Ladys.one</span>
        <span className="text-gray-400 mx-2">/</span>
        <span className="text-gray-400">Profile settings</span>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile settings</h1>
          
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* New password */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                New password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Current password */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Current password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition font-medium"
            >
              Save
            </button>
          </div>

          {/* Contact with administrator */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact with administrator</h2>
            <p className="text-gray-700">
              Please, send message to{' '}
              <a href="mailto:info@ladys.one" className="text-blue-600 hover:underline">
                info@ladys.one
              </a>
            </p>
          </div>

          {/* Delete account */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Delete account?</h2>
            <p className="text-gray-700">
              Please, send message to{' '}
              <a href="mailto:info@ladys.one" className="text-blue-600 hover:underline">
                info@ladys.one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}