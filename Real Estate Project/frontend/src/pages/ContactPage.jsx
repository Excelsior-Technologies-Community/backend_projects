import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit contact request');

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-14">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 text-[#63c0ee] text-xs font-bold uppercase tracking-wider mb-3">
            Get In Touch
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#161829] tracking-tight">
            Contact Our Advisory Team
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Have an inquiry about an estate listing or interested in partnering with us? Reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Info cards */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#63c0ee] flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Direct Email</h3>
              <p className="text-xs text-gray-500 mt-1">support@realestate-workdo.com</p>
              <p className="text-xs text-gray-400 mt-0.5">24/7 lead desk</p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#63c0ee] flex items-center justify-center mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Concierge Phone</h3>
              <p className="text-xs text-gray-500 mt-1">+1 (800) 456-7890</p>
              <p className="text-xs text-gray-400 mt-0.5">Mon - Sat, 8:00 AM - 8:00 PM EST</p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#63c0ee] flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Headquarters</h3>
              <p className="text-xs text-gray-500 mt-1">750 5th Avenue, Suite 1200</p>
              <p className="text-xs text-gray-400 mt-0.5">New York, NY 10019, USA</p>
            </div>
          </div>

          {/* Contact Form with Automated Email Triggers */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
            <h2 className="text-xl font-bold text-[#161829] mb-1">Send Us a Direct Message</h2>
            <p className="text-xs text-gray-400 mb-6">Our brokerage team typically replies within 2 to 4 business hours.</p>

            {success ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-900">Message Dispatched!</h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Thank you for reaching out. A confirmation has been logged and sent to your email.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Inquiry Details *</label>
                  <textarea
                    rows="5"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you are looking for..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#63c0ee]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-[#63c0ee] hover:bg-[#52aada] active:bg-[#439acb] text-white font-semibold text-sm transition shadow-lg shadow-[#63c0ee]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
