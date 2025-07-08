import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Users from './pages/users/Users';
import UserProfile from './pages/users/UserProfile';
import Tasks from './pages/tasks/Tasks';
import Tickets from './pages/tickets/Tickets';
import Notifications from './pages/notifications/Notifications';
import EmailSender from './pages/email/EmailSender';
import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';


function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: 'forgot-password',
          element: <ForgotPassword />,
        },
      ],
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: 'users',
          element: <Users />,
        },
        {
          path: 'users/:id',
          element: <UserProfile />,
        },
        {
          path: 'tasks',
          element: <Tasks />,
        },
        {
          path: 'tickets',
          element: <Tickets />,
        },
        {
          path: 'notifications',
          element: <Notifications />,
        },
        {
          path: 'email',
          element: <EmailSender />,
        },
        {
          path: 'analytics',
          element: <Analytics />,
        },
        {
          path: 'settings',
          element: <Settings />,
        },
        {
          path: 'profile',
          element: <Profile />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;