'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddSetting() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    settingKey: '',
    settingValue: '',
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
      router.push('/freelancer/settings');
    }, 2000);
  };

  const handleCancel = () => {
    router.push('/freelancer/settings');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header with back button */}
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Back to Settings
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Setting</h1>
        <p className="text-gray-600">Add a new configuration setting</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg">
          ✓ Setting saved successfully!
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Setting Key and Value */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Setting Key *
              </label>
              <input
                type="text"
                name="settingKey"
                value={formData.settingKey}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="e.g., notification_email"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Setting Value *
              </label>
              <input
                type="text"
                name="settingValue"
                value={formData.settingValue}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="Enter the setting value"
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-gray-800 font-semibold mb-3">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition resize-none"
              placeholder="Enter a description of this setting..."
            />
          </div>

          {/* Buttons */}
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
              Save Setting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
