import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Eye, 
  Users, 
  Mail, 
  FileText, 
  Calendar,
  CheckCircle,
  Clock,
  X,
  Search,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface EmailLog {
  id: string;
  subject: string;
  template: string;
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

const emailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Longo!',
    content: `
      <h1>Welcome to Longo!</h1>
      <p>Thank you for joining our platform. We're excited to have you on board.</p>
      <p>Get started by exploring our services and connecting with service providers.</p>
      <a href="#" style="background: #FFD700; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
    `
  },
  {
    id: '2',
    name: 'Password Reset',
    subject: 'Reset Your Password',
    content: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the button below to proceed.</p>
      <a href="#" style="background: #FFD700; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `
  },
  {
    id: '3',
    name: 'Promotional',
    subject: 'Special Offer - 20% Off!',
    content: `
      <h1>Special Offer Just for You!</h1>
      <p>Get 20% off on all premium services this week only.</p>
      <p>Use code: <strong>SAVE20</strong></p>
      <a href="#" style="background: #FFD700; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Claim Offer</a>
    `
  }
];

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

const mockEmailLogs: EmailLog[] = [
  {
    id: '1',
    subject: 'Welcome to Longo!',
    template: 'Welcome Email',
    target: 'New Users',
    sentAt: '2024-01-15 14:30',
    status: 'sent',
    recipients: 45
  },
  {
    id: '2',
    subject: 'Special Offer - 20% Off!',
    template: 'Promotional',
    target: 'All Users',
    sentAt: '2024-01-14 10:00',
    status: 'sent',
    recipients: 1250
  },
  {
    id: '3',
    subject: 'System Update Notification',
    template: 'Custom',
    target: 'Active Users',
    sentAt: '2024-01-16 09:00',
    status: 'scheduled',
    recipients: 890
  }
];

export default function EmailSender() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [customSubject, setCustomSubject] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [target, setTarget] = useState('all');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [logs, setLogs] = useState<EmailLog[]>(mockEmailLogs);
  const [isLoading, setIsLoading] = useState(false);
  const [useCustom, setUseCustom] = useState(false);
  
  // User selection states
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setCustomSubject(template.subject);
    setCustomContent(template.content);
    setUseCustom(false);
  };

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

  const handleSendEmail = async () => {
    const subject = useCustom ? customSubject : selectedTemplate?.subject;
    const content = useCustom ? customContent : selectedTemplate?.content;

    if (!subject || !content) {
      toast.error('Subject and content are required');
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
      
      const newEmail: EmailLog = {
        id: Date.now().toString(),
        subject,
        template: useCustom ? 'Custom' : selectedTemplate?.name || 'Custom',
        target: target === 'all' ? 'All Users' : 
                target === 'clients' ? 'Clients' : 
                target === 'providers' ? 'Service Providers' : 
                'Selected Users',
        sentAt: isScheduled ? `${scheduleDate} ${scheduleTime}` : new Date().toLocaleString(),
        status: isScheduled ? 'scheduled' : 'sent',
        recipients: getRecipientCount()
      };

      setLogs([newEmail, ...logs]);
      
      // Reset form
      setSelectedTemplate(null);
      setCustomSubject('');
      setCustomContent('');
      setTarget('all');
      setScheduleDate('');
      setScheduleTime('');
      setIsScheduled(false);
      setUseCustom(false);
      setSelectedUsers([]);
      
      toast.success(isScheduled ? 'Email scheduled successfully' : 'Email sent successfully');
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setIsLoading(false);
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
        <h1 className="text-2xl font-bold text-white">Email Sender</h1>
        <p className="mt-1 text-gray-400">Send emails to users using templates or custom content</p>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Email Templates */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-white mb-4">Email Templates</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => setUseCustom(true)}
                className={`w-full text-left p-3 rounded-lg border ${
                  useCustom ? 'border-brand-yellow bg-yellow-900/20' : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-brand-yellow mr-2" />
                  <span className="text-white font-medium">Custom Email</span>
                </div>
              </button>
              
              {emailTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    selectedTemplate?.id === template.id ? 'border-brand-yellow bg-yellow-900/20' : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-white font-medium">{template.name}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{template.subject}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Email Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Compose Email</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center text-brand-yellow hover:text-yellow-400"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  rows={12}
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow font-mono text-sm"
                  placeholder="Email content (HTML supported)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="schedule-email"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-600 rounded"
                  />
                  <label htmlFor="schedule-email" className="ml-2 text-sm text-gray-300">
                    Schedule for later
                  </label>
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
                onClick={handleSendEmail}
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
                    {isScheduled ? 'Schedule Email' : 'Send Email'}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Preview & Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="space-y-4"
        >
          {showPreview && (
            <div className="bg-gray-800 rounded-lg shadow p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Preview</h4>
              <div className="bg-white rounded p-3 text-black text-sm">
                <div className="font-bold mb-2">{customSubject}</div>
                <div dangerouslySetInnerHTML={{ __html: customContent }} />
              </div>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-brand-yellow" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-300">Total Recipients</p>
                <p className="text-2xl font-semibold text-white">
                  {getRecipientCount().toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-300">Sent Today</p>
                <p className="text-2xl font-semibold text-white">12</p>
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

      {/* Email Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mt-8"
      >
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">Email History</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Template
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
                      <div className="text-sm font-medium text-white">{log.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {log.template}
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