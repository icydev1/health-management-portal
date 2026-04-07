'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditAnalyticsRecord() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    reportName: '',
    dateRange: '',
    totalRevenue: '',
    totalOrders: '',
    activeFreelancers: '',
    avgRating: '',
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
      router.push('/admin/analytics');
    }, 2000);
  };

  const handleCancel = () => {
    router.push('/admin/analytics');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Back to Analytics
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Analytics Record</h1>
        <p className="text-gray-600">Update analytics data and metrics</p>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg">
          ✓ Analytics record updated successfully!
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Report Name *</label>
              <input
                type="text"
                name="reportName"
                value={formData.reportName}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="Enter report name"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Date Range *</label>
              <input
                type="text"
                name="dateRange"
                value={formData.dateRange}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="e.g., January 2025"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Total Revenue *</label>
              <input
                type="number"
                name="totalRevenue"
                value={formData.totalRevenue}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Total Orders *</label>
              <input
                type="number"
                name="totalOrders"
                value={formData.totalOrders}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Active Freelancers *</label>
              <input
                type="number"
                name="activeFreelancers"
                value={formData.activeFreelancers}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">Average Rating *</label>
              <input
                type="number"
                name="avgRating"
                value={formData.avgRating}
                onChange={handleChange}
                required
                step="0.1"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="0.0"
              />
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
              placeholder="Analytics description..."
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
              Update Analytics
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
 

