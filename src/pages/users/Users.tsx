import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserX, 
  UserCheck, 
  Trash2, 
  Download, 
  Plus,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Shield,
  Briefcase,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import api from '../../context/axiosinterceptor';

const API_URL = import.meta.env.VITE_API_URL;

// Service types available in the system
const serviceTypes = [
  'Legal Advice',
  'Gardening',
  'Plumbing',
  'Tutoring',
  'Home Cleaning',
  'Electrical Work',
  'Carpentry',
  'Painting',
  'Moving Services',
  'Pet Care',
  'Photography',
  'Catering',
  'IT Support',
  'Beauty Services',
  'Fitness Training'
];

interface ServiceProvider {
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Suspended' | 'Inactive';
  dateJoined?: string;
  lastActive?: string;
  services?: string[];
  [key: string]: any;
}

export default function Users() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const providersPerPage = 10;

  useEffect(() => {
    setLoading(true);
    api.get('/all-service-providers')
      .then(res => {
        console.log('Fetched providers:', res.data.data);
        setProviders(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch(() => {
        setError('Failed to fetch service providers');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  

  // Filter providers based on search term and status
  const filteredData = providers.filter(provider => {
    const matchesSearch = 
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || provider.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredData.slice(indexOfFirstProvider, indexOfLastProvider);
  const totalPages = Math.ceil(filteredData.length / providersPerPage);

  // Handle provider selection
  const toggleProviderSelection = (providerId: string) => {
    if (selectedProviders.includes(providerId)) {
      setSelectedProviders(selectedProviders.filter(id => id !== providerId));
    } else {
      setSelectedProviders([...selectedProviders, providerId]);
    }
  };

  // Handle provider status change
  const changeProviderStatus = async (providerId: string, newStatus: string) => {
    try {
      await axios.patch(`${API_URL}/update-service-provider/${providerId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProviders(providers.map(provider => 
        provider.userId === providerId ? { ...provider, status: newStatus as any } : provider
      ));
      setShowDropdown(null);
      toast.success(`Provider status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update provider status');
    }
  };

  // Handle provider deletion
  const deleteProvider = async (providerId: string) => {
    try {
      await axios.delete(`${API_URL}/delete-service-provider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProviders(providers.filter(p => p.userId !== providerId));
      setShowDropdown(null);
      toast.success('Provider deleted successfully');
    } catch {
      toast.error('Failed to delete provider');
    }
  };

  // Add loading/error UI
  if (loading) return <div className="text-center text-gray-400">Loading providers...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Service Providers</h1>
            <p className="mt-1 text-gray-400">Manage and monitor all service providers</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={() => {
                const csvContent = [
                  ['Name', 'Email', 'Phone', 'Status', 'Date Joined'],
                  ...filteredData.map(provider => [
                    provider.name,
                    provider.email,
                    provider.phone,
                    provider.status,
                    provider.dateJoined
                  ])
                ].map(row => row.join(',')).join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'providers-export.csv';
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <div className="relative">
              <button 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-brand-yellow hover:bg-yellow-400"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Provider
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-6 bg-gray-800 shadow-sm rounded-lg"
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
                placeholder="Search providers..."
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
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              {selectedProviders.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2"
                >
                  <span className="text-sm text-gray-300">
                    {selectedProviders.length} selected
                  </span>
                  <button 
                    className="p-2 text-red-400 hover:text-red-300"
                    onClick={() => {
                      const providersToDelete = providers.filter(provider => selectedProviders.includes(provider.userId));
                      
                      setProviders(providers.filter(provider => !selectedProviders.includes(provider.userId)));
                      setSelectedProviders([]);
                      toast.success(`${providersToDelete.length} providers deleted`);
                    }}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="pl-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-600 rounded"
                    checked={currentProviders.length > 0 && selectedProviders.length === currentProviders.length}
                    onChange={() => {
                      if (selectedProviders.length === currentProviders.length) {
                        setSelectedProviders([]);
                      } else {
                        setSelectedProviders(currentProviders.map(p => p.userId));
                      }
                    }}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Provider
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date Joined
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              <AnimatePresence>
                {currentProviders.map((provider, index) => (
                  <motion.tr 
                    key={provider.userId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={selectedProviders.includes(provider.userId) ? 'bg-yellow-900/20' : ''}
                  >
                    <td className="pl-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-600 rounded"
                        checked={selectedProviders.includes(provider.userId)}
                        onChange={() => toggleProviderSelection(provider.userId)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-brand-yellow flex items-center justify-center text-black font-semibold">
                          {provider.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{provider.id}</div>
                          <div className="text-sm text-gray-400">{provider.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{provider.email}</div>
                      <div className="text-sm text-gray-400">{provider.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${provider.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          provider.status === 'Suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {provider.dateJoined}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === provider.userId ? null : provider.userId)}
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {showDropdown === provider.userId && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              onClick={() => {
                                navigate(`/admin/users/${provider.userId}`);
                                setShowDropdown(null);
                              }}
                              className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                              role="menuitem"
                            >
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-2 text-brand-yellow" />
                                View Profile
                              </div>
                            </button>
                            <button
                              onClick={() => deleteProvider(provider.userId)}
                              className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                              role="menuitem"
                            >
                              <div className="flex items-center">
                                <Trash2 className="h-4 w-4 mr-2 text-red-400" />
                                Delete Service Provider
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
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
                Showing <span className="font-medium">{indexOfFirstProvider + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastProvider, filteredData.length)}
                </span>{' '}
                of <span className="font-medium">{filteredData.length}</span> providers
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