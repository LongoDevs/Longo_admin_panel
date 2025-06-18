import React, { useState, useEffect } from 'react';
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
  Briefcase
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

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

const adminTypes = [
  { value: 'Admin', label: 'Admin', description: 'Full system access except user management' },
  { value: 'Support', label: 'Support Agent', description: 'Handle tickets and user support' },
  { value: 'SuperAdmin', label: 'Super Admin', description: 'Full system control (SuperAdmin only)' }
];

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'Customer' | 'Provider' | 'Admin' | 'Support' | 'SuperAdmin';
  status: 'Active' | 'Suspended' | 'Inactive';
  dateJoined: string;
  lastActive: string;
  services?: string[];
  adminType?: string;
}

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createUserType, setCreateUserType] = useState<'provider' | 'admin'>('provider');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    services: [] as string[],
    adminType: 'Admin'
  });

  const usersPerPage = 10;
  
  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/users`)
      .then(res => setUsers(res.data))
      .catch(err => setError('Failed to fetch users'))
      .finally(() => setLoading(false));
  }, []);

  // Filter users based on search term, status, and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });
  
  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle user selection
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Handle user status change
  const changeUserStatus = async (userId: string, newStatus: string) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus as any } : user
      ));
      setShowDropdown(null);
      toast.success(`User status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update user status');
    }
  };

  // Handle user deletion (only SuperAdmin can delete admins)
  const deleteUser = async (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete && ['Admin', 'Support', 'SuperAdmin'].includes(userToDelete.role) && currentUser?.role !== 'SuperAdmin') {
      toast.error('Only SuperAdmins can delete admin users');
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      setShowDropdown(null);
      toast.success('User deleted successfully');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  // Handle form submission
  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (createUserType === 'provider' && formData.services.length === 0) {
      toast.error('Please select at least one service for the provider');
      return;
    }
    if (createUserType === 'admin' && formData.adminType === 'SuperAdmin' && currentUser?.role !== 'SuperAdmin') {
      toast.error('Only SuperAdmins can create other SuperAdmins');
      return;
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        ...formData,
        role: createUserType === 'provider' ? 'Provider' : formData.adminType,
        services: createUserType === 'provider' ? formData.services : undefined,
        adminType: createUserType === 'admin' ? formData.adminType : undefined
      });
      setUsers([res.data, ...users]);
      setShowCreateModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        services: [],
        adminType: 'Admin'
      });
      toast.success('User created successfully');
    } catch {
      toast.error('Failed to create user');
    }
  };

  // Handle service selection
  const toggleService = (service: string) => {
    if (formData.services.includes(service)) {
      setFormData({
        ...formData,
        services: formData.services.filter(s => s !== service)
      });
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, service]
      });
    }
  };

  // Mock Google Maps autocomplete (in real app, this would use Google Places API)
  const handleAddressChange = (value: string) => {
    setFormData({ ...formData, address: value });
    // In real implementation, this would trigger Google Places autocomplete
  };

  // Add loading/error UI
  if (loading) return <div className="text-center text-gray-400">Loading users...</div>;
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
            <h1 className="text-2xl font-bold text-white">Users</h1>
            <p className="mt-1 text-gray-400">Manage and monitor all users</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={() => {
                const csvContent = [
                  ['Name', 'Email', 'Phone', 'Role', 'Status', 'Date Joined'],
                  ...filteredUsers.map(user => [
                    user.name,
                    user.email,
                    user.phone,
                    user.role,
                    user.status,
                    user.dateJoined
                  ])
                ].map(row => row.join(',')).join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'users-export.csv';
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
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-brand-yellow hover:bg-yellow-400"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
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
                placeholder="Search users..."
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
              <div className="relative inline-block text-left">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    className="block pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm rounded-md bg-gray-700 text-white"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="All">All Roles</option>
                    <option value="Customer">Customer</option>
                    <option value="Provider">Service Provider</option>
                    <option value="Admin">Admin</option>
                    <option value="Support">Support</option>
                    <option value="SuperAdmin">Super Admin</option>
                  </select>
                </div>
              </div>
              {selectedUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2"
                >
                  <span className="text-sm text-gray-300">
                    {selectedUsers.length} selected
                  </span>
                  <button 
                    className="p-2 text-red-400 hover:text-red-300"
                    onClick={() => {
                      const usersToDelete = users.filter(user => selectedUsers.includes(user.id));
                      const adminUsers = usersToDelete.filter(u => ['Admin', 'Support', 'SuperAdmin'].includes(u.role));
                      
                      if (adminUsers.length > 0 && currentUser?.role !== 'SuperAdmin') {
                        toast.error('Only SuperAdmins can delete admin users');
                        return;
                      }
                      
                      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
                      setSelectedUsers([]);
                      toast.success(`${usersToDelete.length} users deleted`);
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
                    checked={currentUsers.length > 0 && selectedUsers.length === currentUsers.length}
                    onChange={() => {
                      if (selectedUsers.length === currentUsers.length) {
                        setSelectedUsers([]);
                      } else {
                        setSelectedUsers(currentUsers.map(u => u.id));
                      }
                    }}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
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
                {currentUsers.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={selectedUsers.includes(user.id) ? 'bg-yellow-900/20' : ''}
                  >
                    <td className="pl-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-600 rounded"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-brand-yellow flex items-center justify-center text-black font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{user.email}</div>
                      <div className="text-sm text-gray-400">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{user.role}</div>
                      {user.services && (
                        <div className="text-xs text-gray-400">
                          {user.services.slice(0, 2).join(', ')}
                          {user.services.length > 2 && ` +${user.services.length - 2} more`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          user.status === 'Suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.dateJoined}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === user.id ? null : user.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      {showDropdown === user.id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              onClick={() => changeUserStatus(user.id, user.status === 'Suspended' ? 'Active' : 'Suspended')}
                              className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                              role="menuitem"
                            >
                              {user.status === 'Suspended' ? (
                                <div className="flex items-center">
                                  <UserCheck className="h-4 w-4 mr-2 text-green-400" />
                                  Reactivate User
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <UserX className="h-4 w-4 mr-2 text-red-400" />
                                  Suspend User
                                </div>
                              )}
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="w-full text-left block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                              role="menuitem"
                            >
                              <div className="flex items-center">
                                <Trash2 className="h-4 w-4 mr-2 text-red-400" />
                                Delete User
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
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastUser, filteredUsers.length)}
                </span>{' '}
                of <span className="font-medium">{filteredUsers.length}</span> users
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

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-white">
                    Create New {createUserType === 'provider' ? 'Service Provider' : 'Admin User'}
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* User Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    User Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setCreateUserType('provider')}
                      className={`p-4 rounded-lg border-2 text-left ${
                        createUserType === 'provider'
                          ? 'border-brand-yellow bg-yellow-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Briefcase className="h-5 w-5 text-brand-yellow mr-2" />
                        <span className="font-medium text-white">Service Provider</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Create a user who provides services to customers
                      </p>
                    </button>
                    <button
                      onClick={() => setCreateUserType('admin')}
                      className={`p-4 rounded-lg border-2 text-left ${
                        createUserType === 'admin'
                          ? 'border-brand-yellow bg-yellow-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Shield className="h-5 w-5 text-brand-yellow mr-2" />
                        <span className="font-medium text-white">Admin User</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Create an admin or support user
                      </p>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                          placeholder="Enter full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                          placeholder="+27 XX XXX XXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleAddressChange(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                          placeholder="Start typing address..."
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Address autocomplete powered by Google Maps
                      </p>
                    </div>
                  </div>

                  {/* Service Provider Specific Fields */}
                  {createUserType === 'provider' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Services Provided *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-600 rounded-md p-3 bg-gray-700">
                        {serviceTypes.map((service) => (
                          <label key={service} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.services.includes(service)}
                              onChange={() => toggleService(service)}
                              className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-600 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-300">{service}</span>
                          </label>
                        ))}
                      </div>
                      {formData.services.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-400">Selected services:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.services.map((service) => (
                              <span
                                key={service}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-yellow text-black"
                              >
                                {service}
                                <button
                                  onClick={() => toggleService(service)}
                                  className="ml-1 text-black hover:text-gray-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Admin Specific Fields */}
                  {createUserType === 'admin' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Admin Type *
                      </label>
                      <div className="space-y-3">
                        {adminTypes.map((type) => (
                          <label key={type.value} className="flex items-start">
                            <input
                              type="radio"
                              name="adminType"
                              value={type.value}
                              checked={formData.adminType === type.value}
                              onChange={(e) => setFormData({ ...formData, adminType: e.target.value })}
                              disabled={type.value === 'SuperAdmin' && currentUser?.role !== 'SuperAdmin'}
                              className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-600 mt-1"
                            />
                            <div className="ml-3">
                              <span className="text-sm font-medium text-white">{type.label}</span>
                              <p className="text-xs text-gray-400">{type.description}</p>
                              {type.value === 'SuperAdmin' && currentUser?.role !== 'SuperAdmin' && (
                                <p className="text-xs text-red-400">Only SuperAdmins can create SuperAdmins</p>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateUser}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-brand-yellow hover:bg-yellow-400"
                  >
                    Create {createUserType === 'provider' ? 'Service Provider' : 'Admin User'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}