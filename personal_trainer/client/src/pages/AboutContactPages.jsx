import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Award, 
  Dumbbell, 
  Users, 
  Target,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { API_URL, useCartWishlist } from '../context/AppContext';

export const AboutContactPages = ({ initialTab = 'about' }) => {
  const { showToast } = useCartWishlist();
  const [activeSubTab, setActiveSubTab] = useState(initialTab); // 'about' or 'contact'

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'VIP 1-on-1 Coaching Consultation',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await res.json();
      if (data.success) {
        setSentSuccess(true);
        setContactForm({ name: '', email: '', subject: 'VIP 1-on-1 Coaching Consultation', message: '' });
        showToast('Message received by Coach Marcus!');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Sub navigation Switch */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '3.5rem'
      }}>
        <div style={{
          display: 'inline-flex',
          background: '#121620',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveSubTab('about')}
            style={{
              padding: '0.65rem 2rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: activeSubTab === 'about' ? 'var(--accent-neon)' : 'transparent',
              color: activeSubTab === 'about' ? '#0a0c10' : 'var(--text-muted)'
            }}
          >
            Meet Coach Marcus (About)
          </button>
          <button
            onClick={() => setActiveSubTab('contact')}
            style={{
              padding: '0.65rem 2rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: activeSubTab === 'contact' ? 'var(--accent-neon)' : 'transparent',
              color: activeSubTab === 'contact' ? '#0a0c10' : 'var(--text-muted)'
            }}
          >
            Contact &amp; Location
          </button>
        </div>
      </div>

      {activeSubTab === 'about' ? (
        <div>
          {/* Trainer Hero Story */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
            marginBottom: '5rem'
          }}>
            <div style={{
              height: '480px',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-subtle)',
              position: 'relative'
            }}>
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80"
                alt="Head Coach Marcus"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem',
                background: 'linear-gradient(0deg, #0a0c10 0%, transparent 100%)'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Marcus Vance</div>
                <div style={{ color: 'var(--accent-neon)', fontSize: '0.88rem' }}>Founder, Master Trainer &amp; Strength Coach</div>
              </div>
            </div>

            <div>
              <span className="badge-tag" style={{ marginBottom: '0.8rem' }}>15+ Years Mastery</span>
              <h1 style={{ fontSize: '2.6rem', color: '#fff', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                Building Unstoppable Physiques on Scientific Discipline.
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Welcome to WorkDo Fit. I created this e-commerce platform and coaching collective with one clear objective: strip away the gym gimmicks and provide serious lifters with the exact tools, pure supplements, and rigorous biomechanics needed to achieve world-class results.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Whether you are stepping onto the competition stage, setting PRs in your home garage gym, or dropping body fat for personal vitality, our gear and customized plans are engineered to never let you fail.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ color: 'var(--accent-neon)', fontWeight: 900, fontSize: '1.8rem' }}>CSCS / IFBB</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Certified Strength Specialist</div>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ color: 'var(--accent-neon)', fontWeight: 900, fontSize: '1.8rem' }}>10k+ Athletes</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Transformed Worldwide</div>
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy Pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <Dumbbell size={32} color="var(--accent-neon)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Biomechanical Precision</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every barbell knurl angle and movement cue is calibrated to maximize motor unit recruitment while protecting your joints.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <Target size={32} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Clean Micronutrition</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                No proprietary filler blends. Pure ultra-filtered isolate proteins and clinical dosage ergogenic aids.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <ShieldCheck size={32} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Relentless Accountability</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Direct weekly check-ins, form breakdown videos, and real-time adjustments keep your progress accelerating.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Contact Tab */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'start'
        }}>
          {/* Contact Details & Headquarters */}
          <div>
            <span className="badge-tag" style={{ marginBottom: '0.8rem' }}>Get in Touch</span>
            <h2 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '1rem' }}>
              Let's Talk Training &amp; Equipment
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Have questions regarding custom gym outfitting, bulk supplement orders, or 1-on-1 VIP coaching? Reach out directly to Coach Marcus and the performance team.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(163, 230, 53, 0.15)', color: 'var(--accent-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Performance Center</div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>450 Iron Blvd, Austin, TX 78701</div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Direct Support Line</div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>+1 (800) 555-TRAIN (8724)</div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email Inquiries</div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>coaching@workdofit.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem' }}>
              Send Direct Message
            </h3>

            {sentSuccess ? (
              <div style={{
                background: 'rgba(163, 230, 53, 0.1)',
                border: '1px solid rgba(163, 230, 53, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={40} color="var(--accent-neon)" style={{ marginBottom: '0.8rem' }} />
                <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.4rem' }}>Message Dispatched!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Thank you for writing. Head Coach Marcus will review your inquiry within 24 hours.
                </p>
                <button onClick={() => setSentSuccess(false)} className="secondary-btn">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Aurelius"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="athlete@domain.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Topic / Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Message Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your fitness targets, equipment questions, or training level..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="glow-btn"
                  style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}
                >
                  <Send size={16} /> {sending ? 'Sending Message...' : 'Submit Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
