import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  CreditCard, 
  TicketCheck,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Smartphone,
  Globe,
  TrendingUp
} from 'lucide-react';
import StatsCard from './components/StatsCard';
import ActivityFeed from './components/ActivityFeed';
import Chart from './components/Chart';

export default function Dashboard() {
  // Simulated stats data
  const stats = [
    { 
      title: 'Total Users', 
      value: '8,549', 
      change: '+12.5%', 
      isPositive: true, 
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Active Tasks', 
      value: '1,243', 
      change: '+7.2%', 
      isPositive: true, 
      icon: Briefcase, 
      color: 'bg-indigo-500' 
    },
    { 
      title: 'Monthly Revenue', 
      value: '$32,594', 
      change: '-3.1%', 
      isPositive: false, 
      icon: CreditCard, 
      color: 'bg-emerald-500' 
    },
    { 
      title: 'Open Tickets', 
      value: '28', 
      change: '-24.5%', 
      isPositive: true, 
      icon: TicketCheck, 
      color: 'bg-amber-500' 
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-gray-400">Welcome to your admin dashboard</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Performance Overview</h2>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  12.5%
                </span>
                <select className="text-sm border-gray-600 rounded-md bg-gray-700 text-white">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This year</option>
                </select>
              </div>
            </div>
            <Chart />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className="bg-gray-800 rounded-lg shadow p-6 h-full">
            <h2 className="font-semibold text-white mb-4">Recent Activity</h2>
            <ActivityFeed />
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2"
      >
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="font-semibold text-white mb-4">Task Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white">Pending Tasks</p>
                  <p className="text-sm text-gray-400">Tasks awaiting action</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-white">67</span>
            </div>
            <div className="h-px bg-gray-700"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-3">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white">In Progress</p>
                  <p className="text-sm text-gray-400">Tasks currently active</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-white">128</span>
            </div>
            <div className="h-px bg-gray-700"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-white">Completed</p>
                  <p className="text-sm text-gray-400">Tasks successfully finished</p>
                </div>
              </div>
              <span className="text-lg font-semibold text-white">1,043</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="font-semibold text-white mb-4">Platform Analytics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-300">Mobile App Traffic</span>
                <span className="text-sm font-medium text-gray-300">78%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-brand-yellow h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-300">Web Platform Usage</span>
                <span className="text-sm font-medium text-gray-300">22%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-300">Active Sessions</span>
                <span className="text-sm font-medium text-gray-300">1,247</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-300">API Response Time</span>
                <span className="text-sm font-medium text-gray-300">95ms</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Smartphone className="h-4 w-4 text-brand-yellow mr-1" />
                  <span className="text-xs text-gray-400">Mobile</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-xs text-gray-400">Web</span>
                </div>
              </div>
              <button className="text-brand-yellow text-sm hover:text-yellow-400 font-medium">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}