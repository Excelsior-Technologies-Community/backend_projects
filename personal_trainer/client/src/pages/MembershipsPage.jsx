import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Sparkles, Award, ArrowRight } from 'lucide-react';
import { useAuth, useCartWishlist, API_URL } from '../context/AppContext';

export const MembershipsPage = ({ plans, onOpenAuthModal, setTab }) => {
  const { user, token, updateProfile } = useAuth();
  const { showToast } = useCartWishlist();
  const [subscribingId, setSubscribingId] = useState(null);

  const handleSubscribe = async (plan) => {
    if (!token) {
      onOpenAuthModal();
      return;
    }

    setSubscribingId(plan.id);
    try {
      const res = await fetch(`${API_URL}/membership-plans/${plan.id}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Enrolled in ${plan.name}! Membership is active 🚀`);
        if (data.user) {
          updateProfile(data.user);
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubscribingId(null);
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Page Title */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
        <span className="badge-tag" style={{ marginBottom: '0.6rem' }}>Athletic Subscriptions</span>
        <h1 style={{ fontSize: '2.8rem', color: '#fff', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Personalized Coaching &amp; Tier Passes
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Transform your health with structured nutrition, continuous coach accountability, and members-only gear discounts.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem',
        alignItems: 'stretch',
        marginBottom: '5rem'
      }}>
        {plans.map(plan => {
          const isCurrentPlan = user?.membershipPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className="glass-card"
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: plan.popular ? '2px solid var(--accent-neon)' : '1px solid var(--border-subtle)',
                boxShadow: plan.popular ? '0 10px 40px rgba(163, 230, 53, 0.15)' : 'var(--shadow-sm)',
                background: plan.popular ? '#141a24' : 'var(--bg-card)'
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.popular ? 'var(--accent-neon)' : '#273142',
                  color: plan.popular ? '#0a0c10' : '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '0.3rem 1rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.4rem' }}>{plan.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', minHeight: '40px' }}>{plan.tagline}</p>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: '#fff' }}>
                  ${plan.price}
                </span>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>/{plan.billingCycle}</span>
              </div>

              {/* Features List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2.5rem', flex: 1 }}>
                {plan.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'rgba(163, 230, 53, 0.15)',
                      color: 'var(--accent-neon)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span style={{ color: '#e2e8f0', lineHeight: 1.4 }}>{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTA Action */}
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={subscribingId === plan.id || isCurrentPlan}
                className={plan.popular ? 'glow-btn' : 'secondary-btn'}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700
                }}
              >
                {isCurrentPlan ? (
                  '✓ Active Subscription'
                ) : subscribingId === plan.id ? (
                  'Activating Plan...'
                ) : (
                  `Enroll in ${plan.name}`
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Guarantee Banner */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        background: 'linear-gradient(90deg, #10151f 0%, #17202c 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={30} />
          </div>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.2rem' }}>
              Cancel Anytime &amp; 14-Day Money-Back Guarantee
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No long-term contracts. Pause or cancel anytime right from your user profile.
            </p>
          </div>
        </div>

        <button onClick={() => setTab('contact')} className="secondary-btn">
          Have Questions? Ask Coach
        </button>
      </div>
    </div>
  );
};
