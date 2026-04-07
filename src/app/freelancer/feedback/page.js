'use client';

import { useState } from 'react';
import Link from 'next/link';

const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-2.975A1 1 0 009 15.85V11a1 1 0 112 0v4.85a1 1 0 00.725.96l5.951 2.975a1 1 0 001.169-1.409l-7-14z"></path>
  </svg>
);

export default function FeedbackPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const completedJobs = [
    {
      id: 1,
      orderNum: 'ORD-2026-040',
      title: 'Product Evaluation - Marketing Campaign',
      completedDate: '2026-02-28',
    },
    {
      id: 2,
      orderNum: 'ORD-2026-035',
      title: 'Survey Participation - Consumer Research',
      completedDate: '2026-02-15',
    },
    {
      id: 3,
      orderNum: 'ORD-2026-030',
      title: 'Retail Store Audit - Regional Assessment',
      completedDate: '2026-02-01',
    },
  ];

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (selectedJob && feedback.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSelectedJob(null);
        setFeedback('');
        setRating(5);
        setSubmitted(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit Feedback</h1>
          <p className="text-gray-600">Share your experience on completed jobs</p>
        </div>
        <Link href="/freelancer/feedback/add">
          <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            Add Feedback
          </button>
        </Link>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ Feedback submitted successfully! You can now upload your invoice.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jobs List */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Completed Jobs</h2>
          <div className="space-y-3">
            {completedJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedJob === job.id
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-sm text-gray-600">{job.orderNum}</p>
                <p className="font-semibold text-gray-900 mt-1">{job.title}</p>
                <p className="text-xs text-gray-500 mt-1">Completed: {job.completedDate}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <div className="lg:col-span-2 bg-white rounded-lg border-2 border-gray-200 p-6">
          {selectedJob ? (
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {completedJobs.find((job) => job.id === selectedJob)?.title}
                </h2>
                <p className="text-gray-600">
                  {completedJobs.find((job) => job.id === selectedJob)?.orderNum}
                </p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  How would you rate this job?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-3 rounded-lg transition-all ${
                        rating >= star ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      <StarIcon />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Your rating: <strong>{rating} out of 5 stars</strong>
                </p>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Detailed Feedback (Required)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience, challenges, and suggestions..."
                  rows="6"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                ></textarea>
                <p className="text-xs text-gray-600 mt-2">
                  Minimum 10 characters required
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!feedback.trim() || feedback.length < 10}
                className="w-full inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <SendIcon />
                Submit Feedback
              </button>
            </form>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"></path>
                </svg>
              </div>
              <p className="text-gray-600 text-lg">Select a job to submit feedback</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
