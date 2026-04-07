'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    profileName: '',
    bio: '',
    skills: '',
    hourlyRate: '',
    experience: '',
    location: ''
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
      router.push('/freelancer/profile');
    }, 2000);
  };

  const handleCancel = () => {
    router.push('/freelancer/profile');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header with back button */}
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Back to Profile
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Profile</h1>
        <p className="text-gray-600">Set up your freelancer profile</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg">
          ✓ Profile saved successfully!
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Name and Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Profile Name *
              </label>
              <input
                type="text"
                name="profileName"
                value={formData.profileName}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="Your professional name"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Hourly Rate and Experience */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Hourly Rate *
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="Enter hourly rate"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-3">
                Experience *
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
                placeholder="e.g., 5 years"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-gray-800 font-semibold mb-3">
              Skills *
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition"
              placeholder="e.g., React, Node.js, Design (comma separated)"
            />
          </div>

          {/* Bio Textarea */}
          <div>
            <label className="block text-gray-800 font-semibold mb-3">
              Bio *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows="6"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-green-600 transition resize-none"
              placeholder="Tell us about yourself and your expertise..."
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
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
