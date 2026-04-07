'use client';

import Link from 'next/link';

const TrendingIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
  </svg>
);

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Comprehensive business insights and metrics</p>
        </div>
        {/* <Link href="/admin/analytics/add">
          <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            Add Analytics
          </button>
        </Link> */}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: '€45,320', change: '+23.5%', icon: TrendingIcon, color: 'from-green-400 to-green-600' },
          { label: 'Orders Completed', value: '28', change: '+12%', icon: BarChartIcon, color: 'from-blue-400 to-blue-600' },
          { label: 'Active Freelancers', value: '2,543', change: '+8%', icon: TrendingIcon, color: 'from-purple-400 to-purple-600' },
          { label: 'Avg. Completion Rate', value: '94.2%', change: '+2.1%', icon: BarChartIcon, color: 'from-yellow-400 to-yellow-600' },
        ].map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-green-600 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">{kpi.label}</h3>
                <div className={`bg-gradient-to-br ${kpi.color} p-3 rounded-lg text-white`}>
                  <Icon />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</p>
              <p className="text-sm text-green-600 font-semibold">{kpi.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue Trend (Last 6 Months)</h2>
          <div className="h-64 flex items-end gap-2">
            {[35, 42, 38, 51, 58, 65].map((value, index) => (
              <div key={index} className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg" style={{ height: `${value}%` }}></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status Distribution</h2>
          <div className="space-y-4">
            {[
              { label: 'Completed', value: '28', percentage: 35, color: 'bg-green-600' },
              { label: 'Assigned', value: '62', percentage: 50, color: 'bg-blue-600' },
              { label: 'Open', value: '45', percentage: 42, color: 'bg-yellow-600' },
              { label: 'Cancelled', value: '7', percentage: 20, color: 'bg-red-600' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-700 font-semibold">{item.label}</p>
                  <span className="text-lg font-bold text-gray-900">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Freelancers by Revenue */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 5 Freelancers by Revenue</h2>
          <div className="space-y-4">
            {[
              { name: 'Sarah Ahmed', revenue: '€3,450', jobs: 18 },
              { name: 'Mike Chen', revenue: '€2,880', jobs: 12 },
              { name: 'Jessica Park', revenue: '€2,340', jobs: 8 },
              { name: 'Alex Brown', revenue: '€1,950', jobs: 6 },
              { name: 'Emma Wilson', revenue: '€1,680', jobs: 5 },
            ].map((freelancer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{freelancer.name}</p>
                    <p className="text-sm text-gray-600">{freelancer.jobs} jobs completed</p>
                  </div>
                </div>
                <p className="font-bold text-green-600 text-lg">{freelancer.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Feedback Scores Distribution</h2>
          <div className="space-y-4">
            {[
              { rating: '5 Stars', count: '142', percentage: 85 },
              { rating: '4 Stars', count: '18', percentage: 35 },
              { rating: '3 Stars', count: '4', percentage: 10 },
              { rating: '2 Stars', count: '2', percentage: 3 },
              { rating: '1 Star', count: '1', percentage: 2 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-700 font-semibold">{item.rating}</p>
                  <span className="text-gray-600 text-sm">{item.count} reviews</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Reports */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Reports</h2>
            <p className="text-gray-600">Download detailed reports for further analysis</p>
          </div>
          <div className="flex gap-4">
            <button className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              <DownloadIcon />
              Download CSV
            </button>
            <button className="inline-flex items-center gap-2 bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition-colors">
              <DownloadIcon />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
