import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  TicketCheck, 
  Bell, 
  Mail, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Tasks & Bids', href: '/admin/tasks', icon: Briefcase },
  { name: 'Support Tickets', href: '/admin/tickets', icon: TicketCheck },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Email Sender', href: '/admin/email', icon: Mail },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-gray-900">
      <div className="flex h-16 flex-shrink-0 items-center justify-between px-4">
        <div className="flex items-center">
     
      <img
        src="../public/longo_logo.png"
        alt="Longo Logo"
        className="h-20 w-20 object-contain border-radius-23"
      />
      <span className="ml-3 text-2xl font-bold text-white tracking-wide"></span>
    </div>
        {onClose && (
          <button
            type="button"
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <nav className="flex-1 space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2.5 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-brand-yellow text-black'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
              end={item.href === '/admin'}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? 'text-black'
                        : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-highlight"
                      className="absolute left-0 w-1 h-6 bg-brand-yellow rounded-r-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-800 p-4">
        <button 
          onClick={logout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-300" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}