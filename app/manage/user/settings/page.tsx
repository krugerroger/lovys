"use client";
// app/manage/user/settings/page.tsx
import { ProfileFormData } from '@/types/settings';
import { useState } from 'react';

export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState<ProfileFormData>({
    agencyName: '',
    website: '',
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Profile settings</h1>
        
        <div className="space-y-6">
          {/* Agency name */}
          <div className="flex items-center gap-8">
            <label className="w-48 text-gray-700 text-sm">
              Agency name
            </label>
            <input
              type="text"
              name="agencyName"
              value={formData.agencyName}
              onChange={handleChange}
              className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Website address */}
          <div className="flex items-center gap-8">
            <label className="w-48 text-gray-700 text-sm">
              Your website address
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-8">
            <label className="w-48 text-gray-700 text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 px-4 py-3 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Username */}
          <div className="flex items-center gap-8">
            <label className="w-48 text-gray-700 text-sm">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="flex-1 px-4 py-3 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* New password */}
          <div className="flex items-center gap-8">
            <label className="w-48 text-gray-700 text-sm">
              New password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Current password */}
          <div className="flex items-center gap-8">
            <label className="w-48 text-gray-700 text-sm">
              Current password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-8 pt-4">
            <div className="w-48"></div>
            <button
              onClick={handleSave}
              className="px-12 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}