'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BackIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
  </svg>
);

export default function EditJob() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobId: 'JOB-2025-001',
    jobTitle: 'Market Research Study',
    clientName: 'Global Health Solutions',
    budget: 5000,
    status: 'In Progress',
    priority: 'High',
    startDate: '2025-01-10',
    endDate: '2025-02-10',
    description: 'Comprehensive market research for new product launch',
    jobType: 'Research',
    experience: 'Expert',
    category: 'Market Research',
    hourlyRate: 75,
    deliverables: 'Market report with recommendations'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Job details updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors font-semibold"
        >
          <BackIcon />
          Back to Jobs
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Job</h1>
        <p className="text-gray-600">Update job details</p>
      </div>

      {message && (
        <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold">
          ✓ {message}
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-lg p-8">

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Job ID</label>
                <input
                  type="text"
                  name="jobId"
                  value={formData.jobId}
                  disabled
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-500 cursor-not-allowed bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                >
                  <option>Market Research</option>
                  <option>Product Evaluation</option>
                  <option>Survey</option>
                  <option>Consulting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                >
                  <option>Research</option>
                  <option>Consulting</option>
                  <option>Project</option>
                  <option>Hourly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Budget ($)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Hourly Rate ($)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Required Experience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                >
                  <option>Entry Level</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Deliverables</label>
              <textarea
                name="deliverables"
                value={formData.deliverables}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              ></textarea>
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
