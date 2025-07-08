import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  MessageSquare, 
  CheckCircle,
  Clock,
  Send,
  MoreHorizontal,
  X
} from 'lucide-react';

// Mock ticket data
const mockTickets = Array.from({ length: 15 }, (_, i) => ({
  id: `ticket-${i + 1}`,
  subject: [
    'Cannot login to my account', 'Payment not processing', 'How to update profile',
    'Task cancellation request', 'Dispute with provider', 'App crashes on Android',
    'Cannot see my bids', 'Missing notification', 'Refund request',
  ][i % 9],
  user: [
    'john.doe@example.com', 'sarah.smith@example.com', 'mike.jones@example.com',
    'anna.wilson@example.com', 'robert.brown@example.com', 'emily.clark@example.com',
  ][i % 6],
  status: ['Open', 'In Progress', 'Resolved'][i % 3],
  priority: ['Low', 'Medium', 'High', 'Urgent'][i % 4],
  category: ['Account', 'Payment', 'Technical', 'Dispute', 'Other'][i % 5],
  createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  assignedTo: i % 3 === 0 ? 'Unassigned' : ['Sarah', 'Michael', 'David', 'Emma'][i % 4],
  messages: [
    {
      author: 'User',
      content: 'I am having an issue with the system. Can you please help?',
      time: '2 days ago'
    },
    ...(i % 2 === 0 ? [{
      author: 'Support',
      content: 'I understand your concern. Could you please provide more details?',
      time: '1 day ago'
    }] : []),
    ...(i % 4 === 0 ? [{
      author: 'User',
      content: 'Here are the details you requested...',
      time: '12 hours ago'
    }] : [])
  ]
}));

export default function Tickets() {
  const [tickets, setTickets] = useState(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const ticketsPerPage = 8;
  
  // Filter tickets based on search term, status, and priority
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ticket.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  // Calculate pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  // Handle ticket status change
  const changeTicketStatus = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
    setShowDropdown(null);
  };

  // Handle assigning ticket
  const assignTicket = (ticketId: string, assignee: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? { ...ticket, assignedTo: assignee } : ticket
    ));
    setShowDropdown(null);
  };

  // Handle reply submission
  const handleReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId ? {
        ...ticket,
        messages: [
          ...ticket.messages,
          {
            author: 'Support',
            content: replyText,
            time: 'Just now'
          }
        ],
        status: ticket.status === 'Open' ? 'In Progress' : ticket.status
      } : ticket
    ));
    
    setReplyText('');
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage customer support requests</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              <div className="relative inline-block text-left">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    className="block pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="relative inline-block text-left">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    className="block pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="All">All Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {currentTickets.map((ticket, index) => (
                <motion.li 
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${expandedTicket === ticket.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}`}
                >
                  <div className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                          ticket.priority === 'Urgent' ? 'bg-red-500' :
                          ticket.priority === 'High' ? 'bg-orange-500' :
                          ticket.priority === 'Medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 
                              className="text-base font-medium text-gray-900 dark:text-white cursor-pointer"
                              onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                            >
                              {ticket.subject}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              ticket.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              From: {ticket.user}
                            </div>
                          </div>
                          <div className="mt-1 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex space-x-4">
                              <span>ID: #{ticket.id.split('-')[1]}</span>
                              <span>{ticket.category}</span>
                              <span>Created: {ticket.createdAt}</span>
                            </div>
                            <div>
                              Assigned to: {ticket.assignedTo}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="relative">
                          <button
                            onClick={() => setShowDropdown(showDropdown === ticket.id ? null : ticket.id)}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                          {showDropdown === ticket.id && (
                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1" role="menu" aria-orientation="vertical">
                                {ticket.status !== 'Resolved' && (
                                  <button
                                    onClick={() => changeTicketStatus(ticket.id, 'Resolved')}
                                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    role="menuitem"
                                  >
                                    <div className="flex items-center">
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                      Mark as Resolved
                                    </div>
                                  </button>
                                )}
                                {ticket.status !== 'In Progress' && ticket.status !== 'Resolved' && (
                                  <button
                                    onClick={() => changeTicketStatus(ticket.id, 'In Progress')}
                                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    role="menuitem"
                                  >
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                      Mark as In Progress
                                    </div>
                                  </button>
                                )}
                                <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>
                                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                  Assign to:
                                </div>
                                {['Sarah', 'Michael', 'David', 'Emma'].map(name => (
                                  <button
                                    key={name}
                                    onClick={() => assignTicket(ticket.id, name)}
                                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    role="menuitem"
                                  >
                                    {name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedTicket === ticket.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4"
                        >
                          <div className="space-y-4">
                            {ticket.messages.map((message, i) => (
                              <div key={i} className={`flex ${message.author === 'User' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`inline-block max-w-lg px-4 py-2 rounded-lg ${
                                  message.author === 'User' 
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' 
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                                }`}>
                                  <div className="flex items-center mb-1">
                                    <span className="font-medium">{message.author}</span>
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {ticket.status !== 'Resolved' && (
                            <div className="mt-4">
                              <div className="flex items-start space-x-3">
                                <div className="min-w-0 flex-1">
                                  <div className="relative">
                                    <textarea
                                      rows={3}
                                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                      placeholder="Write a reply..."
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                    />
                                  </div>
                                  <div className="mt-3 flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                      <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                                        Save Draft
                                      </button>
                                    </div>
                                    <button
                                      type="submit"
                                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                      onClick={() => handleReply(ticket.id)}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Send Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{indexOfFirstTicket + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastTicket, filteredTickets.length)}
                </span>{' '}
                of <span className="font-medium">{filteredTickets.length}</span> tickets
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
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
                        ? 'z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                    } text-sm font-medium`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
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