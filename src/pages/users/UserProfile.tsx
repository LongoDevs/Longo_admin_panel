import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'https://africa-south1-longo-79a99.cloudfunctions.net/api/api/admin';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/service-provider/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data.data))
      .catch(() => setError('Failed to fetch user details'))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    try {
      await axios.patch(`${API_URL}/update-service-provider/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser((prev: any) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center text-gray-400">Loading user profile...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-xl shadow-xl"
    >
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-brand-yellow hover:text-yellow-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </button>
      <h2 className="text-2xl font-bold text-white mb-4">Service Provider Profile</h2>
      <div className="space-y-4">
        <div>
          <span className="font-semibold text-gray-300">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-semibold text-gray-300">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold text-gray-300">Phone:</span> {user.phone}
        </div>
        <div>
          <span className="font-semibold text-gray-300">Status:</span> {user.status}
        </div>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => handleStatusUpdate('Approved')}
            disabled={updating || user.status === 'Approved'}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleStatusUpdate('Declined')}
            disabled={updating || user.status === 'Declined'}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            Decline
          </button>
        </div>
        {user.portfolio && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Portfolio</h3>
            {user.portfolio.docs && user.portfolio.docs.length > 0 ? (
              <ul className="list-disc ml-6">
                {user.portfolio.docs.map((doc: any, idx: number) => (
                  <li key={idx}>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-brand-yellow underline">
                      {doc.name || doc.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No documents in portfolio.</p>
            )}
          </div>
        )}
        {user.portfolio && user.portfolio.images && user.portfolio.images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user.portfolio.images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Portfolio ${idx + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-700"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 