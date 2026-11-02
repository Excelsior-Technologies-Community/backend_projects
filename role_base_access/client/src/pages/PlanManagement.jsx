import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import {
  CreditCard,
  Plus,
  Edit2,
  Power,
  Check,
  AlertCircle,
  CheckCircle,
  X,
  Calendar,
  Layers,
} from 'lucide-react';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 199,
    durationInDays: 30,
    featuresText: '',
    isActive: true,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await api.get('/plans/admin');
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error('Error fetching admin plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedPlanId(null);
    setFormData({
      name: '',
      description: '',
      price: 299,
      durationInDays: 30,
      featuresText: 'Standard Dashboard Access\nCustomer Support\nBasic Analytics',
      isActive: true,
    });
    setFeedback({ type: '', message: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setIsEditing(true);
    setSelectedPlanId(plan._id);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      durationInDays: plan.durationInDays,
      featuresText: plan.features?.join('\n') || '',
      isActive: plan.isActive,
    });
    setFeedback({ type: '', message: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const features = formData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      durationInDays: Number(formData.durationInDays),
      features,
      isActive: formData.isActive,
    };

    try {
      if (isEditing) {
        const res = await api.put(`/plans/${selectedPlanId}`, payload);
        if (res.success) {
          setFeedback({ type: 'success', message: `Plan '${res.plan.name}' updated successfully!` });
        }
      } else {
        const res = await api.post('/plans', payload);
        if (res.success) {
          setFeedback({ type: 'success', message: `Plan '${res.plan.name}' created successfully!` });
        }
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleToggleStatus = async (plan) => {
    try {
      const res = await api.patch(`/plans/${plan._id}/status`);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        fetchPlans();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Subscription Plan Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure pricing tiers, validity periods, feature lists, and active states.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback({ type: '', message: '' })}>
            <X className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* Plans Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`rounded-2xl p-6 border flex flex-col justify-between transition ${
              plan.isActive
                ? 'bg-slate-900/80 border-slate-800 shadow-xl'
                : 'bg-slate-950/60 border-slate-800/60 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white text-lg">{plan.name}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    plan.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4 min-h-[36px]">{plan.description}</p>

              <div className="mb-4 pb-4 border-b border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-white">₹{plan.price}</span>
                  <span className="text-xs text-slate-400 ml-1">/ {plan.durationInDays} days</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Features:
                </span>
                {plan.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(plan)}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Plan</span>
              </button>

              <button
                onClick={() => handleToggleStatus(plan)}
                className={`p-1.5 rounded-lg transition ${
                  plan.isActive
                    ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                }`}
                title={plan.isActive ? 'Deactivate' : 'Activate'}
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/40">
              <h3 className="font-bold text-white text-base">
                {isEditing ? `Edit Plan: ${formData.name}` : 'Create Subscription Plan'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                  Plan Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Enterprise Tier"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short summary of this plan"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.durationInDays}
                    onChange={(e) => setFormData({ ...formData, durationInDays: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                  Features (One per line)
                </label>
                <textarea
                  rows="4"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
                  />
                  <span className="text-xs text-slate-300 font-medium">Plan is Active & Available for Customers</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                >
                  {isEditing ? 'Save Plan Changes' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;
