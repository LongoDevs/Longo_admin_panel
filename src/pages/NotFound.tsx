import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* 404 Image */}
        <div className="mb-8">
          <img 
            src="../public/404.jpg" 
            alt="404 Error" 
            className="w-64 h-64 mx-auto rounded-lg object-cover opacity-80"
          />
        </div>
        
        <h1 className="text-9xl font-bold text-brand-yellow">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-white">Page Not Found</h2>
        <p className="mt-2 text-lg text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/admin" 
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-brand-yellow hover:bg-yellow-400"
        >
          <Home className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}