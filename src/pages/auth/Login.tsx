import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, Copy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;
//const API_URL = 'https://africa-south1-longo-79a99.cloudfunctions.net/api/api/admin';


export default function Login() {
  const navigate = useNavigate();
  const { setUser, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'credentials' | '2fa-setup' | '2fa-verify'>('credentials');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [qrCode, setQrCode] = useState('');

  // Handle login with email/password
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      // Call backend to login and check 2FA status
      const res = await axios.post(`${API_URL}/admin-login`, { email, password });
      console.log("Testing response",res.data)
      if (res.data.details.two_fa_enabled) {
        setStep('2fa-verify');
        toast.success('2FA enabled. Please enter your code.');
      } else {
        // If 2FA not enabled, get QR and secret for setup
        const setupRes = await axios.post(`${API_URL}/init-2fa`, { email });
        setSecretKey(setupRes.data.secret);
        setQrCode(setupRes.data.qrCodeBase64);
        setStep('2fa-setup');
        toast.success('Set up 2FA to continue.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA setup (enable 2FA after scanning QR and entering code)
  const handle2faSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp) {
      setError('Verification code is required');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/enable-2fa`, {
        email,
        secret_key: secretKey,
        code: otp,
      });
      toast.success('2FA enabled! Please login again.');
      setStep('credentials');
      setOtp('');
      setSecretKey('');
      setQrCode('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to enable 2FA.');
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA verification
  const handle2faVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp) {
      setError('Verification code is required');
      return;
    }
    setLoading(true);
    try {
      await login(email, password, otp, secretKey, () => {
        toast.success('Login successful!');
        navigate('/admin');
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to verify code.');
    } finally {
      setLoading(false);
    }
  };

 
  const copySecretKey = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      toast.success('Secret key copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = secretKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Secret key copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-400 text-center">
            {step === 'credentials' && 'Enter your credentials'}
            {step === '2fa-setup' && 'Set up Two-Factor Authentication'}
            {step === '2fa-verify' && 'Enter your 2FA code'}
          </p>
        </div>
        <div className="px-8 pb-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg flex items-start"
            >
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
          {step === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-black bg-brand-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="h-5 w-5 border-2 border-black border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
          {step === '2fa-setup' && (
            <form onSubmit={handle2faSetup}>
              <div className="space-y-5">
                <div className="text-center">
                  <p className="text-gray-300 mb-2">Scan this QR code with your authenticator app:</p>
                  {qrCode && (
                    <img
                      src={`data:image/png;base64,${qrCode}`}
                      alt="2FA QR Code"
                      className="mx-auto mb-4 w-40 h-40 bg-white p-2 rounded"
                    />
                  )}
                  <p className="text-gray-300 mb-2">Or enter this secret key manually:</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="bg-gray-800 text-white p-2 rounded inline-block font-mono text-sm max-w-xs truncate">
                      {secretKey}
                    </div>
                    <button
                      type="button"
                      onClick={copySecretKey}
                      className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      title="Copy secret key"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                    Enter verification code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full pl-3 pr-3 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                    placeholder="Enter code from app"
                    maxLength={6}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-black bg-brand-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="h-5 w-5 border-2 border-black border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Enable 2FA
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
          {step === '2fa-verify' && (
            <form onSubmit={handle2faVerify}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                    Two-Factor Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-black bg-brand-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="h-5 w-5 border-2 border-black border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Verify
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/forgot-password')}
          className="text-sm text-brand-yellow hover:text-yellow-400 hover:underline"
        >
          Forgot Password?
        </button>
      </div>
    </motion.div>
  );
}