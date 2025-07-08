import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Users, 
  Calendar, 
  Bell, 
  AlertTriangle, 
  Info, 
  Gift,
  Clock,
  CheckCircle,
  X,
  Search,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface NotificationLog {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'info' | 'promotion' | 'welcome';
  target: string;
  sentAt: string;
  status: 'sent' | 'scheduled' | 'failed';
  recipients: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Provider';
}

const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: [
    'Sarah Johnson', 'Michael Chen', 'Emily Wilson', 'David Kim', 
    'Jessica Martinez', 'Robert Smith', 'Jennifer Lee', 'Alex Thompson',
    'Lisa Garcia', 'Daniel Brown', 'Maria Rodriguez', 'James Taylor',
  ][i % 12],
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Provider' : 'Customer'
}));

const mockNotificationLogs: NotificationLog[] = [
  {
    id: '1',
    title: 'Welcome to Longo!',
    message: 'Thank you for joining our platform. Start exploring services now!',
    type: 'welcome',
    target: 'New Users',
    sentAt: '2024-01-15 14:30',
    status: 'sent',
    recipients: 45
  },
  {
    id: '2',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2-4 AM',
    type: 'urgent',
    target: 'All Users',
    sentAt: '2024-01-15 14:30',
    status: 'sent',
    recipients: 1250
  },
  {
    id: '3',
    title: 'New Feature Release',
    message: 'Check out our new task management features!',
    type: 'info',
    target: 'Active Users',
    sentAt: '2024-01-14 10:00',
    status: 'sent',
    recipients: 890
  },
  {
    id: '4',
    title: 'Special Offer',
    message: '20% off on all premium services this week',
    type: 'promotion',
    target: 'Premium Users',
    sentAt: '2024-01-16 09:00',
    status: 'scheduled',
    recipients: 340
  }
];

const notificationTemplates = {
  welcome: {
    title: 'Welcome to Longo!',
    message: 'Thank you for joining our platform. We\'re excited to have you on board! Start exploring our services and connect with amazing service providers in your area.'
  },
  maintenance: {
    title: 'System Maintenance Notice',
    message: 'We will be performing scheduled maintenance to improve your experience. The platform may be temporarily unavailable during this time.'
  },
  promotion: {
    title: 'Special Offer Just for You!',
    message: 'Don\'t miss out on our limited-time offer. Get exclusive discounts on premium services.'
  },
  feature: {
    title: 'New Feature Available',
    message: 'We\'ve added exciting new features to enhance your experience. Check them out now!'
  }
};

export default function Notifications() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'urgent' | 'info' | 'promotion' | 'welcome'>('info');
  const [target, setTarget] = useState('all');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [logs, setLogs] = useState<NotificationLog[]>(mockNotificationLogs);
  const [isLoading, setIsLoading] = useState(false);
  
  // User selection states
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    
    if (target === 'clients') return matchesSearch && user.role === 'Customer';
    if (target === 'providers') return matchesSearch && user.role === 'Provider';
    return matchesSearch;
  });

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const getRecipientCount = () => {
    if (target === 'specific' && selectedUsers.length > 0) {
      return selectedUsers.length;
    }
    
    switch (target) {
      case 'all': return mockUsers.length;
      case 'clients': return mockUsers.filter(u => u.role === 'Customer').length;
      case 'providers': return mockUsers.filter(u => u.role === 'Provider').length;
      default: return 0;
    }
  };

  const handleTemplateSelect = (templateKey: string) => {
    const template = notificationTemplates[templateKey as keyof typeof notificationTemplates];
    if (template) {
      setTitle(template.title);
      setMessage(template.message);
      if (templateKey === 'welcome') setType('welcome');
      else if (templateKey === 'maintenance') setType('urgent');
      else if (templateKey === 'promotion') setType('promotion');
      else setType('info');
    }
  };

  const handleSendNotification = async () => {
    if (!title || !message) {
      toast.error('Title and message are required');
      return;
    }

    if (target === 'specific' && selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newNotification: NotificationLog = {
        id: Date.now().toString(),
        title,
        message,
        type,
        target: target === 'all' ? 'All Users' : 
                target === 'clients' ? 'Clients' : 
                target === 'providers' ? 'Service Providers' : 
                'Selected Users',
        sentAt: isScheduled ? `${scheduleDate} ${scheduleTime}` : new Date().toLocaleString(),
        status: isScheduled ? 'scheduled' : 'sent',
        recipients: getRecipientCount()
      };

      setLogs([newNotification, ...logs]);
      
      // Reset form
      setTitle('');
      setMessage('');
      setType('info');
      setTarget('all');
      setScheduleDate('');
      setScheduleTime('');
      setIsScheduled(false);
      setSelectedUsers([]);
      
      toast.success(isScheduled ? 'Notification scheduled successfully' : 'Notification sent successfully');
    } catch (error) {
      toast.error('Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'promotion': return <Gift className="h-5 w-5 text-purple-500" />;
      case 'welcome': return <UserCheck className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <X className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <p className="mt-1 text-gray-400">Send push notifications to users</p>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Templates */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <div className="bg-gray-800 rounded-lg shadow p-4 mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Quick Templates</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleTemplateSelect('welcome')}
                className="w-full text-left p-3 rounded-lg border border-gray-600 hover:border-green-500 hover:bg-green-900/20"
              >
                <div className="flex items-center">
                  <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-white font-medium">Welcome Message</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">For new users</p>
              </button>
              
              <button
                onClick={() => handleTemplateSelect('maintenance')}
                className="w-full text-left p-3 rounded-lg border border-gray-600 hover:border-red-500 hover:bg-red-900/20"
              >
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-white font-medium">Maintenance Notice</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">System updates</p>
              </button>
              
              <button
                onClick={() => handleTemplateSelect('promotion')}
                className="w-full text-left p-3 rounded-lg border border-gray-600 hover:border-purple-500 hover:bg-purple-900/20"
              >
                <div className="flex items-center">
                  <Gift className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-white font-medium">Promotional Offer</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">Special deals</p>
              </button>
              
              <button
                onClick={() => handleTemplateSelect('feature')}
                className="w-full text-left p-3 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-blue-900/20"
              >
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-white font-medium">New Feature</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">Product updates</p>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Send Notification Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Send Notification</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                  placeholder="Notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                  placeholder="Notification message"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'urgent' | 'info' | 'promotion' | 'welcome')}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-brand-yellow"
                  >
                    <option value="info">Info</option>
                    <option value="welcome">Welcome</option>
                    <option value="urgent">Urgent</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-brand-yellow"
                  >
                    <option value="all">All Users</option>
                    <option value="clients">Clients Only</option>
                    <option value="providers">Service Providers Only</option>
                    <option value="specific">Select Specific Users</option>
                  </select>
                </div>
              </div>

              {/* User Selection */}
              {target === 'specific' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border border-gray-600 rounded-md p-4 bg-gray-700"
                >
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Select Users ({selectedUsers.length} selected)
                    </label>
                    <button
                      onClick={() => setShowUserSelector(!showUserSelector)}
                      className="text-brand-yellow hover:text-yellow-400 text-sm"
                    >
                      {showUserSelector ? 'Hide' : 'Show'} User List
                    </button>
                  </div>
                  
                  {showUserSelector && (
                    <div>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                          placeholder="Search users..."
                        />
                      </div>
                      
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {filteredUsers.map((user) => (
                          <label key={user.id} className="flex items-center p-2 hover:bg-gray-600 rounded">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                              className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-600 rounded"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white">{user.name}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  user.role === 'Provider' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                  {user.role}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="schedule"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-600 rounded"
                />
                <label htmlFor="schedule" className="ml-2 text-sm text-gray-300">
                  Schedule for later
                </label>
              </div>

              {isScheduled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-brand-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-brand-yellow"
                    />
                  </div>
                </motion.div>
              )}

              <button
                onClick={handleSendNotification}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-black bg-brand-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="h-5 w-5 border-2 border-black border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {isScheduled ? 'Schedule Notification' : 'Send Now'}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="space-y-4"
        >
          <div className="bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-brand-yellow" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-300">Total Recipients</p>
                <p className="text-2xl font-semibold text-white">{getRecipientCount().toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-300">Sent Today</p>
                <p className="text-2xl font-semibold text-white">24</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-300">Scheduled</p>
                <p className="text-2xl font-semibold text-white">3</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Notification Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mt-8"
      >
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">Notification History</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Notification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{log.title}</div>
                        <div className="text-sm text-gray-400 truncate max-w-xs">{log.message}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(log.type)}
                        <span className="ml-2 text-sm text-gray-300 capitalize">{log.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {log.target}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {log.recipients.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(log.status)}
                        <span className={`ml-2 text-sm capitalize ${
                          log.status === 'sent' ? 'text-green-400' :
                          log.status === 'scheduled' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {log.sentAt}
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