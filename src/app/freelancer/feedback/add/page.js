'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddFeedback() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: '',
    rating: '5',
    review: '',
    projectName: '',
    date: new Date().toISOString().split('T')[0]
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
      router.push('/freelancer/feedback');
    }, 2000);
  };

  const handleCancel = () => {
    router.push('/freelancer/feedback');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header with back button */}
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Back to Feedback
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Feedback</h1>
        <p className="text-gray-600">Submit feedback for your completed projects</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg">
          ✓ Feedback added successfully!
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Name and Project Name */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Project Name *
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="Enter project name"
              />
            </div>
          </div>

          {/* Rating and Date */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Rating (5-Star) *
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
              >
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Very Good</option>
                <option value="3">3 Stars - Good</option>
                <option value="2">2 Stars - Fair</option>
                <option value="1">1 Star - Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
              />
            </div>
          </div>

          {/* Review Textarea */}
          <div>
            <label className="block text-gray-800 font-semibold mb-3">
              Review *
            </label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleChange}
              required
              rows="6"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition resize-none"
              placeholder="Write your feedback here..."
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
              Add Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
