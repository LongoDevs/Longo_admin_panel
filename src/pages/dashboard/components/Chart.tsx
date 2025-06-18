import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock data for the chart
const generateChartData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 30000) + 10000,
    users: Math.floor(Math.random() * 500) + 100
  }));
};

export default function Chart() {
  const [chartData, setChartData] = useState(generateChartData());
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'users'>('revenue');

  // Calculate max values for scaling
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const maxUsers = Math.max(...chartData.map(d => d.users));
  
  // Chart dimensions
  const height = 220;

  return (
    <div>
      <div className="mb-4 flex items-center justify-end space-x-4">
        <div className="flex items-center">
          <button
            onClick={() => setActiveMetric('revenue')}
            className={`flex items-center text-sm px-3 py-1 rounded-md ${
              activeMetric === 'revenue' 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              activeMetric === 'revenue' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}></span>
            Revenue
          </button>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setActiveMetric('users')}
            className={`flex items-center text-sm px-3 py-1 rounded-md ${
              activeMetric === 'users' 
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              activeMetric === 'users' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}></span>
            Users
          </button>
        </div>
      </div>
      
      <div className="relative h-[250px]">
        <div className="absolute inset-0 flex items-end justify-between px-2">
          {chartData.map((data, index) => {
            const value = activeMetric === 'revenue' ? data.revenue : data.users;
            const maxValue = activeMetric === 'revenue' ? maxRevenue : maxUsers;
            const color = activeMetric === 'revenue' ? 'bg-blue-500' : 'bg-emerald-500';
            
            return (
              <div key={data.month} className="flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: (value / maxValue) * height }}
                  transition={{ duration: 0.8, delay: index * 0.05, type: 'spring', bounce: 0.2 }}
                  className={`w-[24px] ${color} rounded-t-sm`}
                />
                
                {/* Month label */}
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">{data.month}</div>
              </div>
            );
          })}
        </div>
        
        {/* Y-axis gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-6">
          {[0, 1, 2, 3, 4].map((_, i) => (
            <div 
              key={i} 
              className="w-full h-px bg-gray-200 dark:bg-gray-700"
              style={{ bottom: `${(i / 4) * height}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}