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

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
  </svg>
);

export default function ProfileEditPage() {
  const [formData, setFormData] = useState({
    fullName: 'Sarah Ahmed',
    email: 'sarah@example.com',
    phone: '+49 123 456 7890',
    location: 'Berlin, Germany',
    region: 'North Region',
    bio: 'Professional freelancer with 5+ years of experience in product evaluation and market research.',
    qualifications: ['Product Evaluation', 'Market Research', 'Customer Feedback', 'Survey Participation'],
    bankAccount: 'DE89 3704 0044 0532 0130 00',
    bankName: 'Sample Bank',
    hourlyRate: 75,
    profileVisibility: 'Public',
    verificationStatus: 'Verified'
  });

  const [message, setMessage] = useState('');
  const [newQualification, setNewQualification] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification],
      }));
      setNewQualification('');
    }
  };

  const handleRemoveQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Profile updated successfully!');
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
          Back to Profile
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Profile</h1>
        <p className="text-gray-600">Update your professional profile information</p>
      </div>

      {message && (
        <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-semibold">
          ✓ {message}
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Profile Visibility</label>
                <select
                  name="profileVisibility"
                  value={formData.profileVisibility}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
                >
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h2>
            
            <div className="space-y-3">
              {formData.qualifications.map((qual, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded border-2 border-gray-200">
                  <span className="text-gray-800">{qual}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQualification(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                placeholder="Add new qualification"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddQualification}
                className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded font-medium"
              >
                Add
              </button>
            </div>
          </div>

          <div className="border-b-2 border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">Account Number</label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded text-gray-900 focus:border-green-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-200">
            <p className="text-sm text-gray-700">
              <strong>Verification Status:</strong> {formData.verificationStatus}
            </p>
          </div>

          <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded font-medium transition"
            >
              <SaveIcon />
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
