import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Upload, 
  MapPin, 
  Key, 
  Palette, 
  Globe,
  Image,
  Settings as SettingsIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AppSettings {
  appName: string;
  logo: string;
  favicon: string;
  googleMapsApiKey: string;
  allowedRegions: string[];
  primaryColor: string;
  secondaryColor: string;
  supportEmail: string;
  supportPhone: string;
}

const southAfricanProvinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
];

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    appName: 'Longo',
    logo: '/public/longo.png',
    favicon: '/favicon.ico',
    googleMapsApiKey: '',
    allowedRegions: ['Gauteng', 'Western Cape', 'KwaZulu-Natal'],
    primaryColor: '#FFD700',
    secondaryColor: '#000000',
    supportEmail: 'support@longo.app',
    supportPhone: '+27 11 123 4567'
  });

  useEffect(() => {
    // Only set from env if not already set
    if (!settings.googleMapsApiKey) {
      setSettings((prev: AppSettings) => ({
        ...prev,
        googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || ''
      }));
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Mock API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update document title
      document.title = `${settings.appName} Admin Panel`;
      
      // Update favicon
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (favicon) {
        favicon.href = settings.favicon;
      }
      
      // Update CSS custom properties for colors
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
      
      console.log('Settings saved:', settings);
      
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (type: 'logo' | 'favicon') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setSettings(prev => ({ ...prev, [type]: result }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRegionToggle = (region: string) => {
    setSettings(prev => ({
      ...prev,
      allowedRegions: prev.allowedRegions.includes(region)
        ? prev.allowedRegions.filter(r => r !== region)
        : [...prev.allowedRegions, region]
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'branding', name: 'Branding', icon: Palette },
    { id: 'location', name: 'Location', icon: MapPin },
    { id: 'integrations', name: 'Integrations', icon: Key },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-gray-400">Manage application settings and configuration</p>
      </motion.div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity:  1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="lg:w-64"
        >
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-brand-yellow text-black'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex-1"
        >
          <div className="bg-gray-800 rounded-lg shadow">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">General Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Application Name
                    </label>
                    <input
                      type="text"
                      value={settings.appName}
                      onChange={(e) => setSettings(prev => ({ ...prev, appName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will update the system name throughout the application
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Support Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.supportPhone}
                        onChange={(e) => setSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Branding Settings */}
            {activeTab === 'branding' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">Branding Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Logo (Login & System)
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                        {settings.logo ? (
                          <img src={settings.logo} alt="Logo" className="h-full w-full object-contain" />
                        ) : (
                          <Image className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <button
                        onClick={() => handleFileUpload('logo')}
                        className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 200x200px, PNG or JPG format. This logo will appear on login page and throughout the system.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Favicon
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                        {settings.favicon ? (
                          <img src={settings.favicon} alt="Favicon" className="h-full w-full object-contain" />
                        ) : (
                          <Image className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <button
                        onClick={() => handleFileUpload('favicon')}
                        className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Favicon
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 32x32px, ICO or PNG format
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="h-10 w-16 border border-gray-600 rounded-md"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="h-10 w-16 border border-gray-600 rounded-md"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Location Settings */}
            {activeTab === 'location' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">Location Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Allowed Regions in South Africa
                    </label>
                    <p className="text-sm text-gray-400 mb-4">
                      Select the provinces where your service is available
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {southAfricanProvinces.map((province) => (
                        <label key={province} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.allowedRegions.includes(province)}
                            onChange={() => handleRegionToggle(province)}
                            className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-600 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-300">{province}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-brand-yellow mr-2" />
                      <h4 className="text-sm font-medium text-white">Selected Regions</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {settings.allowedRegions.map((region) => (
                        <span
                          key={region}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-yellow text-black"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                    {settings.allowedRegions.length === 0 && (
                      <p className="text-sm text-gray-400">No regions selected</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">Integrations</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Google Maps API Key
                    </label>
                    <p className="text-sm text-gray-400 mb-2">
                      Required for location services, address autocomplete, and mapping functionality
                    </p>
                    <input
                      type="password"
                      value={settings.googleMapsApiKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, googleMapsApiKey: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-yellow"
                      placeholder="Enter your Google Maps API key"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get your API key from the{' '}
                      <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:underline">
                        Google Cloud Console
                      </a>
                    </p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Key className="h-5 w-5 text-brand-yellow mr-2" />
                      <h4 className="text-sm font-medium text-white">API Status</h4>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        settings.googleMapsApiKey ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm text-gray-300">
                        {settings.googleMapsApiKey ? 'API Key Configured' : 'API Key Required'}
                      </span>
                    </div>
                    {settings.googleMapsApiKey && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400">
                          Key: {settings.googleMapsApiKey.substring(0, 8)}...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="px-6 py-4 bg-gray-900 border-t border-gray-700 rounded-b-lg">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-brand-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}