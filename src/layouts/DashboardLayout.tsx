import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Bell, User, Search, ChevronDown } from 'lucide-react';
import Sidebar from '../components/navigation/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New user registered', message: 'Sarah Johnson just joined the platform', time: '5 min ago', unread: true },
    { id: 2, title: 'Task completed', message: 'Website redesign project was completed', time: '1 hour ago', unread: true },
    { id: 3, title: 'Payment received', message: 'Payment of $540 was processed', time: '2 hours ago', unread: false },
    { id: 4, title: 'Support ticket', message: 'New support ticket #3849 was opened', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleProfileClick = () => {
    navigate('/admin/profile');
    setShowProfileMenu(false);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-40 flex"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-75"
                onClick={toggleSidebar}
              />
              <div className="relative flex w-full max-w-xs flex-1 flex-col">
                <Sidebar onClose={toggleSidebar} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-gray-900 shadow-sm">
          <div className="flex flex-1 items-center justify-between px-4 md:px-6">
            <div className="flex items-center">
              <button
                type="button"
                className="md:hidden p-2 text-gray-400 hover:text-white"
                onClick={toggleSidebar}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 md:ml-0">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    className="block w-full rounded-md border-0 bg-gray-800 pl-10 pr-3 py-1.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  className="relative p-1 text-gray-400 hover:text-white"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-yellow text-xs font-medium text-black flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-white">Notifications</h3>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg ${
                                notification.unread ? 'bg-yellow-900/20 border border-brand-yellow/30' : 'bg-gray-700'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white">{notification.title}</p>
                                  <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                                {notification.unread && (
                                  <div className="h-2 w-2 bg-brand-yellow rounded-full ml-2 mt-1"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <button 
                            onClick={() => {
                              navigate('/admin/notifications');
                              setShowNotifications(false);
                            }}
                            className="text-sm text-brand-yellow hover:text-yellow-400 font-medium"
                          >
                            View all notifications
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-brand-yellow flex items-center justify-center text-black font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-white">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user?.role}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={handleProfileClick}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                        >
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </button>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-black p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}