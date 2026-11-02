import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Mail, Phone, MapPin, Globe, Save, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    site_title: 'Realestate WorkDo',
    site_logo: '/logo.png',
    contact_email: 'support@realestate-workdo.com',
    contact_phone: '+1 (800) 456-7890',
    contact_address: '750 5th Avenue, Suite 1200, New York, NY 10019',
    currency: 'USD',
    currency_symbol: '$',
    facebook_url: 'https://facebook.com/realestateworkdo',
    instagram_url: 'https://instagram.com/realestateworkdo',
    twitter_url: 'https://twitter.com/realestateworkdo'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Email Test State
  const [testEmail, setTestEmail] = useState('bannajiofficial05@gmail.com');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    api.get('/settings')
      .then(res => {
        if (res.data && Object.keys(res.data).length > 0) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.post('/settings', settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await api.post('/settings/test-email', { email: testEmail });
      setTestResult({ success: true, message: res.data.message });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.response?.data?.error || err.message || 'Email delivery failed'
      });
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      
      {/* Title Bar */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Website Settings & Email Service</h1>
        <p className="text-sm text-gray-500 mt-1">Configure global contact details, social links, and test automated Nodemailer delivery.</p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>All settings saved successfully to MySQL database via Stored Procedures.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-xs border border-gray-100 p-6 md:p-8 space-y-6">
        
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>General Platform Branding</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Website Title</label>
              <input
                type="text"
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency_symbol}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-blue-600" />
            <span>Contact & Support Information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Public Inquiries Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Headquarters Office Address</label>
            <input
              type="text"
              value={settings.contact_address}
              onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Social Media Channels</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.facebook_url}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Twitter / X URL</label>
              <input
                type="url"
                value={settings.twitter_url}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

      {/* Live Email Service Testing Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Email Service Test Center</h2>
            <p className="text-xs text-slate-300">Test live Nodemailer SMTP dispatch for both user confirmation and admin lead alerts.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Target recipient email..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleTestEmail}
            disabled={testingEmail}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {testingEmail ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Dispatch Test Email</span>
              </>
            )}
          </button>
        </div>

        {testResult && (
          <div className={`mt-4 p-4 rounded-xl border text-xs flex items-start gap-2 ${
            testResult.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default Settings;
