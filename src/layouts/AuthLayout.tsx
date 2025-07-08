import { Outlet } from 'react-router-dom';
import { LongoLogo } from '../components/ui/LongoLogo';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <LongoLogo className="h-12 w-auto mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Everyone You Need</h2>
          <p className="text-gray-400">Access the Longo admin dashboard</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}