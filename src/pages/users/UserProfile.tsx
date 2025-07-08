import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, User, Building, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../context/axiosinterceptor';

const API_URL = import.meta.env.VITE_API_URL;

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    console.log('Fetching user with ID:', id);
    
    api.get(`/service-provider/${id}`)
      .then(res => {
        console.log('API Response:', res.data);
        setUser(res.data.data);
      })
      .catch((error) => {
        console.error('API Error:', error);
        console.error('Error response:', error.response);
        setError(`Failed to fetch user details: ${error.response?.data?.message || error.message}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      await api.patch(`/update-service-provider/${id}`, { status: newStatus });
      setUser((prev: any) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const renderLocationInfo = (location: any) => (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center mb-2">
        <MapPin className="h-4 w-4 text-brand-yellow mr-2" />
        <span className="font-semibold text-gray-300">Location</span>
      </div>
      <div className="space-y-1 text-sm">
        <div><span className="text-gray-400">Province:</span> {location.province}</div>
        <div><span className="text-gray-400">City:</span> {location.city}</div>
        <div><span className="text-gray-400">Suburb:</span> {location.suburb}</div>
        <div><span className="text-gray-400">Address:</span> {location.address}</div>
        {location.service_radius && (
          <div><span className="text-gray-400">Service Radius:</span> {location.service_radius}km</div>
        )}
      </div>
    </div>
  );

  const renderServices = (services: string[]) => (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-2">Services Offered</h3>
      <div className="flex flex-wrap gap-2">
        {services.map((service, idx) => (
          <span key={idx} className="px-3 py-1 bg-brand-yellow text-gray-900 rounded-full text-sm font-medium">
            {service}
          </span>
        ))}
      </div>
    </div>
  );

  const renderPortfolio = (portfolio: any) => (
    <div className="space-y-4">
      {portfolio.docs && portfolio.docs.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FileText className="h-4 w-4 text-brand-yellow mr-2" />
            <h3 className="text-lg font-semibold text-white">Documents</h3>
          </div>
          <ul className="space-y-2">
            {portfolio.docs.map((doc: any, idx: number) => (
              <li key={idx}>
                <a 
                  href={doc.url || doc} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-yellow underline hover:text-yellow-400"
                >
                  {doc.name || `Document ${idx + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {portfolio.images && portfolio.images.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <ImageIcon className="h-4 w-4 text-brand-yellow mr-2" />
            <h3 className="text-lg font-semibold text-white">Portfolio Images</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolio.images.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`Portfolio ${idx + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-700 hover:border-brand-yellow transition-colors"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) return <div className="text-center text-gray-400">Loading user profile...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;
  if (!user) return null;

  const isBusiness = user.provider_type === 'business';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-xl shadow-xl"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-brand-yellow hover:text-yellow-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </button>
      
      <div className="flex items-center mb-6">
        {isBusiness ? (
          <Building className="h-8 w-8 text-brand-yellow mr-3" />
        ) : (
          <User className="h-8 w-8 text-brand-yellow mr-3" />
        )}
        <div>
          <h2 className="text-2xl font-bold text-white">
            {isBusiness ? 'Business Service Provider' : 'Individual Service Provider'} Profile
          </h2>
          <p className="text-gray-400 text-sm">
            Type: {user.provider_type?.charAt(0).toUpperCase() + user.provider_type?.slice(1)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Basic Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 text-brand-yellow mr-2" />
                <span className="font-semibold text-gray-300">Name:</span>
                <span className="ml-2 text-white">{user.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-brand-yellow mr-2" />
                <span className="font-semibold text-gray-300">Email:</span>
                <span className="ml-2 text-white">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-brand-yellow mr-2" />
                <span className="font-semibold text-gray-300">Phone:</span>
                <span className="ml-2 text-white">{user.phone}</span>
              </div>
              {isBusiness && user.bis_reg_num && (
                <div>
                  <span className="font-semibold text-gray-300">Business Registration:</span>
                  <span className="ml-2 text-white">{user.bis_reg_num}</span>
                </div>
              )}
              {user.status && (
                <div>
                  <span className="font-semibold text-gray-300">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    user.status === 'Approved' ? 'bg-green-600 text-white' : 
                    user.status === 'Declined' ? 'bg-red-600 text-white' : 
                    'bg-yellow-600 text-white'
                  }`}>
                    {user.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Update Buttons */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Status Management</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleStatusUpdate('Approved')}
                disabled={updating || user.status === 'Approved'}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate('Declined')}
                disabled={updating || user.status === 'Declined'}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>

          {/* Services */}
          {user.services && user.services.length > 0 && renderServices(user.services)}
        </div>

        {/* Location and Additional Information */}
        <div className="space-y-4">
          {/* Primary Location */}
          {user.location && renderLocationInfo(user.location)}

          {/* Additional Locations for Business */}
          {isBusiness && user.location?.other_locations && user.location.other_locations.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">Additional Locations</h3>
              <div className="space-y-3">
                {user.location.other_locations.map((loc: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-brand-yellow pl-3">
                    <div className="text-sm space-y-1">
                      <div><span className="text-gray-400">Province:</span> {loc.province}</div>
                      <div><span className="text-gray-400">City:</span> {loc.city}</div>
                      <div><span className="text-gray-400">Suburb:</span> {loc.suburb}</div>
                      <div><span className="text-gray-400">Address:</span> {loc.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Section */}
      {user.portfolio && (
        <div className="mt-6">
          {renderPortfolio(user.portfolio)}
        </div>
      )}
    </motion.div>
  );
} 