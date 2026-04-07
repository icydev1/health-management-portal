'use client';

import { useState } from 'react';

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
  </svg>
);

const BackIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
  </svg>
);

export default function SettingsEditPage() {
  const [formData, setFormData] = useState({
    notifications: {
      emailNotifications: true,
      jobAlerts: true,
      paymentNotifications: true,
      feedbackNotifications: true,
      promotions: false
    },
    privacy: {
      profileVisibility: 'Public',
      showEmail: false,
      showPhone: false,
      showLocation: true
    },
    preferences: {
      theme: 'Dark',
      currency: 'USD',
      language: 'English',
      timezone: 'UTC'
    },
    security: {
      twoFactorAuth: true,
      passwordExpiry: 90,
      loginAlerts: true
    },
    autoAcceptJobs: false,
    minJobAmount: 100,
    description: 'Manage your account settings and preferences'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors font-semibold"
        >
          <BackIcon />
          Back to Settings
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {message && (
        <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold">
          ✓ {message}
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications.emailNotifications"
                  checked={formData.notifications.emailNotifications}
                  onChange={handleChange}
                  className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                />
                <span className="text-gray-800">Email Notifications</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications.jobAlerts"
                    checked={formData.notifications.jobAlerts}
                    onChange={handleChange}
                    className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                  />
                  <span className="text-gray-800">Job Alerts</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications.paymentNotifications"
                    checked={formData.notifications.paymentNotifications}
                    onChange={handleChange}
                    className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                  />
                  <span className="text-gray-800">Payment Notifications</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications.feedbackNotifications"
                    checked={formData.notifications.feedbackNotifications}
                    onChange={handleChange}
                    className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                  />
                  <span className="text-gray-800">Feedback Notifications</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications.promotions"
                    checked={formData.notifications.promotions}
                    onChange={handleChange}
                    className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                  />
                  <span className="text-gray-800">Promotional Offers</span>
                </label>
              </div>
            </div>

            <div className="border-b-2 border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Profile Visibility</label>
                <select
                  name="privacy.profileVisibility"
                  value={formData.privacy.profileVisibility}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                >
                  <option>Public</option>
                  <option>Private</option>
                  <option>Clients Only</option>
                </select>
              </div>

              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacy.showEmail"
                    checked={formData.privacy.showEmail}
                    onChange={handleChange}
                    className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                  />
                  <span className="text-gray-800">Show Email in Profile</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacy.showPhone"
                    checked={formData.privacy.showPhone}
                    onChange={handleChange}
                    className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                  />
                  <span className="text-gray-800">Show Phone in Profile</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacy.showLocation"
                    checked={formData.privacy.showLocation}
                    onChange={handleChange}
                    className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                  />
                  <span className="text-gray-800">Show Location in Profile</span>
                </label>
              </div>
            </div>

            <div className="border-b-2 border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Theme</label>
                  <select
                    name="preferences.theme"
                    value={formData.preferences.theme}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                  >
                    <option>Dark</option>
                    <option>Light</option>
                    <option>Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Currency</label>
                  <select
                    name="preferences.currency"
                    value={formData.preferences.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Language</label>
                  <select
                    name="preferences.language"
                    value={formData.preferences.language}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                  >
                    <option>English</option>
                    <option>German</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Timezone</label>
                  <select
                    name="preferences.timezone"
                    value={formData.preferences.timezone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                  >
                    <option>UTC</option>
                    <option>EST</option>
                    <option>CST</option>
                    <option>PST</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-b-2 border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
              
              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="security.twoFactorAuth"
                    checked={formData.security.twoFactorAuth}
                    onChange={handleChange}
                    className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                  />
                  <span className="text-gray-800">Two-Factor Authentication</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="security.loginAlerts"
                    checked={formData.security.loginAlerts}
                    onChange={handleChange}
                    className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                  />
                  <span className="text-gray-800">Login Alerts</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Password Expiry (days)</label>
                <input
                  type="number"
                  name="security.passwordExpiry"
                  value={formData.security.passwordExpiry}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="border-b-2 border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Preferences</h2>
              
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  name="autoAcceptJobs"
                  checked={formData.autoAcceptJobs}
                  onChange={handleChange}
                  className="w-4 h-4 border-2 border-gray-200 rounded text-green-600 accent-green-600"
                />
                <span className="text-gray-800">Auto Accept Jobs</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Minimum Job Amount ($)</label>
                <input
                  type="number"
                  name="minJobAmount"
                  value={formData.minJobAmount}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded font-medium transition"
              >
                <SaveIcon />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    
  );
}
