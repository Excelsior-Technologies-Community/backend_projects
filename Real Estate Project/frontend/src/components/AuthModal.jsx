import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Heart,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';

export default function AuthModal() {
  const {
    user,
    isAuthenticated,
    isAuthModalOpen,
    authModalMode,
    loading,
    authError,
    setAuthError,
    closeAuthModal,
    switchAuthMode,
    login,
    register,
    logout
  } = useAuth();

  const { showToast, wishlistCount, openWishlist } = useCartWishlist();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  if (!isAuthModalOpen) return null;

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }

    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      showToast({
        title: 'Welcome Back!',
        message: `Logged in as ${result.user.firstName || result.user.email}`,
        type: 'success'
      });
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regFirstName.trim()) {
      setAuthError('Please provide your first name.');
      return;
    }
    if (!regEmail.trim()) {
      setAuthError('Please provide your email address.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }

    const result = await register({
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      password: regPassword
    });

    if (result.success) {
      showToast({
        title: 'Account Created',
        message: `Welcome, ${result.user.firstName}! Your account is now active.`,
        type: 'success'
      });
      setRegFirstName('');
      setRegLastName('');
      setRegEmail('');
      setRegPassword('');
    }
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setAuthError('Please enter your email address.');
      return;
    }
    setForgotSubmitted(true);
    showToast({
      title: 'Password Reset Link Sent',
      message: `If an account exists for ${forgotEmail}, instructions were sent.`,
      type: 'info'
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#161829]/65 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeAuthModal}
      />

      {/* Main Modal Box */}
      <div className="relative w-full max-w-[720px] bg-white rounded-xl shadow-2xl z-10 border border-gray-100 overflow-hidden my-auto animate-fadeIn max-h-[92vh] flex flex-col">
        {/* Top Floating Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto px-6 py-5 sm:px-8 sm:py-6 no-scrollbar">
          
          {/* Back to Shop Header Nav Button (matches screenshot circle with arrow) */}
          <div className="flex justify-center mb-3">
            <button
              type="button"
              onClick={closeAuthModal}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#161829] hover:text-[#63c0ee] transition-colors cursor-pointer group"
            >
              <span className="w-7 h-7 rounded-full border border-gray-400 flex items-center justify-center group-hover:border-[#63c0ee] transition-colors">
                <ArrowLeft size={14} />
              </span>
              <span>Back to Shop</span>
            </button>
          </div>

          {/* ===================== 1. LOGGED IN / PROFILE VIEW ===================== */}
          {isAuthenticated && authModalMode === 'profile' && (
            <div className="max-w-[580px] mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#161829] mb-5">
                My Profile
              </h2>

              <div className="border border-gray-200 rounded-lg p-5 sm:p-7 bg-white shadow-xs">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-[#161829] text-white flex items-center justify-center text-xl font-bold">
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#161829]">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#63c0ee]/15 text-[#63c0ee]">
                      {user.role === 'admin' ? 'Administrator' : 'Customer Account'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-gray-100">
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                    <div className="p-2 rounded-md bg-[#63c0ee]/20 text-[#161829]">
                      <Heart size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Saved Items</p>
                      <p className="text-base font-bold text-[#161829]">{wishlistCount} Properties</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                    <div className="p-2 rounded-md bg-emerald-100 text-emerald-800">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Account Status</p>
                      <p className="text-base font-bold text-emerald-600">Active Verified</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      closeAuthModal();
                      openWishlist();
                    }}
                    className="flex-1 py-2.5 px-4 rounded border border-[#161829] text-[#161829] font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart size={16} />
                    <span>View Wishlist</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeAuthModal();
                    }}
                    className="flex-1 py-2.5 px-4 rounded bg-[#161829] text-white font-medium text-sm hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== 2. LOGIN VIEW ===================== */}
          {(!isAuthenticated || authModalMode !== 'profile') && authModalMode === 'login' && (
            <div className="max-w-[580px] mx-auto">
              {/* Big Page Title */}
              <h2 className="text-3xl font-bold text-center text-[#161829] mb-5 tracking-tight">
                Log In
              </h2>

              {/* Error Message */}
              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-center gap-2 animate-fadeIn">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Main Login Card (Matching Screenshot exactly) */}
              <div className="border border-gray-300 rounded-md bg-white overflow-hidden shadow-xs">
                {/* Card Title Bar */}
                <div className="border-b border-gray-200 px-6 py-3 bg-white">
                  <h3 className="text-base font-bold text-[#161829]">Log In</h3>
                </div>

                {/* Form Area */}
                <div className="p-5 sm:p-6">
                  <p className="text-[14px] text-gray-800 mb-6 font-normal">
                    I am a returning customer
                  </p>

                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    {/* E-mail Field */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-800 mb-2">
                        E-mail <span className="text-red-500">*</span> :
                      </label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#161829] focus:outline-none text-[14px] text-[#161829] placeholder-gray-400 transition-colors"
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-800 mb-2">
                        Password <span className="text-red-500">*</span> :
                      </label>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#161829] focus:outline-none text-[14px] text-[#161829] placeholder-gray-400 pr-10 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        >
                          {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password & Login Button Row */}
                    <div className="pt-2 flex items-center justify-end gap-6">
                      <button
                        type="button"
                        onClick={() => switchAuthMode('forgot')}
                        className="text-[13px] font-medium text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#161829] hover:bg-[#63c0ee] hover:text-[#161829] text-white px-7 py-2.5 rounded text-[14px] font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                      >
                        <span>{loading ? 'Logging in...' : 'Login'}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </form>
                </div>

                {/* Bottom Registration Prompt Bar (Separated with border) */}
                <div className="border-t border-gray-200 px-6 py-6 bg-white flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <span className="text-[14px] text-gray-700">
                    If you dont have account
                  </span>
                  <button
                    type="button"
                    onClick={() => switchAuthMode('register')}
                    className="bg-[#161829] hover:bg-[#63c0ee] hover:text-[#161829] text-white px-7 py-2.5 rounded text-[14px] font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Register</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== 3. REGISTER VIEW ===================== */}
          {(!isAuthenticated || authModalMode !== 'profile') && authModalMode === 'register' && (
            <div className="max-w-[580px] mx-auto">
              {/* Big Title */}
              <h2 className="text-3xl font-bold text-center text-[#161829] mb-5 tracking-tight">
                Register
              </h2>

              {/* Error Message */}
              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-center gap-2 animate-fadeIn">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Main Register Card (Matching Screenshot exactly) */}
              <div className="border border-gray-300 rounded-md bg-white overflow-hidden shadow-xs">
                <form onSubmit={handleRegisterSubmit}>
                  {/* Section 1: Your Personal Details */}
                  <div className="border-b border-gray-200 px-6 py-3 bg-white">
                    <h3 className="text-base font-bold text-[#161829]">Your Personal Details</h3>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
                          First Name <span className="text-red-500">*</span> :
                        </label>
                        <input
                          type="text"
                          required
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          placeholder="First name"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#161829] focus:outline-none text-[14px] text-[#161829] placeholder-gray-400 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
                          Last Name <span className="text-red-500">*</span> :
                        </label>
                        <input
                          type="text"
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          placeholder="Last name"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#161829] focus:outline-none text-[14px] text-[#161829] placeholder-gray-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* E-mail */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
                        E-mail <span className="text-red-500">*</span> :
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:border-[#161829] focus:outline-none text-[14px] text-[#161829] placeholder-gray-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Section 2: Your Password (Password in Cyan / Sky Blue) */}
                  <div className="border-t border-b border-gray-200 px-6 py-3 bg-white">
                    <h3 className="text-base font-bold text-[#161829]">
                      Your <span className="text-[#56B4E9]">Password</span>
                    </h3>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-800 mb-1.5">
                        Password <span className="text-red-500">*</span> :
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#161829] focus:outline-none text-[14px] text-[#161829] placeholder-gray-400 pr-10 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        >
                          {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Bottom Action Area (Create Button on right, Back to Login on left) */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => switchAuthMode('login')}
                        className="text-[13px] font-medium text-gray-600 hover:text-[#56B4E9] transition-colors cursor-pointer"
                      >
                        Already have an account? Log In
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#161829] hover:bg-[#63c0ee] hover:text-[#161829] text-white px-8 py-2.5 rounded text-[14px] font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                      >
                        <span>{loading ? 'Creating...' : 'Create'}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ===================== 4. FORGOT PASSWORD VIEW ===================== */}
          {(!isAuthenticated || authModalMode !== 'profile') && authModalMode === 'forgot' && (
            <div className="max-w-[580px] mx-auto">
              <h2 className="text-3xl font-bold text-center text-[#161829] mb-8 tracking-tight">
                Reset Password
              </h2>

              <div className="border border-gray-300 rounded-md bg-white overflow-hidden shadow-xs p-6 sm:p-8">
                {forgotSubmitted ? (
                  <div className="text-center py-6">
                    <CheckCircle size={44} className="text-emerald-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-[#161829] mb-2">Check Your Email</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      We've sent password reset instructions to <span className="font-semibold">{forgotEmail}</span>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotSubmitted(false);
                        switchAuthMode('login');
                      }}
                      className="bg-[#161829] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#63c0ee] hover:text-[#161829] transition-colors"
                    >
                      Return to Log In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-5">
                    <p className="text-sm text-gray-600">
                      Enter the email address associated with your account, and we will send you a link to reset your password.
                    </p>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-800 mb-2">
                        E-mail <span className="text-red-500">*</span> :
                      </label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:border-[#161829] focus:outline-none text-[14px] text-[#161829]"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => switchAuthMode('login')}
                        className="text-sm font-medium text-gray-600 hover:text-[#161829]"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="bg-[#161829] hover:bg-[#63c0ee] hover:text-[#161829] text-white px-7 py-2.5 rounded text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <span>Send Reset Link</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
