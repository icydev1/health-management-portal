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

export default function FreelancerDashboardEditPage() {
  const [formData, setFormData] = useState({
    dashboardTitle: 'My Dashboard',
    refreshInterval: 30,
    defaultView: 'Summary',
    widgetsEnabled: {
      earnings: true,
      activeJobs: true,
      upcomingJobs: true,
      ratings: true,
      recentFeedback: true,
      payouts: true
    },
    chartType: 'Line',
    dateRange: '30days',
    displayCurrency: 'USD',
    theme: 'Dark',
    notificationPreference: 'All',
    description: 'Personalized dashboard for freelancer'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: checked }
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
    setMessage('Dashboard preferences updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <BackIcon />
            <h1 className="text-3xl font-bold text-white">Edit Dashboard Settings</h1>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded text-green-300">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Dashboard Title</label>
              <input
                type="text"
                name="dashboardTitle"
                value={formData.dashboardTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Refresh Interval (seconds)</label>
                <input
                  type="number"
                  name="refreshInterval"
                  value={formData.refreshInterval}
                  onChange={handleChange}
                  min="5"
                  max="300"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default View</label>
                <select
                  name="defaultView"
                  value={formData.defaultView}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option>Summary</option>
                  <option>Detailed</option>
                  <option>Compact</option>
                </select>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Widget Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData.widgetsEnabled).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name={`widgetsEnabled.${key}`}
                      checked={value}
                      onChange={handleChange}
                      className="w-4 h-4 bg-slate-700 border border-slate-600 rounded"
                    />
                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Display Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chart Type</label>
                  <select
                    name="chartType"
                    value={formData.chartType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Line</option>
                    <option>Bar</option>
                    <option>Pie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                  <select
                    name="dateRange"
                    value={formData.dateRange}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                  <select
                    name="displayCurrency"
                    value={formData.displayCurrency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Dark</option>
                    <option>Light</option>
                    <option>Auto</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notification Preference</label>
              <select
                name="notificationPreference"
                value={formData.notificationPreference}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option>All</option>
                <option>Important Only</option>
                <option>None</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
              >
                <SaveIcon />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
