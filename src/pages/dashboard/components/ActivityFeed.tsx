import { motion } from 'framer-motion';
import { UserPlus, ClipboardCheck, MessageSquare, CreditCard } from 'lucide-react';

// Mock activity data
const activities = [
  {
    id: 1,
    type: 'user',
    content: 'Sarah Johnson registered as a new user',
    time: '5 minutes ago',
    icon: UserPlus,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    type: 'task',
    content: 'Task "Website Redesign" was completed',
    time: '1 hour ago',
    icon: ClipboardCheck,
    color: 'bg-green-500',
  },
  {
    id: 3,
    type: 'ticket',
    content: 'New support ticket #3849 was opened',
    time: '2 hours ago',
    icon: MessageSquare,
    color: 'bg-amber-500',
  },
  {
    id: 4,
    type: 'payment',
    content: 'Payment of $540 was received from client',
    time: '5 hours ago',
    icon: CreditCard,
    color: 'bg-purple-500',
  },
  {
    id: 5,
    type: 'user',
    content: 'Michael Chen updated his profile',
    time: '1 day ago',
    icon: UserPlus,
    color: 'bg-blue-500',
  },
];

export default function ActivityFeed() {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, index) => (
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={activity.id}
          >
            <div className="relative pb-8">
              {index < activities.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div>
                  <div className={`${activity.color} h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800`}>
                    <activity.icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {activity.content}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
      <div className="mt-2 text-center">
        <button className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-800 dark:hover:text-blue-300 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
}