import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  CreditCard, 
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import axios from 'axios';

interface AnalyticsData {
  period: string;
  users: number;
  tasks: number;
  revenue: number;
  completionRate: number;
}

export default function Analytics() {
  const [dateRange, setDateRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/analytics`, { params: { range: dateRange } })
      .then(res => {
        setAnalyticsData(res.data.analytics || []);
        setTopPerformers(res.data.topPerformers || []);
      })
      .catch(() => setError('Failed to fetch analytics'))
      .finally(() => setLoading(false));
  }, [dateRange]);

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const currentData = analyticsData[analyticsData.length - 1] || { users: 0, tasks: 0, revenue: 0, completionRate: 0 };
  const previousData = analyticsData[analyticsData.length - 2] || { users: 0, tasks: 0, revenue: 0, completionRate: 0 };

  const userGrowth = calculateGrowth(currentData.users, previousData.users || 1);
  const taskGrowth = calculateGrowth(currentData.tasks, previousData.tasks || 1);
  const revenueGrowth = calculateGrowth(currentData.revenue, previousData.revenue || 1);

  const exportData = () => {
    const csvContent = [
      ['Period', 'Users', 'Tasks', 'Revenue', 'Completion Rate'],
      ...analyticsData.map(data => [
        data.period,
        data.users,
        data.tasks,
        data.revenue,
        data.completionRate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center text-gray-400">Loading analytics...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
            <p className="mt-1 text-gray-400">Track performance and generate insights</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-brand-yellow"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Total Users</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-white">{currentData.users.toLocaleString()}</div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    parseFloat(userGrowth) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {parseFloat(userGrowth) >= 0 ? (
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                    ) : (
                      <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                    )}
                    <span className="ml-1">{userGrowth}%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Briefcase className="h-8 w-8 text-indigo-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Active Tasks</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-white">{currentData.tasks.toLocaleString()}</div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    parseFloat(taskGrowth) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {parseFloat(taskGrowth) >= 0 ? (
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                    ) : (
                      <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                    )}
                    <span className="ml-1">{taskGrowth}%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Monthly Revenue</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-white">${currentData.revenue.toLocaleString()}</div>
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    parseFloat(revenueGrowth) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {parseFloat(revenueGrowth) >= 0 ? (
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                    ) : (
                      <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                    )}
                    <span className="ml-1">{revenueGrowth}%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-amber-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-400 truncate">Completion Rate</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-white">{currentData.completionRate}%</div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                    <span className="ml-1">2.3%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Revenue Trend</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.map((data, index) => (
                <div key={data.period} className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.revenue / 45000) * 200}px` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="w-full bg-brand-yellow rounded-t-sm min-h-[4px]"
                  />
                  <span className="text-xs text-gray-400 mt-2">{data.period}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">User Growth</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.map((data, index) => (
                <div key={data.period} className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.users / 2000) * 200}px` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="w-full bg-blue-500 rounded-t-sm min-h-[4px]"
                  />
                  <span className="text-xs text-gray-400 mt-2">{data.period}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mt-8"
      >
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">Top Performers</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Earnings/Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tasks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {topPerformers.map((performer, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-brand-yellow flex items-center justify-center text-black font-semibold">
                          {performer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{performer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        performer.type === 'Provider' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {performer.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      ${('earnings' in performer ? performer.earnings : performer.spent).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {performer.tasks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{performer.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}