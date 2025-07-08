import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

// Mock task data
const mockTasks = Array.from({ length: 20 }, (_, i) => ({
  id: `task-${i + 1}`,
  title: [
    'Website Redesign Project', 'Mobile App Development', 'Logo Design', 
    'Content Writing for Blog', 'Social Media Campaign', 'UI/UX Consultation',
    'Database Optimization', 'SEO Audit', 'Product Photography', 'Video Editing',
  ][i % 10],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  client: [
    'Acme Corp', 'TechStart Inc', 'Global Designs', 'MediaHub', 
    'FoodFinder App', 'Local Business', 'Educational Platform', 'HealthTracker',
  ][i % 8],
  price: Math.floor(Math.random() * 1000) + 100,
  status: ['Pending', 'In Progress', 'Completed', 'Cancelled'][i % 4],
  bids: Math.floor(Math.random() * 10) + 1,
  dueDate: new Date(Date.now() + (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
}));

export default function Tasks() {
  const [tasks, setTasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const tasksPerPage = 8;
  
  // Filter tasks based on search term and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Calculate pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Handle task status change
  const changeTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    setShowDropdown(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Tasks & Bids</h1>
            <p className="mt-1 text-gray-400">Manage tasks and associated bids</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-6 bg-gray-800 shadow-sm rounded-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              <div className="relative inline-block text-left">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    className="block pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm rounded-md bg-gray-700 text-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <AnimatePresence>
            {currentTasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Client: {task.client}
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === task.id ? null : task.id)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {showDropdown === task.id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            {task.status !== 'Completed' && (
                              <button
                                onClick={() => changeTaskStatus(task.id, 'Completed')}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                                role="menuitem"
                              >
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 mr-2 text-green-500" />
                                  Mark as Completed
                                </div>
                              </button>
                            )}
                            {task.status !== 'In Progress' && task.status !== 'Completed' && (
                              <button
                                onClick={() => changeTaskStatus(task.id, 'In Progress')}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                                role="menuitem"
                              >
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                  Mark as In Progress
                                </div>
                              </button>
                            )}
                            {task.status !== 'Cancelled' && (
                              <button
                                onClick={() => changeTaskStatus(task.id, 'Cancelled')}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                                role="menuitem"
                              >
                                <div className="flex items-center">
                                  <X className="h-4 w-4 mr-2 text-red-500" />
                                  Cancel Task
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">
                        Status
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          task.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {task.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-gray-300">
                        Budget
                      </span>
                      <span className="text-sm font-semibold text-white">
                        ${task.price}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-gray-300">
                        Due Date
                      </span>
                      <span className="text-sm text-gray-200">
                        {task.dueDate}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-gray-300">
                        Bids
                      </span>
                      <span className="text-sm text-gray-200">
                        {task.bids} bid{task.bids !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedTask === task.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-700"
                      >
                        <p className="text-sm text-gray-400">
                          {task.description}
                        </p>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-white">Recent Bids:</h4>
                          <ul className="mt-2 space-y-2">
                            {Array.from({ length: Math.min(task.bids, 3) }, (_, i) => (
                              <li key={i} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    Bidder {i + 1}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Proposal: {i === 0 ? 'Top rated' : `${i === 1 ? 'Medium' : 'Basic'} quality`}
                                  </p>
                                </div>
                                <span className="text-sm font-semibold text-white">
                                  ${Math.floor(task.price * (0.8 + (i * 0.1)))}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      className="inline-flex items-center text-sm font-medium text-brand-yellow hover:text-yellow-400"
                    >
                      {expandedTask === task.id ? 'Show Less' : 'View Details'}
                      <ArrowRight className={`ml-1 h-4 w-4 transform transition-transform ${expandedTask === task.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-300">
                Showing <span className="font-medium">{indexOfFirstTask + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastTask, filteredTasks.length)}
                </span>{' '}
                of <span className="font-medium">{filteredTasks.length}</span> tasks
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-600 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  &lsaquo;
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === i + 1
                        ? 'z-10 bg-yellow-900/30 border-brand-yellow text-brand-yellow'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                    } text-sm font-medium`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-600 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  &rsaquo;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}