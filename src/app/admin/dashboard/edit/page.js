'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditDashboardWidget() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    widgetName: '',
    widgetType: 'Summary',
    refreshInterval: '30',
    displayCurrency: 'USD',
    description: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 2000);
  };

  const handleCancel = () => {
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Dashboard Widget</h1>
        <p className="text-gray-600">Update dashboard widget settings</p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg">
          ✓ Dashboard widget updated successfully!
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Widget Name *</label>
              <input
                type="text"
                name="widgetName"
                value={formData.widgetName}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="Enter widget name"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Widget Type *</label>
              <select
                name="widgetType"
                value={formData.widgetType}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
              >
                <option value="Summary">Summary</option>
                <option value="Detailed">Detailed</option>
                <option value="Compact">Compact</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Refresh Interval (seconds) *</label>
              <input
                type="text"
                name="refreshInterval"
                value={formData.refreshInterval}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="30"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Display Currency *</label>
              <select
                name="displayCurrency"
                value={formData.displayCurrency}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-3">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition resize-none"
              placeholder="Widget description..."
            />
          </div>

          <div className="flex gap-4 justify-end pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition"
            >
              Update Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
    


